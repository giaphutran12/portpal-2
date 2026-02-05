import { describe, it, expect } from 'vitest'
import {
  BASE_RATE,
  DIFFERENTIALS,
  getDifferentialForJob,
  calculateRegularRate,
  calculateOvertimeRate,
  calculateShiftPay,
  TRAVEL_RATE,
} from '../calculate'

describe('Pay Calculation Engine', () => {
  describe('Base Rate', () => {
    it('should be $55.30', () => {
      expect(BASE_RATE).toBe(55.30)
    })
  })

  describe('Differential Classes', () => {
    it('BASE differential is $0.00', () => {
      expect(DIFFERENTIALS.BASE).toBe(0.00)
    })

    it('CLASS_1 differential is $2.50', () => {
      expect(DIFFERENTIALS.CLASS_1).toBe(2.50)
    })

    it('CLASS_2 differential is $1.50', () => {
      expect(DIFFERENTIALS.CLASS_2).toBe(1.50)
    })

    it('CLASS_3 differential is $0.65', () => {
      expect(DIFFERENTIALS.CLASS_3).toBe(0.65)
    })

    it('CLASS_4 differential is $0.40', () => {
      expect(DIFFERENTIALS.CLASS_4).toBe(0.40)
    })
  })

  describe('getDifferentialForJob', () => {
    it('Labour has BASE differential ($0.00)', () => {
      expect(getDifferentialForJob('Labour')).toBe(0.00)
    })

    it('Tractor Trailer has CLASS_3 differential ($0.65)', () => {
      expect(getDifferentialForJob('Tractor Trailer')).toBe(0.65)
    })

    it('Hd Mechanic has CLASS_1 differential ($2.50)', () => {
      expect(getDifferentialForJob('Hd Mechanic')).toBe(2.50)
    })

    it('Ship Gantry has CLASS_2 differential ($1.50)', () => {
      expect(getDifferentialForJob('Ship Gantry')).toBe(1.50)
    })

    it('Winch Driver has CLASS_4 differential ($0.40)', () => {
      expect(getDifferentialForJob('Winch Driver')).toBe(0.40)
    })

    it('unknown job defaults to BASE ($0.00)', () => {
      expect(getDifferentialForJob('Unknown Job')).toBe(0.00)
    })
  })

  describe('calculateRegularRate', () => {
    it('Labour: $55.30 + $0.00 = $55.30', () => {
      expect(calculateRegularRate(0.00)).toBe(55.30)
    })

    it('Tractor Trailer: $55.30 + $0.65 = $55.95', () => {
      expect(calculateRegularRate(0.65)).toBe(55.95)
    })

    it('Hd Mechanic: $55.30 + $2.50 = $57.80', () => {
      expect(calculateRegularRate(2.50)).toBe(57.80)
    })
  })

  describe('calculateOvertimeRate', () => {
    it('Labour OT: ($55.30 × 1.5) + $0.00 = $82.95', () => {
      expect(calculateOvertimeRate(0.00)).toBe(82.95)
    })

    it('Tractor Trailer OT: ($55.30 × 1.5) + $0.65 = $83.60', () => {
      expect(calculateOvertimeRate(0.65)).toBe(83.60)
    })

    it('Hd Mechanic OT: ($55.30 × 1.5) + $2.50 = $85.45', () => {
      expect(calculateOvertimeRate(2.50)).toBe(85.45)
    })
  })

  describe('calculateShiftPay', () => {
    it('8 hours Labour at regular rate', () => {
      const result = calculateShiftPay({
        job: 'Labour',
        hours: 8,
        overtimeHours: 0,
      })
      expect(result.regularPay).toBe(442.40)
      expect(result.overtimePay).toBe(0)
      expect(result.totalPay).toBe(442.40)
    })

    it('8 hours + 2 OT hours Tractor Trailer', () => {
      const result = calculateShiftPay({
        job: 'Tractor Trailer',
        hours: 8,
        overtimeHours: 2,
      })
      expect(result.regularRate).toBe(55.95)
      expect(result.overtimeRate).toBe(83.60)
      expect(result.regularPay).toBe(447.60)
      expect(result.overtimePay).toBe(167.20)
      expect(result.totalPay).toBe(614.80)
    })

    it('includes travel pay when specified', () => {
      const result = calculateShiftPay({
        job: 'Labour',
        hours: 8,
        overtimeHours: 0,
        travelHours: 1,
      })
      expect(result.travelPay).toBe(53.17)
      expect(result.totalPay).toBe(442.40 + 53.17)
    })

    it('includes meal pay (0.5hr at OT rate)', () => {
      const result = calculateShiftPay({
        job: 'Tractor Trailer',
        hours: 8,
        overtimeHours: 0,
        includeMeal: true,
      })
      expect(result.mealPay).toBeCloseTo(41.80, 2)
      expect(result.totalPay).toBeCloseTo(447.60 + 41.80, 2)
    })
  })

  describe('Travel Rate', () => {
    it('should be $53.17/hr', () => {
      expect(TRAVEL_RATE).toBe(53.17)
    })
  })
})
