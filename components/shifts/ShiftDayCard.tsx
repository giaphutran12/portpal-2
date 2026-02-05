'use client'

import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Shift } from './types'
import { cn } from '@/lib/utils'

interface ShiftDayCardProps {
  date: Date
  shifts: Shift[]
  isToday?: boolean
  onClick?: () => void
  className?: string
}

export function ShiftDayCard({ date, shifts, isToday, onClick, className }: ShiftDayCardProps) {
  const hasShifts = shifts.length > 0
  const totalPay = shifts.reduce((sum, shift) => sum + (shift.total_pay || 0), 0)
  
  return (
    <Card 
      className={cn(
        "flex items-center p-4 cursor-pointer transition-colors hover:bg-accent/50", 
        isToday && "border-primary border-2",
        className
      )}
      onClick={onClick}
    >
      <div className="w-16 flex flex-col items-center justify-center mr-4 border-r pr-4">
        <span className="text-xs font-bold text-muted-foreground uppercase">
          {format(date, 'EEE')}
        </span>
        <span className="text-xl font-bold">
          {format(date, 'd')}
        </span>
      </div>
      
      <div className="flex-1">
        {hasShifts ? (
          <div className="space-y-1">
            {shifts.map(shift => (
              <div key={shift.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{shift.entry_type}</span>
                  {shift.job && (
                    <span className="text-muted-foreground text-xs">
                       • {shift.job}
                    </span>
                  )}
                </div>
                {shift.total_pay && shift.total_pay > 0 && (
                   <span className="font-mono text-xs">
                     ${shift.total_pay.toFixed(2)}
                   </span>
                )}
              </div>
            ))}
            {shifts.length > 1 && totalPay > 0 && (
              <div className="pt-1 mt-1 border-t text-xs font-bold text-right">
                Total: ${totalPay.toFixed(2)}
              </div>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm italic">No Shift</span>
        )}
      </div>
      
      {isToday && (
        <Badge variant="secondary" className="ml-2 absolute top-2 right-2 text-[10px] px-1 h-5">
          TODAY
        </Badge>
      )}
    </Card>
  )
}
