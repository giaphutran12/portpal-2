import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { VacationForm } from '@/components/shifts/VacationForm'

export default async function AddVacationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-center">Add Vacation</h1>
      </div>
      <VacationForm />
    </div>
  )
}
