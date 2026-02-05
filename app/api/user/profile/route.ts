import { createClient } from '@/lib/supabase/server'
import { updateProfileSchema } from '@/lib/api/validation'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/api/response'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return unauthorizedResponse()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) return errorResponse(error.message)

    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return unauthorizedResponse()

    const body = await request.json()
    const validation = updateProfileSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const { data, error } = await supabase
      .from('users')
      .update(validation.data)
      .eq('id', user.id)
      .select()
      .single()

    if (error) return errorResponse(error.message)

    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
