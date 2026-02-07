import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LeaveForm } from '@/components/shifts/LeaveForm'

export default async function AddLeavePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-center">Add Leave</h1>
      </div>
      <LeaveForm />
    </div>
  )
}
