import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from '@/lib/api/response'
import { calculateShiftPay, getDifferentialForJob } from '@/lib/pay'
import { getHoursOverride } from '@/lib/pay/paydiffs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const job = searchParams.get('job')
    const subjob = searchParams.get('subjob')
    const location = searchParams.get('location')
    const shiftType = searchParams.get('shift_type') || 'day'
    const hoursParam = searchParams.get('hours')
    const otHoursParam = searchParams.get('overtime_hours')
    const travelParam = searchParams.get('travel_hours')
    const mealParam = searchParams.get('meal')

    if (!job) return errorResponse('job parameter is required')

    const supabase = await createClient()
    const { data: overrides } = await supabase
      .from('pay_overrides')
      .select('*')

    let hours = hoursParam ? parseFloat(hoursParam) : 8
    let overtimeHours = otHoursParam ? parseFloat(otHoursParam) : 0

    if (location && overrides) {
      const override = getHoursOverride(overrides, job, subjob, location, shiftType)
      if (override) {
        hours = override.hours
        overtimeHours = override.overtimeHours
      }
    }

    const result = calculateShiftPay({
      job,
      hours,
      overtimeHours,
      travelHours: travelParam ? parseFloat(travelParam) : 0,
      includeMeal: mealParam === 'true',
    })

    return successResponse({
      job,
      subjob,
      location,
      shift_type: shiftType,
      hours,
      overtime_hours: overtimeHours,
      differential: getDifferentialForJob(job),
      ...result,
    })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
