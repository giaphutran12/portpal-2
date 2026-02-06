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

    const jobs = await fetchAllRows<any>(
      supabase
        .from('jobs')
        .select('*')
        .order('name')
    )

    const subjobs = await fetchAllRows<any>(
      supabase
        .from('subjobs')
        .select('*')
    )

    const jobsWithSubjobs = jobs.map((job) => ({
      ...job,
      subjobs: subjobs.filter((s) => s.job_id === job.id).map((s) => s.name),
    }))

    return successResponse(jobsWithSubjobs)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
