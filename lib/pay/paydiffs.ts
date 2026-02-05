import { createClient } from '@/lib/supabase/client'

interface PayOverride {
  job: string
  subjob: string | null
  location: string
  shift_type: string
  hours: number
  overtime_hours: number
}

let cachedOverrides: PayOverride[] | null = null

export async function loadPayOverrides(): Promise<PayOverride[]> {
  if (cachedOverrides) return cachedOverrides

  const supabase = createClient()
  const { data, error } = await supabase
    .from('pay_overrides')
    .select('*')

  if (error) {
    console.error('Failed to load pay overrides:', error)
    return []
  }

  cachedOverrides = data as PayOverride[]
  return cachedOverrides
}

export function getHoursOverride(
  overrides: PayOverride[],
  job: string,
  subjob: string | null,
  location: string,
  shiftType: string
): { hours: number; overtimeHours: number } | null {
  const normalizedShiftType = shiftType.toUpperCase()
  const normalizedJob = job.toUpperCase()
  const normalizedLocation = location.toUpperCase()
  const normalizedSubjob = subjob?.toUpperCase() || null

  const match = overrides.find((o) => {
    const jobMatch = o.job.toUpperCase() === normalizedJob
    const locationMatch = o.location.toUpperCase() === normalizedLocation
    const shiftMatch = o.shift_type.toUpperCase() === normalizedShiftType
    
    const subjobMatch = normalizedSubjob
      ? o.subjob?.toUpperCase() === normalizedSubjob
      : !o.subjob || o.subjob === ''

    return jobMatch && locationMatch && shiftMatch && subjobMatch
  })

  if (!match) return null

  return {
    hours: match.hours,
    overtimeHours: match.overtime_hours,
  }
}

export function clearPayOverridesCache() {
  cachedOverrides = null
}
