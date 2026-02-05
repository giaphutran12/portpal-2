"use client"

import { useState } from "react"
import { LevelDisplay } from "@/components/analytics/LevelDisplay"
import { WeekProgress } from "@/components/analytics/WeekProgress"
import { BadgeCard } from "@/components/analytics/BadgeCard"
import { StatCard } from "@/components/analytics/StatCard"
import { BADGE_LEVELS, getBadgeLevel, getXPToNextLevel } from "@/lib/gamification"

export default function JourneyPage() {
    const [userXP, setUserXP] = useState(150)
    const [currentStreak, setCurrentStreak] = useState(3)
    const [longestStreak, setLongestStreak] = useState(12)
    const [totalShifts, setTotalShifts] = useState(45)

    const currentLevelInfo = getBadgeLevel(userXP)
    const xpProgress = getXPToNextLevel(userXP)
    
    const unlockedBadgesCount = BADGE_LEVELS.filter(b => userXP >= b.minXP).length

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                 <h1 className="text-2xl font-bold tracking-tight">Your Journey</h1>
                 <p className="text-muted-foreground">Track your progress and achievements.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <LevelDisplay 
                        currentLevel={currentLevelInfo.level}
                        levelName={currentLevelInfo.name}
                        currentXP={xpProgress.current}
                        requiredXP={xpProgress.required}
                        progressPercentage={xpProgress.progress}
                    />
                </div>
                <div className="md:col-span-1">
                    <WeekProgress shiftsLogged={4} earnings={1250.50} />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Badges Unlocked</h2>
                    <span className="text-sm text-muted-foreground">{unlockedBadgesCount}/{BADGE_LEVELS.length}</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {BADGE_LEVELS.map((badge) => (
                        <BadgeCard 
                            key={badge.level}
                            level={badge.level}
                            name={badge.name}
                            minXP={badge.minXP}
                            isUnlocked={userXP >= badge.minXP}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">All Time Stats</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total XP Earned" value={userXP} />
                    <StatCard title="Badges Unlocked" value={`${unlockedBadgesCount}/${BADGE_LEVELS.length}`} />
                    <StatCard title="Longest Streak" value={`${longestStreak} days`} />
                    <StatCard title="Total Shifts" value={totalShifts} />
                </div>
            </div>
        </div>
    )
}
