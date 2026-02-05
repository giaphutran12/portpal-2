export const XP_PER_SHIFT = 10

export interface BadgeLevel {
  level: number
  name: string
  minXP: number
  maxXP: number
}

export const BADGE_LEVELS: BadgeLevel[] = [
  { level: 1, name: 'New Guy', minXP: 0, maxXP: 199 },
  { level: 2, name: 'Casual', minXP: 200, maxXP: 499 },
  { level: 3, name: 'Member', minXP: 500, maxXP: 999 },
  { level: 4, name: 'Real Longshore', minXP: 1000, maxXP: Infinity },
]

interface ShiftInput {
  entryType: string
}

export function calculateXP(_shift: ShiftInput): number {
  return XP_PER_SHIFT
}

export function calculatePoints(earnings: number | undefined): number {
  if (!earnings) return 0
  return Math.floor(earnings / 10)
}

export function getBadgeLevel(totalXP: number): BadgeLevel {
  for (let i = BADGE_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= BADGE_LEVELS[i].minXP) {
      return BADGE_LEVELS[i]
    }
  }
  return BADGE_LEVELS[0]
}

export function getXPToNextLevel(totalXP: number): { current: number; required: number; progress: number } {
  const currentLevel = getBadgeLevel(totalXP)
  const currentIndex = BADGE_LEVELS.findIndex((l) => l.level === currentLevel.level)

  if (currentIndex === BADGE_LEVELS.length - 1) {
    return { current: totalXP, required: totalXP, progress: 100 }
  }

  const nextLevel = BADGE_LEVELS[currentIndex + 1]
  const xpInCurrentLevel = totalXP - currentLevel.minXP
  const xpRequiredForLevel = nextLevel.minXP - currentLevel.minXP
  const progress = Math.floor((xpInCurrentLevel / xpRequiredForLevel) * 100)

  return {
    current: xpInCurrentLevel,
    required: xpRequiredForLevel,
    progress: Math.min(progress, 100),
  }
}

export interface StreakResult {
  currentStreak: number
  longestStreak: number
  isStreakActive: boolean
}

export function calculateStreak(
  shiftDates: Date[],
  today: Date = new Date()
): StreakResult {
  if (shiftDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, isStreakActive: false }
  }

  const sortedDates = [...shiftDates]
    .map((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()))
    .sort((a, b) => b.getTime() - a.getTime())

  const uniqueDates = sortedDates.filter(
    (date, index, arr) =>
      index === 0 || date.getTime() !== arr[index - 1].getTime()
  )

  const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const yesterdayNormalized = new Date(todayNormalized)
  yesterdayNormalized.setDate(yesterdayNormalized.getDate() - 1)

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 1
  let isStreakActive = false

  const mostRecentDate = uniqueDates[0]
  if (
    mostRecentDate.getTime() === todayNormalized.getTime() ||
    mostRecentDate.getTime() === yesterdayNormalized.getTime()
  ) {
    isStreakActive = true
  }

  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0) {
      tempStreak = 1
      continue
    }

    const prevDate = uniqueDates[i - 1]
    const currDate = uniqueDates[i]
    const diffDays = Math.round(
      (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 1) {
      tempStreak++
    } else {
      if (i === 1 || uniqueDates[0].getTime() === todayNormalized.getTime() || uniqueDates[0].getTime() === yesterdayNormalized.getTime()) {
        currentStreak = Math.max(currentStreak, tempStreak)
      }
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak)
  if (isStreakActive && currentStreak === 0) {
    currentStreak = tempStreak
  }

  return {
    currentStreak: isStreakActive ? currentStreak : 0,
    longestStreak,
    isStreakActive,
  }
}
