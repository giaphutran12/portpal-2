'use client'

import { addDays, addWeeks, format, parseISO, startOfWeek, subWeeks, isSameDay } from 'date-fns'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  const totalHours = shifts.reduce((sum, s) => {
    // Sum regular hours + overtime hours for each shift
    const regular = s.hours || 0
    const overtime = s.overtime_hours || 0
    return sum + regular + overtime
  }, 0)
  
  const totalEarned = shifts.reduce((sum, s) => sum + (s.total_pay || 0), 0)

  const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i))

  const shiftsByDay = useMemo(() => {
    const map = new Map<string, Shift[]>()
    shifts.forEach(s => {
      const key = format(parseISO(s.date), 'yyyy-MM-dd')
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    })
    return map
  }, [shifts])

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
            const dayKey = format(day, 'yyyy-MM-dd')
            const dayShifts = shiftsByDay.get(dayKey) || []
            const isToday = isSameDay(day, new Date())
            const dayParam = dayKey
            const buildShiftHref = (shiftId: string) => `/shifts/${shiftId}?from=weekly&date=${dayParam}`
            
            if (dayShifts.length > 1) {
              return (
                <DropdownMenu key={day.toISOString()}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full text-left p-0 border-0 bg-transparent"
                    >
                      <ShiftDayCard
                        date={day}
                        shifts={dayShifts}
                        isToday={isToday}
                        className={dayShifts.length === 0 ? "opacity-70" : ""}
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72 max-h-72 overflow-y-auto">
                    {dayShifts.map((shift) => {
                      const payLabel = typeof shift.total_pay === 'number'
                        ? `$${shift.total_pay.toFixed(2)}`
                        : '--'

                      return (
                        <DropdownMenuItem
                          key={shift.id}
                          onClick={() => router.push(buildShiftHref(shift.id))}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{shift.entry_type}</span>
                            {shift.job && (
                              <span className="text-xs text-muted-foreground">- {shift.job}</span>
                            )}
                          </div>
                          <span className="font-mono text-xs">{payLabel}</span>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }

            return (
              <ShiftDayCard
                key={day.toISOString()}
                date={day}
                shifts={dayShifts}
                isToday={isToday}
                onClick={dayShifts.length === 1 ? () => router.push(buildShiftHref(dayShifts[0].id)) : undefined}
                className={dayShifts.length === 0 ? "opacity-70" : ""}
              />
            )
        })}
      </div>
    </div>
  )
}
