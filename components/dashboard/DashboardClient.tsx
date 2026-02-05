"use client"

import { useState } from "react"
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

  const handleUpdateSickLeave = (data: BenefitsData) => {
    setSickLeave({
      total: data.totalAvailable,
      used: sickLeave.used,
      validityStart: data.validityStart,
      validityEnd: data.validityEnd
    })
  }

  const handleUpdatePersonalLeave = (data: BenefitsData) => {
    setPersonalLeave({
      total: data.totalAvailable,
      used: personalLeave.used,
      validityStart: data.validityStart,
      validityEnd: data.validityEnd
    })
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
