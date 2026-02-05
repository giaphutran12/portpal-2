'use client'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface GoalProgressProps {
  currentValue: number
  targetValue: number
  kind: 'earnings' | 'hours' | 'shifts' | 'pension'
  size?: 'sm' | 'default'
  showLabel?: boolean
  className?: string
}

export function GoalProgress({
  currentValue,
  targetValue,
  kind,
  size = 'default',
  showLabel = true,
  className,
}: GoalProgressProps) {
  const percentage = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0
  const isComplete = percentage >= 100

  const formatValue = (value: number) => {
    switch (kind) {
      case 'earnings':
      case 'pension':
        return `$${value.toLocaleString()}`
      case 'hours':
        return `${value.toLocaleString()} hrs`
      case 'shifts':
        return `${value.toLocaleString()} shifts`
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-sm">
          <span className={cn(
            'font-medium',
            isComplete && 'text-green-600 dark:text-green-400'
          )}>
            {formatValue(currentValue)}
          </span>
          <span className="text-muted-foreground">
            / {formatValue(targetValue)}
          </span>
        </div>
      )}
      <Progress 
        value={percentage} 
        className={cn(
          size === 'sm' && 'h-1.5',
          isComplete && '[&>[data-slot=progress-indicator]]:bg-green-500'
        )}
      />
      {showLabel && (
        <div className="text-xs text-muted-foreground text-right">
          {percentage.toFixed(0)}% complete
        </div>
      )}
    </div>
  )
}
