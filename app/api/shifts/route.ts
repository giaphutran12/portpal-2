import { createClient } from '@/lib/supabase/server'
import { createShiftSchema } from '@/lib/api/validation'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/api/response'
import { calculateShiftPay } from '@/lib/pay'
import { calculateXP, calculatePoints } from '@/lib/gamification'
import { fetchAllRows } from '@/lib/supabase/pagination'

const LOG_PREFIX = '[API /shifts]'

export async function GET(request: Request) {
  console.log(`${LOG_PREFIX} GET - Fetching shifts`)
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.log(`${LOG_PREFIX} GET - Unauthorized: No user`)
      return unauthorizedResponse()
    }
    console.log(`${LOG_PREFIX} GET - User: ${user.id}`)

    const { searchParams } = new URL(request.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')
    console.log(`${LOG_PREFIX} GET - Params: start=${start}, end=${end}`)

    let query = supabase
      .from('shifts')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (start) query = query.gte('date', start)
    if (end) query = query.lte('date', end)

    const data = await fetchAllRows<any>(query)

    console.log(`${LOG_PREFIX} GET - Success: ${data?.length || 0} shifts`)
    return successResponse(data)
  } catch (error) {
    console.error(`${LOG_PREFIX} GET - Server Error:`, error)
    return serverErrorResponse(error)
  }
}

export async function POST(request: Request) {
  console.log(`${LOG_PREFIX} POST - Creating shift`)
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.log(`${LOG_PREFIX} POST - Unauthorized: No user`)
      return unauthorizedResponse()
    }
    console.log(`${LOG_PREFIX} POST - User: ${user.id}`)

    const body = await request.json()

    const validation = createShiftSchema.safeParse(body)

    if (!validation.success) {
      const errors = validation.error.issues.map(e => ({
        field: e.path.join('.'),
        message: e.message,
        code: e.code,
      }))
      console.error(`${LOG_PREFIX} POST - Validation failed:`, JSON.stringify(errors, null, 2))
      return validationErrorResponse(validation.error)
    }

    const shiftData = validation.data

    let totalPay = shiftData.total_pay
    let rate = shiftData.rate
    let overtimeRate = shiftData.overtime_rate

    if (shiftData.entry_type === 'worked' && shiftData.job && !totalPay) {
      console.log(`${LOG_PREFIX} POST - Calculating pay for job: ${shiftData.job}`)
      const payResult = calculateShiftPay({
        job: shiftData.job,
        hours: shiftData.hours || 0,
        overtimeHours: shiftData.overtime_hours,
        travelHours: shiftData.travel_hours,
        includeMeal: shiftData.meal,
      })
      totalPay = payResult.totalPay
      rate = payResult.regularRate
      overtimeRate = payResult.overtimeRate
      console.log(`${LOG_PREFIX} POST - Calculated pay: $${totalPay}`)
    }

    const pointsEarned = calculatePoints(totalPay)
    console.log(`${LOG_PREFIX} POST - Points earned: ${pointsEarned}`)

    // Handle stat_holiday field mapping
    let holidayName: string | null = null
    let qualifyingDaysNum: number | null = null
    
    if (shiftData.entry_type === 'stat_holiday') {
      // Look up holiday name from holiday_id
      if (shiftData.holiday_id) {
        const { data: holidayData } = await supabase
          .from('holidays')
          .select('name')
          .eq('id', shiftData.holiday_id)
          .single()
        
        if (holidayData) {
          holidayName = holidayData.name
          console.log(`${LOG_PREFIX} POST - Holiday name lookup: ${holidayName}`)
        }
      }
      
      // Convert qualifying_days string to number
      if (shiftData.qualifying_days) {
        const qd = String(shiftData.qualifying_days)
        if (qd === '15+' || qd.startsWith('15')) {
          qualifyingDaysNum = 15
        } else if (qd === '1-14' || qd.includes('14')) {
          qualifyingDaysNum = 14
        } else {
          qualifyingDaysNum = parseInt(qd) || null
        }
        console.log(`${LOG_PREFIX} POST - Qualifying days: ${qd} -> ${qualifyingDaysNum}`)
      }
    }

    // Build insert data, excluding holiday_id (not a DB column)
    const { holiday_id, ...shiftDataWithoutHolidayId } = shiftData as typeof shiftData & { holiday_id?: string }
    
    const insertData = {
      user_id: user.id,
      ...shiftDataWithoutHolidayId,
      rate,
      overtime_rate: overtimeRate,
      total_pay: totalPay,
      points_earned: pointsEarned,
      // Override with mapped values for stat_holiday
      ...(holidayName && { holiday: holidayName }),
      ...(qualifyingDaysNum !== null && { qualifying_days: qualifyingDaysNum }),
    }

    const { data, error } = await supabase
      .from('shifts')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error(`${LOG_PREFIX} POST - DB Insert Error:`, error)
      return errorResponse(error.message)
    }

    console.log(`${LOG_PREFIX} POST - Shift created: ${data.id}`)

    if (shiftData.entry_type === 'leave' && shiftData.leave_type) {
      console.log(`${LOG_PREFIX} POST - Updating leave count for type: ${shiftData.leave_type}`)
      
      const { data: profile } = await supabase
        .from('users')
        .select('sick_days_used, personal_leave_used')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        let updateData: Record<string, number> = {}
        
        if (shiftData.leave_type === 'sick_leave') {
          updateData = { sick_days_used: (profile.sick_days_used || 0) + 1 }
        } else if (shiftData.leave_type === 'personal_leave') {
          updateData = { personal_leave_used: (profile.personal_leave_used || 0) + 1 }
        }
        
        if (Object.keys(updateData).length > 0) {
          const { error: leaveUpdateError } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', user.id)
          
          if (leaveUpdateError) {
            console.warn(`${LOG_PREFIX} POST - Leave count update failed (non-fatal):`, leaveUpdateError)
          } else {
            console.log(`${LOG_PREFIX} POST - Leave count updated:`, updateData)
          }
        }
      }
    }

    const xpEarned = calculateXP({ entryType: shiftData.entry_type })
    console.log(`${LOG_PREFIX} POST - XP earned: ${xpEarned}`)

    const { error: xpError } = await supabase
      .from('users')
      .update({ xp: supabase.rpc('increment_xp', { amount: xpEarned }) })
      .eq('id', user.id)

    if (xpError) {
      console.warn(`${LOG_PREFIX} POST - XP update failed (non-fatal):`, xpError)
    }

    console.log(`${LOG_PREFIX} POST - Success!`)
    return successResponse(data, 201)
  } catch (error) {
    console.error(`${LOG_PREFIX} POST - Server Error:`, error)
    return serverErrorResponse(error)
  }
}
