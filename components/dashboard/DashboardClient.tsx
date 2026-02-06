"use client"

import { useState } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { GamificationWidget } from "./GamificationWidget"
import { YearlyGoalWidget } from "./YearlyGoalWidget"
import { EarningsCards, PeriodData } from "./EarningsCards"
import { HolidaysSection, Holiday } from "./HolidaysSection"
import { BenefitsSection, BenefitState } from "./BenefitsSection"
import { BenefitsData } from "./BenefitsUpdateModal"

interface DashboardClientProps {
  initialGamification: {
    streak: number
    points: number
    xp: number
  }
  initialGoal: number
  initialEarnings: {
    thisWeek: PeriodData
    lastWeek: PeriodData
    thisYear: PeriodData
    totalYearlyEarnings: number
  }
  initialHolidays: {
    upcoming: Holiday[]
    past: Holiday[]
  }
  initialBenefits: {
    sickLeave: BenefitState
    personalLeave: BenefitState
  }
}

export function DashboardClient({
  initialGamification,
  initialGoal,
  initialEarnings,
  initialHolidays,
  initialBenefits
}: DashboardClientProps) {
  const [goal, setGoal] = useState(initialGoal)
  const [sickLeave, setSickLeave] = useState(initialBenefits.sickLeave)
  const [personalLeave, setPersonalLeave] = useState(initialBenefits.personalLeave)

  const handleUpdateSickLeave = async (data: BenefitsData) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sick_days_available: data.totalAvailable,
          sick_leave_start: format(data.validityStart, 'yyyy-MM-dd'),
          sick_leave_end: format(data.validityEnd, 'yyyy-MM-dd'),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update sick leave')
      }

      setSickLeave({
        total: data.totalAvailable,
        used: sickLeave.used,
        validityStart: data.validityStart,
        validityEnd: data.validityEnd
      })
      toast.success('Sick leave updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update sick leave')
    }
  }

  const handleUpdatePersonalLeave = async (data: BenefitsData) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personal_leave_available: data.totalAvailable,
          personal_leave_start: format(data.validityStart, 'yyyy-MM-dd'),
          personal_leave_end: format(data.validityEnd, 'yyyy-MM-dd'),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update personal leave')
      }

      setPersonalLeave({
        total: data.totalAvailable,
        used: personalLeave.used,
        validityStart: data.validityStart,
        validityEnd: data.validityEnd
      })
      toast.success('Personal leave updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update personal leave')
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <GamificationWidget 
        streak={initialGamification.streak} 
        points={initialGamification.points} 
        xp={initialGamification.xp} 
      />

      <YearlyGoalWidget 
        currentEarnings={initialEarnings.totalYearlyEarnings} 
        initialGoal={goal} 
      />

      <EarningsCards 
        thisWeek={initialEarnings.thisWeek}
        lastWeek={initialEarnings.lastWeek}
        thisYear={initialEarnings.thisYear}
      />

      <HolidaysSection 
        upcomingHolidays={initialHolidays.upcoming}
        pastHolidays={initialHolidays.past}
      />

      <BenefitsSection 
        sickLeave={sickLeave}
        personalLeave={personalLeave}
        onUpdateSickLeave={handleUpdateSickLeave}
        onUpdatePersonalLeave={handleUpdatePersonalLeave}
      />
    </div>
  )
}
