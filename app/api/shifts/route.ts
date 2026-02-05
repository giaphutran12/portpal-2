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

    const { data, error } = await query

    if (error) {
      console.error(`${LOG_PREFIX} GET - DB Error:`, error)
      return errorResponse(error.message)
    }

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
    console.log(`${LOG_PREFIX} POST - Request body:`, JSON.stringify(body, null, 2))

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
    console.log(`${LOG_PREFIX} POST - Validated data:`, JSON.stringify(shiftData, null, 2))

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

    const insertData = {
      user_id: user.id,
      ...shiftData,
      rate,
      overtime_rate: overtimeRate,
      total_pay: totalPay,
      points_earned: pointsEarned,
    }
    console.log(`${LOG_PREFIX} POST - Insert data:`, JSON.stringify(insertData, null, 2))

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
