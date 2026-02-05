export interface Shift {
  id: string
  user_id: string
  date: string
  entry_type: string
  job?: string | null
  subjob?: string | null
  location?: string | null
  total_pay?: number | null
}
