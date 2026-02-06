import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { startOfWeek, endOfWeek, format, parseISO } from 'date-fns'
import { WeeklyCalendar } from '@/components/shifts/WeeklyCalendar'
import { Shift } from '@/components/shifts/types'
import { fetchAllRows } from '@/lib/supabase/pagination'

export default async function WeeklyShiftsPage({
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
  const start = startOfWeek(dateObj, { weekStartsOn: 0 })
  const end = endOfWeek(dateObj, { weekStartsOn: 0 })

  let shifts: Shift[] = []
  try {
    shifts = await fetchAllRows<Shift>(
      supabase
        .from('shifts')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', format(start, 'yyyy-MM-dd'))
        .lte('date', format(end, 'yyyy-MM-dd'))
        .order('date', { ascending: true })
    )
  } catch (error) {
    console.error('Error fetching shifts:', error)
  }

  return (
    <WeeklyCalendar 
      currentDate={currentDate} 
      shifts={shifts} 
    />
  )
}
