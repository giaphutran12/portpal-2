export const BASE_RATE = 55.30
export const TRAVEL_RATE = 53.17
export const MEAL_HOURS = 0.5

export const DIFFERENTIALS = {
  BASE: 0.00,
  CLASS_1: 2.50,
  CLASS_2: 1.50,
  CLASS_3: 0.65,
  CLASS_4: 0.40,
} as const

type DifferentialClass = keyof typeof DIFFERENTIALS

const JOB_DIFFERENTIALS: Record<string, DifferentialClass> = {
  'Labour': 'BASE',
  'First Aid': 'BASE',
  'Dock Checker': 'BASE',
  'Head Checker': 'BASE',
  'Wheat Machine': 'BASE',
  'Loci': 'BASE',
  'Bulk Operator': 'BASE',
  'Liquid Bulk': 'BASE',
  'Wheat Specialty': 'BASE',
  'Storesperson': 'BASE',
  'Dow Men': 'BASE',
  'Switchman': 'BASE',
  'Trainer': 'BASE',
  'Excavator': 'BASE',
  'Bulldozer': 'BASE',
  'Komatsu': 'BASE',
  'Trackmen': 'BASE',
  'Painter': 'BASE',
  'Carpenter': 'BASE',
  'Bunny Bus': 'BASE',
  'Pusher': 'BASE',
  'Lockerman': 'BASE',
  '40 Ton (Top Pick)': 'BASE',
  'Plumber': 'BASE',
  'Training': 'BASE',
  'Lines': 'BASE',
  'Ob': 'BASE',
  'Mobile Crane': 'BASE',
  
  'Hd Mechanic': 'CLASS_1',
  'Millwright': 'CLASS_1',
  'Electrician': 'CLASS_1',
  'Welder': 'CLASS_1',
  
  'Ship Gantry': 'CLASS_2',
  'Dock Gantry': 'CLASS_2',
  'Rail Mounted Gantry': 'CLASS_2',
  'Rubber Tire Gantry': 'CLASS_2',
  
  'Tractor Trailer': 'CLASS_3',
  'Lift Truck': 'CLASS_3',
  'Front End Loader': 'CLASS_3',
  'Reachstacker': 'CLASS_3',
  
  'Winch Driver': 'CLASS_4',
  'Hatch Tender/Signals': 'CLASS_4',
  'Gearperson': 'CLASS_4',
}

export function getDifferentialForJob(job: string): number {
  const diffClass = JOB_DIFFERENTIALS[job] || 'BASE'
  return DIFFERENTIALS[diffClass]
}

export function calculateRegularRate(differential: number): number {
  return Number((BASE_RATE + differential).toFixed(2))
}

export function calculateOvertimeRate(differential: number): number {
  return Number((BASE_RATE * 1.5 + differential).toFixed(2))
}

interface ShiftPayInput {
  job: string
  hours: number
  overtimeHours?: number
  travelHours?: number
  includeMeal?: boolean
}

interface ShiftPayResult {
  regularRate: number
  overtimeRate: number
  regularPay: number
  overtimePay: number
  travelPay: number
  mealPay: number
  totalPay: number
}

export function calculateShiftPay(input: ShiftPayInput): ShiftPayResult {
  const differential = getDifferentialForJob(input.job)
  const regularRate = calculateRegularRate(differential)
  const overtimeRate = calculateOvertimeRate(differential)

  const regularPay = Number((input.hours * regularRate).toFixed(2))
  const overtimePay = Number(((input.overtimeHours || 0) * overtimeRate).toFixed(2))
  const travelPay = Number(((input.travelHours || 0) * TRAVEL_RATE).toFixed(2))
  const mealPay = input.includeMeal ? Number((MEAL_HOURS * overtimeRate).toFixed(2)) : 0

  const totalPay = Number((regularPay + overtimePay + travelPay + mealPay).toFixed(2))

  return {
    regularRate,
    overtimeRate,
    regularPay,
    overtimePay,
    travelPay,
    mealPay,
    totalPay,
  }
}
