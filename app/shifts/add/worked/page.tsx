import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { WorkedWizard } from '@/components/shifts/WorkedWizard'

export default async function AddWorkedShiftPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .order('name')

  const { data: subjobs } = await supabase
    .from('subjobs')
    .select('*')

  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .order('name')

  const jobsWithSubjobs = (jobs || []).map((job) => ({
    ...job,
    subjobs: (subjobs || []).filter((s) => s.job_id === job.id).map((s) => s.name),
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-center">Add WORKED Shift</h1>
      </div>
      <WorkedWizard jobs={jobsWithSubjobs} locations={locations || []} />
    </div>
  )
}
