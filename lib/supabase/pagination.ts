import { SupabaseClient } from '@supabase/supabase-js'

const PAGE_SIZE = 1000

/**
 * Fetches ALL rows from a Supabase query, handling the 1000 row limit automatically.
 * Use this for any query that might return more than 1000 rows.
 *
 * @example
 * // Instead of:
 * const { data } = await supabase.from('shifts').select('*')
 *
 * // Use:
 * const data = await fetchAllRows(
 *   supabase.from('shifts').select('*')
 * )
 */
export async function fetchAllRows<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any
): Promise<T[]> {
  const allData: T[] = []
  let page = 0
  let hasMore = true

  while (hasMore) {
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error } = await query.range(from, to)

    if (error) throw error
    if (!data) break

    allData.push(...data)
    hasMore = data.length === PAGE_SIZE
    page++
  }

  return allData
}

/**
 * Fetch all rows from a table with automatic pagination.
 * Supabase has a 1000 row limit per request - this handles it.
 *
 * @deprecated Use fetchAllRows() instead for better type safety
 */
export async function fetchAllPaginated<T>(
  supabase: SupabaseClient,
  table: string,
  select: string = '*',
  options?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter?: (query: any) => any
    orderBy?: { column: string; ascending?: boolean }
  }
): Promise<T[]> {
  let allData: T[] = []
  let page = 0
  let hasMore = true

  while (hasMore) {
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase.from(table).select(select).range(from, to)

    if (options?.filter) {
      query = options.filter(query)
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      })
    }

    const { data, error } = await query

    if (error) throw error

    allData = [...allData, ...(data as T[])]
    hasMore = data.length === PAGE_SIZE
    page++
  }

  return allData
}

/**
 * Fetches rows with pagination info (for UI pagination).
 * Returns data plus metadata for building pagination controls.
 *
 * @example
 * const { data, page, hasMore } = await fetchPaginated(
 *   supabase.from('shifts').select('*'),
 *   0,
 *   50
 * )
 */
export async function fetchPaginated<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  page: number = 0,
  pageSize: number = 50
): Promise<{ data: T[]; page: number; pageSize: number; hasMore: boolean }> {
  const from = page * pageSize
  const to = from + pageSize - 1

  const { data, error } = await query.range(from, to)

  if (error) throw error

  return {
    data: data || [],
    page,
    pageSize,
    hasMore: (data?.length || 0) === pageSize,
  }
}

/**
 * Batch insert rows with automatic chunking.
 * Prevents timeout issues with large inserts.
 */
export async function batchInsert<T extends Record<string, unknown>>(
  supabase: SupabaseClient,
  table: string,
  rows: T[],
  chunkSize: number = 500
): Promise<{ inserted: number; errors: Error[] }> {
  const errors: Error[] = []
  let inserted = 0

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize)

    const { error } = await supabase.from(table).insert(chunk)

    if (error) {
      errors.push(new Error(`Chunk ${i / chunkSize + 1}: ${error.message}`))
    } else {
      inserted += chunk.length
    }
  }

  return { inserted, errors }
}
