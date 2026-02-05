import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/api/response'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return unauthorizedResponse()

    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name')

    if (error) return errorResponse(error.message)

    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
