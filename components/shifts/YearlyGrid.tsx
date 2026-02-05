'use client'

import { addYears, eachMonthOfInterval, endOfYear, format, getYear, isSameMonth, parseISO, startOfYear, subYears } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarNav } from './CalendarNav'
import { Shift } from './types'
import { cn } from '@/lib/utils'

interface YearlyGridProps {
  currentDate: string
  shifts: Shift[]
}

export function YearlyGrid({ currentDate, shifts }: YearlyGridProps) {
  const router = useRouter()
  const dateObj = parseISO(currentDate)
  const currentYear = getYear(dateObj)
  
  const yearStart = startOfYear(dateObj)
  const yearEnd = endOfYear(dateObj)
  
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd })

  const handlePrev = () => {
    if (currentYear <= 2025) return
    const newDate = subYears(dateObj, 1)
    router.push(`?date=${format(newDate, 'yyyy-MM-dd')}`)
  }

  const handleNext = () => {
    const newDate = addYears(dateObj, 1)
    router.push(`?date=${format(newDate, 'yyyy-MM-dd')}`)
  }

  const handleMonthClick = (month: Date) => {
    router.push(`/index/shifts/monthly?date=${format(month, 'yyyy-MM-dd')}`)
  }

  // Calculate stats
  const totalShifts = shifts.length
  const totalHours = shifts.reduce((sum, _) => sum + 0, 0) // Placeholder for hours
  const avgPayPerShift = totalShifts > 0 
    ? shifts.reduce((sum, s) => sum + (s.total_pay || 0), 0) / totalShifts 
    : 0

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShifts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
            <p className="text-xs text-muted-foreground">Hours not in DB yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Earned/Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgPayPerShift.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <CalendarNav 
        onPrev={handlePrev} 
        onNext={handleNext} 
        label={format(dateObj, 'yyyy')} 
        prevDisabled={currentYear <= 2025}
      />

      {/* Yearly Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map((month) => {
          const monthShifts = shifts.filter(s => isSameMonth(parseISO(s.date), month))
          const shiftCount = monthShifts.length
          const isCurrentMonth = isSameMonth(month, new Date())
          
          return (
            <Card 
              key={month.toISOString()}
              onClick={() => handleMonthClick(month)}
              className={cn(
                "cursor-pointer hover:bg-accent/50 transition-colors",
                isCurrentMonth && "border-primary border-2"
              )}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                <span className="text-lg font-semibold">{format(month, 'MMMM')}</span>
                <span className={cn(
                  "text-sm font-medium px-2 py-1 rounded-full",
                  shiftCount > 0 ? "bg-primary/10 text-primary" : "text-muted-foreground bg-muted"
                )}>
                  {shiftCount} shift{shiftCount !== 1 ? 's' : ''}
                </span>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
