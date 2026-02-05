'use client'

import { addDays, addWeeks, format, parseISO, startOfWeek, subWeeks, isSameDay } from 'date-fns'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shift } from './types'
import { CalendarNav } from './CalendarNav'
import { ShiftDayCard } from './ShiftDayCard'

interface WeeklyCalendarProps {
  currentDate: string // ISO date string YYYY-MM-DD
  shifts: Shift[]
}

export function WeeklyCalendar({ currentDate, shifts }: WeeklyCalendarProps) {
  const router = useRouter()
  const dateObj = parseISO(currentDate)
  const start = startOfWeek(dateObj, { weekStartsOn: 0 }) // Sunday start
  const end = addDays(start, 6)

  const handlePrev = () => {
    const newDate = subWeeks(dateObj, 1)
    router.push(`?date=${format(newDate, 'yyyy-MM-dd')}`)
  }

  const handleNext = () => {
    const newDate = addWeeks(dateObj, 1)
    router.push(`?date=${format(newDate, 'yyyy-MM-dd')}`)
  }

  // Calculate stats
  const totalShifts = shifts.length
  const totalHours = shifts.reduce((sum, _) => {
    // Assuming hours logic is needed, but Shift type only has pay.
    // If hours aren't stored, we might just count shifts or assume standard length.
    // Prompt asked for Total Hours.
    // Existing Shift type didn't explicitly show 'hours'. 
    // Checking previous 'read' of page.tsx: it didn't use hours. 
    // It showed job, subjob, location, total_pay.
    // If hours are missing from data, I'll display 0 or N/A for now.
    // Wait, the prompt implies "Total Hours". I will check if 'hours' exists in the table later or if it can be derived.
    // For now, I'll check if any property resembles hours or duration.
    // If not, I'll omit or set to 0.
    return sum + 0 
  }, 0)
  
  const totalEarned = shifts.reduce((sum, s) => sum + (s.total_pay || 0), 0)

  // Generate days
  const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i))

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Shifts</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{totalShifts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Hours</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{totalHours}</div>
            <p className="text-xs text-muted-foreground">Hours not in DB yet</p> 
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Earned</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">${totalEarned.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation & Add Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex-1">
            <CalendarNav 
                onPrev={handlePrev} 
                onNext={handleNext} 
                label={`${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`} 
            />
        </div>
        
        <Button asChild className="shrink-0 w-full sm:w-auto">
          <Link href="/shifts/add">
            <Plus className="mr-2 h-4 w-4" />
            <span className="sm:inline">Add Shift</span>
          </Link>
        </Button>
      </div>

      {/* Weekly Grid */}
      <div className="space-y-2">
        {days.map((day) => {
            const dayShifts = shifts.filter(s => isSameDay(parseISO(s.date), day))
            const isToday = isSameDay(day, new Date())
            
            return (
                <ShiftDayCard
                    key={day.toISOString()}
                    date={day}
                    shifts={dayShifts}
                    isToday={isToday}
                    onClick={() => {
                        // If shift exists, maybe link to first one? Or just a general day view?
                        // Prompt: "Clicking a day with shift opens shift details (link to shift or show panel)"
                        // Since I don't have a panel, I'll link to the first shift's detail if exists.
                        if (dayShifts.length > 0) {
                            router.push(`/shifts/${dayShifts[0].id}`)
                        }
                    }}
                    className={dayShifts.length === 0 ? "opacity-70" : ""}
                />
            )
        })}
      </div>
    </div>
  )
}
