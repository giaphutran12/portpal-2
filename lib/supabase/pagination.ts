import { SupabaseClient } from '@supabase/supabase-js'

const PAGE_SIZE = 1000

/**
 * Fetch all rows from a table with automatic pagination.
 * Supabase has a 1000 row limit per request - this handles it.
 */
export async function fetchAllPaginated<T>(
  supabase: SupabaseClient,
  table: string,
  select: string = '*',
  options?: {
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
