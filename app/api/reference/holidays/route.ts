import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  errorResponse,
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
        .from('holidays')
        .select('*')
        .order('date')
    )

    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
