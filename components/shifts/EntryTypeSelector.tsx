'use client'

import { format, parseISO, isValid } from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, Heart, Palmtree, Clock, Flag, Moon } from 'lucide-react'

const ENTRY_TYPES = [
  {
    id: 'worked',
    name: 'WORKED',
    description: 'Log your shift details',
    icon: Briefcase,
    route: '/shifts/add/worked',
  },
  {
    id: 'leave',
    name: 'LEAVE',
    description: 'Taking care of yourself',
    icon: Heart,
    route: '/shifts/add/leave',
  },
  {
    id: 'vacation',
    name: 'VACATION',
    description: 'Enjoying time off',
    icon: Palmtree,
    route: '/shifts/add/vacation',
  },
  {
    id: 'standby',
    name: 'STANDBY',
    description: 'Plugged in but no work',
    icon: Clock,
    route: '/shifts/add/standby',
  },
  {
    id: 'stat-holiday',
    name: 'STAT HOLIDAY',
    description: 'Public Holiday',
    icon: Flag,
    route: '/shifts/add/stat-holiday',
  },
  {
    id: 'day-off',
    name: 'DAY OFF',
    description: 'Scheduled rest day',
    icon: Moon,
    route: '/shifts/add/day-off',
  },
]

export function EntryTypeSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dateParam = searchParams.get('date')
  let selectedDate = new Date()
  if (dateParam) {
    const parsed = parseISO(dateParam)
    if (isValid(parsed)) {
      selectedDate = parsed
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-medium text-muted-foreground">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {ENTRY_TYPES.map((type) => {
          const Icon = type.icon
          const routeWithDate = dateParam ? `${type.route}?date=${dateParam}` : type.route
          return (
            <Card
              key={type.id}
              className="cursor-pointer transition-colors hover:bg-accent/50"
              onClick={() => router.push(routeWithDate)}
            >
              <CardHeader className="flex flex-col items-center space-y-2 p-3 sm:p-4 pb-2">
                <div className="rounded-full bg-primary/10 p-2 sm:p-3">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <CardTitle className="text-xs sm:text-sm font-bold text-center">{type.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0 text-center">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {type.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
