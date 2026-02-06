import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GoalCard } from '@/components/goals/GoalCard'
import { Plus, Target } from 'lucide-react'
import { fetchAllRows } from '@/lib/supabase/pagination'

export default async function GoalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  const goals = await fetchAllRows<any>(
    supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">My Goals</h1>
        <Button asChild size="sm">
          <Link href="/goals/create">
            <Plus className="h-4 w-4 mr-1" />
            Create Goal
          </Link>
        </Button>
      </div>

      <div className="p-4 space-y-3">
        {goals && goals.length > 0 ? (
          goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Target className="h-8 w-8" />
            </div>
            <p className="text-lg font-medium mb-2">No goals yet</p>
            <p className="mb-4">Create one to track your progress!</p>
            <Button asChild>
              <Link href="/goals/create">
                <Plus className="h-4 w-4 mr-2" />
                Create your first goal
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
