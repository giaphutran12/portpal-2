import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EntryTypeSelector } from '@/components/shifts/EntryTypeSelector'

export default async function AddShiftPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-center">Add Shift</h1>
      </div>
      <div className="p-4">
        <EntryTypeSelector />
      </div>
    </div>
  )
}
