'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GoalProgress } from '@/components/goals/GoalProgress'
import { GoalForm } from '@/components/goals/GoalForm'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ArrowLeft, Pencil, Trash2, CalendarDays, Target, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface Goal {
  id: string
  name: string
  goal_type: 'weekly' | 'monthly' | 'yearly'
  kind: 'earnings' | 'hours' | 'shifts' | 'pension'
  start_date: string
  end_date: string
  target: number
  current_value: number
  created_at: string
}

const typeLabels: Record<Goal['goal_type'], string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
}

const kindLabels: Record<Goal['kind'], string> = {
  earnings: 'Earnings',
  hours: 'Hours',
  shifts: 'Shifts',
  pension: 'Pension',
}

export default function GoalDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [goal, setGoal] = useState<Goal | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    async function fetchGoal() {
      try {
        const res = await fetch(`/api/goals/${params.id}`)
        if (!res.ok) {
          if (res.status === 404) {
            toast.error('Goal not found')
            router.push('/goals')
            return
          }
          throw new Error('Failed to fetch goal')
        }
        const data = await res.json()
        setGoal(data)
      } catch {
        toast.error('Failed to load goal')
        router.push('/goals')
      } finally {
        setLoading(false)
      }
    }
    fetchGoal()
  }, [params.id, router])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/goals/${params.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Goal deleted')
      router.push('/goals')
    } catch {
      toast.error('Failed to delete goal')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!goal) return null

  if (isEditing) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 border-b flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Edit Goal</h1>
        </div>
        <div className="p-4 max-w-lg mx-auto">
          <GoalForm goal={goal} mode="edit" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/goals">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold truncate">{goal.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={deleting}>
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{goal.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} variant="destructive">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Progress
              </CardTitle>
              <div className="flex gap-1.5">
                <Badge variant="secondary">{typeLabels[goal.goal_type]}</Badge>
                <Badge variant="outline">{kindLabels[goal.kind]}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <GoalProgress
              currentValue={goal.current_value}
              targetValue={goal.target}
              kind={goal.kind}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Start Date</span>
              <span className="font-medium">{format(new Date(goal.start_date), 'PPP')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">End Date</span>
              <span className="font-medium">{format(new Date(goal.end_date), 'PPP')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="font-medium">{format(new Date(goal.created_at), 'PPP')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
