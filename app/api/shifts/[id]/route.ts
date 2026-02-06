import { createClient } from '@/lib/supabase/server'
import { updateShiftSchema } from '@/lib/api/validation'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api/response'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return unauthorizedResponse()

    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return notFoundResponse('Shift')
      return errorResponse(error.message)
    }

    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return unauthorizedResponse()

    const body = await request.json()
    const validation = updateShiftSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const shiftData = validation.data

    const { data: existingShift, error: existingShiftError } = await supabase
      .from('shifts')
      .select('entry_type, leave_type')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (existingShiftError) {
      if (existingShiftError.code === 'PGRST116') return notFoundResponse('Shift')
      return errorResponse(existingShiftError.message)
    }
    
    // Handle stat_holiday: convert holiday_id to holiday name
    let holidayName: string | null = null
    let qualifyingDaysNum: number | null = null
    
    if (shiftData.entry_type === 'stat_holiday' && shiftData.holiday_id) {
      const { data: holidayData } = await supabase
        .from('holidays')
        .select('name')
        .eq('id', shiftData.holiday_id)
        .single()
      
      if (holidayData) {
        holidayName = holidayData.name
      }
    }
    
    // Convert qualifying_days string to number if present
    if (shiftData.qualifying_days) {
      const qd = String(shiftData.qualifying_days)
      if (qd === '15+' || qd.startsWith('15')) {
        qualifyingDaysNum = 15
      } else if (qd === '1-14' || qd.includes('14')) {
        qualifyingDaysNum = 14
      } else {
        qualifyingDaysNum = parseInt(qd) || null
      }
    }
    
    // Build update data, excluding holiday_id (not a DB column)
    const { holiday_id, ...updateDataWithoutHolidayId } = shiftData as typeof shiftData & { holiday_id?: string }
    
    const updateData = {
      ...updateDataWithoutHolidayId,
      ...(holidayName && { holiday: holidayName }),
      ...(qualifyingDaysNum !== null && { qualifying_days: qualifyingDaysNum }),
    }

    const { data, error } = await supabase
      .from('shifts')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') return notFoundResponse('Shift')
      return errorResponse(error.message)
    }

    const wasLeave = existingShift?.entry_type === 'leave'
    const isLeave = data.entry_type === 'leave'

    let leaveTypeToDecrement: string | null = null
    let leaveTypeToIncrement: string | null = null

    if (wasLeave && !isLeave) {
      leaveTypeToDecrement = existingShift?.leave_type || null
    } else if (!wasLeave && isLeave) {
      leaveTypeToIncrement = data.leave_type || null
    } else if (wasLeave && isLeave && existingShift?.leave_type !== data.leave_type) {
      leaveTypeToDecrement = existingShift?.leave_type || null
      leaveTypeToIncrement = data.leave_type || null
    }

    if (leaveTypeToDecrement || leaveTypeToIncrement) {
      const { data: profile } = await supabase
        .from('users')
        .select('sick_days_used, personal_leave_used')
        .eq('id', user.id)
        .single()

      if (profile) {
        const currentSick = profile.sick_days_used || 0
        const currentPersonal = profile.personal_leave_used || 0
        let nextSick = currentSick
        let nextPersonal = currentPersonal

        if (leaveTypeToDecrement === 'sick_leave' && nextSick > 0) {
          nextSick -= 1
        } else if (leaveTypeToDecrement === 'personal_leave' && nextPersonal > 0) {
          nextPersonal -= 1
        }

        if (leaveTypeToIncrement === 'sick_leave') {
          nextSick += 1
        } else if (leaveTypeToIncrement === 'personal_leave') {
          nextPersonal += 1
        }

        const updateData: Record<string, number> = {}
        if (nextSick !== currentSick) updateData.sick_days_used = nextSick
        if (nextPersonal !== currentPersonal) updateData.personal_leave_used = nextPersonal

        if (Object.keys(updateData).length > 0) {
          await supabase.from('users').update(updateData).eq('id', user.id)
        }
      }
    }

    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return unauthorizedResponse()

    const { data: existingShift } = await supabase
      .from('shifts')
      .select('entry_type, leave_type')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return errorResponse(error.message)

    if (existingShift?.entry_type === 'leave' && existingShift?.leave_type) {
      const { data: profile } = await supabase
        .from('users')
        .select('sick_days_used, personal_leave_used')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        let updateData: Record<string, number> = {}
        
        if (existingShift.leave_type === 'sick_leave' && (profile.sick_days_used || 0) > 0) {
          updateData = { sick_days_used: (profile.sick_days_used || 0) - 1 }
        } else if (existingShift.leave_type === 'personal_leave' && (profile.personal_leave_used || 0) > 0) {
          updateData = { personal_leave_used: (profile.personal_leave_used || 0) - 1 }
        }
        
        if (Object.keys(updateData).length > 0) {
          await supabase.from('users').update(updateData).eq('id', user.id)
        }
      }
    }

    return successResponse({ success: true })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
