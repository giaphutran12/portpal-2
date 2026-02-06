import { createClient } from '@/lib/supabase/server'
import { createGoalSchema } from '@/lib/api/validation'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/api/response'
import { fetchAllRows } from '@/lib/supabase/pagination'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return unauthorizedResponse()

    const data = await fetchAllRows<any>(
      supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    )

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
    const validation = createGoalSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        ...validation.data,
        current_value: 0,
      })
      .select()
      .single()

    if (error) return errorResponse(error.message)

    return successResponse(data, 201)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
