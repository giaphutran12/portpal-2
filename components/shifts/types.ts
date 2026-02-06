export interface Shift {
  id: string
  user_id: string
  date: string
  entry_type: string
  job?: string | null
  subjob?: string | null
  location?: string | null
  shift_type?: 'day' | 'night' | 'graveyard' | null
  hours?: number | null
  rate?: number | null
  overtime_hours?: number | null
  overtime_rate?: number | null
  travel_hours?: number | null
  meal?: boolean | null
  foreman?: string | null
  vessel?: string | null
  total_pay?: number | null
  leave_type?: string | null
  will_receive_paystub?: boolean | null
  holiday?: string | null
  holiday_id?: string | null
  qualifying_days?: number | null
  notes?: string | null
}
