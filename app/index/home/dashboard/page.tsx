import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { startOfWeek, endOfWeek, subWeeks, format, isAfter, isBefore } from 'date-fns'
import { fetchAllRows } from '@/lib/supabase/pagination'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const fiscalStart = '2026-01-04'
  const fiscalEnd = '2027-01-03'
  const queryStart = '2025-12-01' 

  // Fetch all shifts with pagination (could exceed 1000 for full fiscal year)
  const allShifts = await fetchAllRows<any>(
    supabase
      .from('shifts')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', queryStart)
      .order('date', { ascending: false })
  )

  // Holidays table is small (< 1000 rows), no pagination needed
  const { data: holidays } = await supabase
    .from('holidays')
    .select('*')
    .order('date', { ascending: true })

  const allHolidays = holidays || []

  const now = new Date()
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 0 })
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 0 })
  const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 0 })
  const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 0 })

  const filterShifts = (start: Date, end: Date) => {
    return allShifts.filter(s => {
      const d = new Date(s.date)
      return d >= start && d <= end
    })
  }

  const calculateStats = (shiftList: any[]) => {
    const earnings = shiftList.reduce((sum, s) => sum + (s.total_pay || 0), 0)
    const hours = shiftList.reduce((sum, s) => sum + (s.hours || 0), 0)
    const shiftsCount = shiftList.length
    return { earnings, hours, shifts: shiftsCount }
  }

  const thisWeekShifts = filterShifts(thisWeekStart, thisWeekEnd)
  const lastWeekShifts = filterShifts(lastWeekStart, lastWeekEnd)
  const thisYearShifts = allShifts.filter(s => {
    const d = new Date(s.date)
    return d >= new Date(fiscalStart) && d <= new Date(fiscalEnd)
  })

  const thisWeekStats = calculateStats(thisWeekShifts)
  const lastWeekStats = calculateStats(lastWeekShifts)
  const thisYearStats = calculateStats(thisYearShifts)

  const processedHolidays = allHolidays.map(h => {
    const hDate = new Date(h.date)
    
    const qStart = h.qualifying_start ? new Date(h.qualifying_start) : subWeeks(hDate, 4)
    const qEnd = h.qualifying_end ? new Date(h.qualifying_end) : hDate

    const qualifyingShifts = allShifts.filter(s => {
      const d = new Date(s.date)
      return d >= qStart && d <= qEnd && s.entry_type === 'worked'
    })

    const daysWorked = qualifyingShifts.length
    const daysRequired = 15
    const isQualified = daysWorked >= daysRequired

    return {
      id: h.id,
      name: h.name,
      date: h.date,
      qualifyingStart: h.qualifying_start,
      qualifyingEnd: h.qualifying_end,
      daysWorked,
      daysRequired,
      isQualified
    }
  })

  const upcomingHolidays = processedHolidays.filter(h => isAfter(new Date(h.date), subWeeks(now, 1)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const pastHolidays = processedHolidays.filter(h => isBefore(new Date(h.date), now))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const sickLeave = {
    total: profile?.sick_days_available || 5,
    used: profile?.sick_days_used || 0,
    validityStart: profile?.sick_leave_start ? new Date(profile.sick_leave_start) : new Date(new Date().getFullYear(), 0, 1),
    validityEnd: profile?.sick_leave_end ? new Date(profile.sick_leave_end) : new Date(new Date().getFullYear(), 11, 31)
  }

  const personalLeave = {
    total: profile?.personal_leave_available || 3,
    used: profile?.personal_leave_used || 0,
    validityStart: profile?.personal_leave_start ? new Date(profile.personal_leave_start) : new Date(new Date().getFullYear(), 0, 1),
    validityEnd: profile?.personal_leave_end ? new Date(profile.personal_leave_end) : new Date(new Date().getFullYear(), 11, 31)
  }

  return (
    <DashboardClient
      initialGamification={{
        streak: profile?.streak || 0,
        points: profile?.points || 0,
        xp: profile?.xp || 0
      }}
      initialGoal={profile?.yearly_goal || 120000}
      initialEarnings={{
        thisWeek: {
          range: `${format(thisWeekStart, 'MMM dd')} - ${format(thisWeekEnd, 'MMM dd')}`,
          earnings: thisWeekStats.earnings,
          shifts: thisWeekStats.shifts,
          hours: thisWeekStats.hours,
          totalShifts: 7
        },
        lastWeek: {
          range: `${format(lastWeekStart, 'MMM dd')} - ${format(lastWeekEnd, 'MMM dd')}`,
          earnings: lastWeekStats.earnings,
          shifts: lastWeekStats.shifts,
          hours: lastWeekStats.hours,
          totalShifts: 7
        },
        thisYear: {
          range: `${format(new Date(fiscalStart), 'MMM dd, yyyy')} - ${format(new Date(fiscalEnd), 'MMM dd, yyyy')}`,
          earnings: thisYearStats.earnings,
          shifts: thisYearStats.shifts,
          hours: thisYearStats.hours,
          pension: thisYearStats.hours * 12.50,
          pensionPercentage: 15
        },
        totalYearlyEarnings: thisYearStats.earnings
      }}
      initialHolidays={{
        upcoming: upcomingHolidays,
        past: pastHolidays
      }}
      initialBenefits={{
        sickLeave,
        personalLeave
      }}
    />
  )
}
