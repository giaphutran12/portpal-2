'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GoalProgress } from './GoalProgress'
import { Target, CalendarDays, TrendingUp, Clock, DollarSign, Briefcase } from 'lucide-react'
import { format } from 'date-fns'

interface Goal {
  id: string
  name: string
  goal_type: 'weekly' | 'monthly' | 'yearly'
  kind: 'earnings' | 'hours' | 'shifts' | 'pension'
  start_date: string
  end_date: string
  target: number
  current_value: number
}

interface GoalCardProps {
  goal: Goal
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

const kindIcons: Record<Goal['kind'], typeof DollarSign> = {
  earnings: DollarSign,
  hours: Clock,
  shifts: Briefcase,
  pension: TrendingUp,
}

export function GoalCard({ goal }: GoalCardProps) {
  const KindIcon = kindIcons[goal.kind]

  return (
    <Link href={`/goals/${goal.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <KindIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                  {goal.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <CalendarDays className="h-3 w-3" />
                  <span>
                    {format(new Date(goal.end_date), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <Badge variant="secondary" className="text-[10px] px-1.5">
                {typeLabels[goal.goal_type]}
              </Badge>
              <Badge variant="outline" className="text-[10px] px-1.5">
                {kindLabels[goal.kind]}
              </Badge>
            </div>
          </div>
          
          <GoalProgress
            currentValue={goal.current_value}
            targetValue={goal.target}
            kind={goal.kind}
            size="sm"
            showLabel={true}
          />
        </CardContent>
      </Card>
    </Link>
  )
}
