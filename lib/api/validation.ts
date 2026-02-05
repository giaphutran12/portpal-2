import { z } from 'zod'

export const entryTypes = ['worked', 'leave', 'vacation', 'standby', 'stat_holiday', 'day_off'] as const
export const shiftTypes = ['day', 'night', 'graveyard'] as const
export const leaveTypes = ['sick_leave', 'personal_leave', 'parental_leave'] as const

export const createShiftSchema = z.object({
  entry_type: z.enum(entryTypes),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  job: z.string().optional(),
  subjob: z.string().optional(),
  location: z.string().optional(),
  shift_type: z.enum(shiftTypes).optional(),
  hours: z.number().min(0).max(24).optional(),
  rate: z.number().min(0).optional(),
  overtime_hours: z.number().min(0).max(24).optional(),
  overtime_rate: z.number().min(0).optional(),
  travel_hours: z.number().min(0).max(24).optional(),
  meal: z.boolean().optional(),
  foreman: z.string().optional(),
  vessel: z.string().optional(),
  total_pay: z.number().min(0).optional(),
  leave_type: z.enum(leaveTypes).optional(),
  will_receive_paystub: z.boolean().optional(),
  holiday: z.string().optional(),
  qualifying_days: z.number().optional(),
  notes: z.string().optional(),
})

export const updateShiftSchema = createShiftSchema.partial()

export const updateProfileSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  ilwu_local: z.enum(['500', '502', 'Other']).optional(),
  board: z.enum(['A BOARD', 'B BOARD', 'C BOARD', 'T BOARD', '00 BOARD', 'R BOARD', 'UNION']).optional(),
  theme_preference: z.enum(['dark', 'light']).optional(),
  sick_days_available: z.number().optional(),
  sick_days_used: z.number().optional(),
  sick_leave_start: z.string().optional(),
  sick_leave_end: z.string().optional(),
  personal_leave_available: z.number().optional(),
  personal_leave_used: z.number().optional(),
  personal_leave_start: z.string().optional(),
  personal_leave_end: z.string().optional(),
  onboarding_completed: z.boolean().optional(),
})

export type CreateShiftInput = z.infer<typeof createShiftSchema>
export type UpdateShiftInput = z.infer<typeof updateShiftSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// Goals validation
export const goalTypes = ['weekly', 'monthly', 'yearly'] as const
export const goalKinds = ['earnings', 'hours', 'shifts', 'pension'] as const

export const createGoalSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(goalTypes),
  kind: z.enum(goalKinds),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  target_value: z.number().min(0, 'Target must be positive'),
})

export const updateGoalSchema = createGoalSchema.partial()

export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>
