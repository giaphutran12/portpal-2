import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { startOfYear, endOfYear, format, parseISO } from 'date-fns'
import { YearlyGrid } from '@/components/shifts/YearlyGrid'
import { Shift } from '@/components/shifts/types'

export default async function YearlyShiftsPage({
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
  const start = startOfYear(dateObj)
  const end = endOfYear(dateObj)

  const { data: shifts, error } = await supabase
    .from('shifts')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', format(start, 'yyyy-MM-dd'))
    .lte('date', format(end, 'yyyy-MM-dd'))
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching shifts:', error)
  }

  return (
    <YearlyGrid 
      currentDate={currentDate} 
      shifts={(shifts as Shift[]) || []} 
    />
  )
}
