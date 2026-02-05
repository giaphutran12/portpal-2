import { describe, it, expect } from 'vitest'
import {
  calculateXP,
  calculatePoints,
  getBadgeLevel,
  BADGE_LEVELS,
  XP_PER_SHIFT,
} from '../index'

describe('Gamification System', () => {
  describe('XP Calculation', () => {
    it('awards 10 XP per shift logged', () => {
      expect(XP_PER_SHIFT).toBe(10)
    })

    it('calculateXP returns 10 for worked shift', () => {
      expect(calculateXP({ entryType: 'worked' })).toBe(10)
    })

    it('calculateXP returns 10 for leave shift', () => {
      expect(calculateXP({ entryType: 'leave' })).toBe(10)
    })

    it('calculateXP returns 10 for any entry type', () => {
      expect(calculateXP({ entryType: 'vacation' })).toBe(10)
      expect(calculateXP({ entryType: 'standby' })).toBe(10)
      expect(calculateXP({ entryType: 'stat_holiday' })).toBe(10)
      expect(calculateXP({ entryType: 'day_off' })).toBe(10)
    })
  })

  describe('Points Calculation', () => {
    it('calculates points as floor(earnings / 10)', () => {
      expect(calculatePoints(100)).toBe(10)
      expect(calculatePoints(155)).toBe(15)
      expect(calculatePoints(442.40)).toBe(44)
      expect(calculatePoints(608.30)).toBe(60)
    })

    it('returns 0 for no earnings', () => {
      expect(calculatePoints(0)).toBe(0)
    })

    it('returns 0 for undefined earnings', () => {
      expect(calculatePoints(undefined)).toBe(0)
    })
  })

  describe('Badge Levels', () => {
    it('has 4 badge levels', () => {
      expect(BADGE_LEVELS).toHaveLength(4)
    })

    it('Level 1 is New Guy (0-199 XP)', () => {
      expect(BADGE_LEVELS[0]).toEqual({
        level: 1,
        name: 'New Guy',
        minXP: 0,
        maxXP: 199,
      })
    })

    it('Level 2 is Casual (200-499 XP)', () => {
      expect(BADGE_LEVELS[1]).toEqual({
        level: 2,
        name: 'Casual',
        minXP: 200,
        maxXP: 499,
      })
    })

    it('Level 3 is Member (500-999 XP)', () => {
      expect(BADGE_LEVELS[2]).toEqual({
        level: 3,
        name: 'Member',
        minXP: 500,
        maxXP: 999,
      })
    })

    it('Level 4 is Real Longshore (1000+ XP)', () => {
      expect(BADGE_LEVELS[3]).toEqual({
        level: 4,
        name: 'Real Longshore',
        minXP: 1000,
        maxXP: Infinity,
      })
    })
  })

  describe('getBadgeLevel', () => {
    it('returns New Guy for 0 XP', () => {
      expect(getBadgeLevel(0)).toEqual(BADGE_LEVELS[0])
    })

    it('returns New Guy for 199 XP', () => {
      expect(getBadgeLevel(199)).toEqual(BADGE_LEVELS[0])
    })

    it('returns Casual for 200 XP', () => {
      expect(getBadgeLevel(200)).toEqual(BADGE_LEVELS[1])
    })

    it('returns Member for 500 XP', () => {
      expect(getBadgeLevel(500)).toEqual(BADGE_LEVELS[2])
    })

    it('returns Real Longshore for 1000 XP', () => {
      expect(getBadgeLevel(1000)).toEqual(BADGE_LEVELS[3])
    })

    it('returns Real Longshore for very high XP', () => {
      expect(getBadgeLevel(99999)).toEqual(BADGE_LEVELS[3])
    })
  })
})
