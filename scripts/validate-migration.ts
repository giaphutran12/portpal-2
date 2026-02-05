import { createClient, SupabaseClient } from '@supabase/supabase-js'

import { fetchAllPaginated } from '@/lib/supabase/pagination'

const EXPECTED_AUTH_USERS = 3068
const EXPECTED_SHIFTS = 77275

function createAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error(
      'Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL, and/or SUPABASE_SERVICE_ROLE_KEY'
    )
    process.exit(1)
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

async function countAuthUsers(supabase: SupabaseClient): Promise<number> {
  const { count, error } = await supabase
    .from('auth.users')
    .select('*', { count: 'exact', head: true })

  if (!error && typeof count === 'number') return count

  if (error) {
    console.warn(`auth.users count query failed: ${error.message}. Falling back to listUsers.`)
  }

  const perPage = 1000
  let page = 1
  let total = 0

  while (true) {
    const { data, error: listError } = await supabase.auth.admin.listUsers({ page, perPage })
    if (listError) throw listError
    const users = data?.users ?? []
    total += users.length
    if (users.length < perPage) break
    page += 1
  }

  return total
}

async function countShifts(supabase: SupabaseClient): Promise<number> {
  const { count, error } = await supabase
    .from('shifts')
    .select('*', { count: 'exact', head: true })

  if (error || typeof count !== 'number') {
    throw new Error(`Failed to count shifts: ${error?.message ?? 'Unknown error'}`)
  }

  return count
}

async function sumTotalPay(supabase: SupabaseClient): Promise<number> {
  const rows = await fetchAllPaginated<{ total_pay: number | string | null }>(
    supabase,
    'shifts',
    'total_pay'
  )

  return rows.reduce((total, row) => {
    if (row.total_pay === null || row.total_pay === undefined) return total
    const value =
      typeof row.total_pay === 'number' ? row.total_pay : Number.parseFloat(row.total_pay)
    if (!Number.isFinite(value)) return total
    return total + value
  }, 0)
}

async function countDistinctShiftUsers(supabase: SupabaseClient): Promise<number> {
  const rows = await fetchAllPaginated<{ user_id: string | null }>(
    supabase,
    'shifts',
    'user_id'
  )
  const ids = new Set<string>()
  for (const row of rows) {
    if (row.user_id) ids.add(row.user_id)
  }
  return ids.size
}

async function main() {
  const supabase = createAdminClient()

  const authUserCount = await countAuthUsers(supabase)
  const shiftCount = await countShifts(supabase)
  const totalPaySum = await sumTotalPay(supabase)
  const distinctUserCount = await countDistinctShiftUsers(supabase)

  console.log(`auth.users count: ${authUserCount} (expected ${EXPECTED_AUTH_USERS})`)
  console.log(`shifts count: ${shiftCount} (expected ${EXPECTED_SHIFTS})`)
  console.log(`shifts total_pay sum: ${totalPaySum.toFixed(2)} (compare to CSV sum)`)
  console.log(
    `distinct shift user_id count: ${distinctUserCount} (expected ${EXPECTED_AUTH_USERS})`
  )
}

main().catch((error) => {
  console.error('Validation failed:', error)
  process.exit(1)
})
