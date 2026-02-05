import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GoalForm } from '@/components/goals/GoalForm'
import { ArrowLeft } from 'lucide-react'

export default async function CreateGoalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/goals">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Create Goal</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto">
        <GoalForm mode="create" />
      </div>
    </div>
  )
}
