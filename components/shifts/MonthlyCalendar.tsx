'use client'

import { 
  addMonths, 
  eachDayOfInterval, 
  endOfMonth, 
  endOfWeek, 
  format, 
  isSameDay, 
  isSameMonth, 
  parseISO, 
  startOfMonth, 
  startOfWeek, 
  subMonths 
} from 'date-fns'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { CalendarNav } from './CalendarNav'
import { Shift } from './types'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface MonthlyCalendarProps {
  currentDate: string
  shifts: Shift[]
}

export function MonthlyCalendar({ currentDate, shifts }: MonthlyCalendarProps) {
  const router = useRouter()
  const dateObj = parseISO(currentDate)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  const monthStart = startOfMonth(dateObj)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const handlePrev = () => {
    const newDate = subMonths(dateObj, 1)
    router.push(`?date=${format(newDate, 'yyyy-MM-dd')}`)
  }

  const handleNext = () => {
    const newDate = addMonths(dateObj, 1)
    router.push(`?date=${format(newDate, 'yyyy-MM-dd')}`)
  }

  const handleDayClick = (day: Date) => {
    setSelectedDate(day)
  }

  // Short weekday names for mobile, full for desktop
  const weekDaysFull = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weekDaysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="space-y-4 sm:space-y-6">
      <CalendarNav 
        onPrev={handlePrev} 
        onNext={handleNext} 
        label={format(dateObj, 'MMMM yyyy')} 
      />

      <div className="border rounded-lg overflow-x-auto">
        <div className="min-w-[320px]">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-muted border-b">
            {weekDaysFull.map((day, i) => (
              <div key={day} className="p-1 sm:p-2 text-center text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{weekDaysShort[i]}</span>
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 bg-background">
            {days.map((day) => {
              const dayShifts = shifts.filter(s => isSameDay(parseISO(s.date), day))
              const isCurrentMonth = isSameMonth(day, monthStart)
              const isToday = isSameDay(day, new Date())
              
              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "min-h-[60px] sm:min-h-[100px] p-1 sm:p-2 border-b border-r relative cursor-pointer hover:bg-accent/50 transition-colors",
                    !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "text-xs sm:text-sm font-medium h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-full",
                      isToday && "bg-primary text-primary-foreground"
                    )}>
                      {format(day, 'd')}
                    </span>
                  </div>

                  <div className="mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1">
                    {dayShifts.slice(0, 1).map(shift => (
                      <div 
                        key={shift.id} 
                        className="text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded bg-primary/10 text-primary truncate font-medium"
                        title={`${shift.entry_type} - ${shift.job || 'No Job'}`}
                      >
                        <span className="hidden sm:inline">{shift.entry_type}</span>
                        <span className="sm:hidden">{shift.entry_type.charAt(0)}</span>
                      </div>
                    ))}
                    {dayShifts.length > 1 && (
                      <div className="text-[8px] sm:text-[10px] text-muted-foreground pl-0.5 sm:pl-1">
                        +{dayShifts.length - 1}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Selected Day Shifts Section */}
      {selectedDate && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          {(() => {
            const dayShifts = shifts.filter(s => isSameDay(parseISO(s.date), selectedDate))
            if (dayShifts.length === 0) {
              return (
                <Card>
                  <CardContent className="p-4 text-center text-muted-foreground">
                    No shifts logged for this day
                  </CardContent>
                </Card>
              )
            }
            return dayShifts.map(shift => (
              <Link key={shift.id} href={`/shifts/${shift.id}`}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium capitalize">{shift.entry_type.replace('_', ' ')}</div>
                        {shift.job && (
                          <div className="text-sm text-muted-foreground">
                            {shift.job}{shift.subjob && ` - ${shift.subjob}`}
                          </div>
                        )}
                        {shift.location && (
                          <div className="text-sm text-muted-foreground">{shift.location}</div>
                        )}
                        {shift.holiday && (
                          <div className="text-sm text-muted-foreground">{shift.holiday}</div>
                        )}
                      </div>
                      {shift.total_pay && shift.total_pay > 0 && (
                        <div className="text-lg font-bold">${shift.total_pay.toFixed(2)}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          })()}
        </div>
      )}
    </div>
  )
}
