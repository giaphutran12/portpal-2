import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { WorkedWizard } from '@/components/shifts/WorkedWizard'
import { fetchAllRows } from '@/lib/supabase/pagination'

export default async function AddWorkedShiftPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

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

  const locations = await fetchAllRows<any>(
    supabase
      .from('locations')
      .select('*')
      .order('name')
  )

  const jobsWithSubjobs = jobs.map((job) => ({
    ...job,
    subjobs: subjobs.filter((s) => s.job_id === job.id).map((s) => s.name),
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-center">Add WORKED Shift</h1>
      </div>
      <WorkedWizard jobs={jobsWithSubjobs} locations={locations} />
    </div>
  )
}
