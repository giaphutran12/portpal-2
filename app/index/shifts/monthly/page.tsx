import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, parseISO } from 'date-fns'
import { MonthlyCalendar } from '@/components/shifts/MonthlyCalendar'
import { Shift } from '@/components/shifts/types'
import { fetchAllRows } from '@/lib/supabase/pagination'

export default async function MonthlyShiftsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams
  const currentDate = date || format(new Date(), 'yyyy-MM-dd')
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  const dateObj = parseISO(currentDate)
  // We need the full calendar range (including prev/next month days shown in grid)
  const monthStart = startOfMonth(dateObj)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  let shifts: Shift[] = []
  try {
    shifts = await fetchAllRows<Shift>(
      supabase
        .from('shifts')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', format(calendarStart, 'yyyy-MM-dd'))
        .lte('date', format(calendarEnd, 'yyyy-MM-dd'))
        .order('date', { ascending: true })
    )
  } catch (error) {
    console.error('Error fetching shifts:', error)
  }

  return (
    <MonthlyCalendar 
      currentDate={currentDate} 
      shifts={shifts} 
    />
  )
}
