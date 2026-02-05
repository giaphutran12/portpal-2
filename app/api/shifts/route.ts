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

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    let query = supabase
      .from('shifts')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (start) query = query.gte('date', start)
    if (end) query = query.lte('date', end)

    const { data, error } = await query

    if (error) return errorResponse(error.message)

    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return unauthorizedResponse()

    const body = await request.json()
    const validation = createShiftSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const shiftData = validation.data

    let totalPay = shiftData.total_pay
    let rate = shiftData.rate
    let overtimeRate = shiftData.overtime_rate

    if (shiftData.entry_type === 'worked' && shiftData.job && !totalPay) {
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
    }

    const pointsEarned = calculatePoints(totalPay)

    const { data, error } = await supabase
      .from('shifts')
      .insert({
        user_id: user.id,
        ...shiftData,
        rate,
        overtime_rate: overtimeRate,
        total_pay: totalPay,
        points_earned: pointsEarned,
      })
      .select()
      .single()

    if (error) return errorResponse(error.message)

    const xpEarned = calculateXP({ entryType: shiftData.entry_type })
    await supabase
      .from('users')
      .update({ xp: supabase.rpc('increment_xp', { amount: xpEarned }) })
      .eq('id', user.id)

    return successResponse(data, 201)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
