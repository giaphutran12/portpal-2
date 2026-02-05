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

    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .order('name')

    if (jobsError) return errorResponse(jobsError.message)

    const { data: subjobs, error: subjobsError } = await supabase
      .from('subjobs')
      .select('*')

    if (subjobsError) return errorResponse(subjobsError.message)

    const jobsWithSubjobs = jobs.map((job) => ({
      ...job,
      subjobs: subjobs.filter((s) => s.job_id === job.id).map((s) => s.name),
    }))

    return successResponse(jobsWithSubjobs)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
