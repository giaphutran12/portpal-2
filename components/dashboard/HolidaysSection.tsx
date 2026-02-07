"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle2, Clock } from "lucide-react"
import { format } from "date-fns"

export interface Holiday {
  id: string
  name: string
  date: string
  qualifyingStart?: string
  qualifyingEnd?: string
  daysWorked: number
  daysRequired: number
  isQualified: boolean
}

interface HolidaysSectionProps {
  upcomingHolidays: Holiday[]
  pastHolidays: Holiday[]
}

export function HolidaysSection({ upcomingHolidays, pastHolidays }: HolidaysSectionProps) {
  const [expanded, setExpanded] = useState(false)

  const HolidayItem = ({ holiday }: { holiday: Holiday }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-start gap-3">
        <div className={`mt-1 p-1.5 rounded-full ${holiday.isQualified ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
          {holiday.isQualified ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
        </div>
        <div>
          <h4 className="font-medium text-sm">{holiday.name}</h4>
          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(holiday.date), "MMM d, yyyy")}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-semibold ${holiday.daysWorked >= holiday.daysRequired ? 'text-green-600' : 'text-muted-foreground'}`}>
          {holiday.daysWorked}/{holiday.daysRequired}
        </div>
        <div className="text-[10px] text-muted-foreground uppercase">Qualified</div>
      </div>
    </div>
  )

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Upcoming Holidays</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800"
        >
          {expanded ? "Show Less" : "See All"}
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm px-4">
        {upcomingHolidays.slice(0, expanded ? undefined : 3).map((holiday) => (
          <HolidayItem key={holiday.id} holiday={holiday} />
        ))}

        {expanded && pastHolidays.length > 0 && (
          <>
            <div className="py-2 bg-muted -mx-4 px-4 border-y font-semibold text-xs text-muted-foreground uppercase mt-2">
              Past Holidays
            </div>
            {pastHolidays.map((holiday) => (
              <HolidayItem key={holiday.id} holiday={holiday} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
