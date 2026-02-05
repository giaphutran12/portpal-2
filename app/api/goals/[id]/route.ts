import { createClient } from '@/lib/supabase/server'
import { updateGoalSchema } from '@/lib/api/validation'
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
      .from('goals')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return notFoundResponse('Goal')
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
    const validation = updateGoalSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const { data, error } = await supabase
      .from('goals')
      .update(validation.data)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') return notFoundResponse('Goal')
      return errorResponse(error.message)
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

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return errorResponse(error.message)

    return successResponse({ success: true })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
