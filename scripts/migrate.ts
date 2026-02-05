import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse'
import { randomBytes } from 'crypto'
import { format, isValid, parse as parseDate } from 'date-fns'
import * as fs from 'fs'
import * as path from 'path'

import { batchInsert, fetchAllPaginated } from '@/lib/supabase/pagination'
import { CSVRow } from './types'

const CSV_DATE_FORMAT = 'MMM d, yyyy h:mm a'
const CSV_PATH = path.resolve(
  process.cwd(),
  'export_All-SHIFTS-modified--_2026-02-01_05-58-52.csv'
)
const PARSE_LOG_INTERVAL = 1000
const INSERT_LOG_INTERVAL = 1000

type EntryType = 'worked' | 'leave' | 'vacation' | 'standby' | 'stat_holiday' | 'day_off'
type LeaveType = 'sick_leave' | 'personal_leave' | 'parental_leave'
type ShiftType = 'day' | 'night' | 'graveyard'

interface ShiftDraft {
  sourceUniqueId: string
  userEmail: string
  entry_type: EntryType
  leave_type: LeaveType | null
  date: string
  job: string | null
  subjob: string | null
  location: string | null
  shift_type: ShiftType | null
  hours: number | null
  rate: number | null
  overtime_hours: number | null
  overtime_rate: number | null
  total_pay: number | null
  notes: string | null
  foreman: string | null
  vessel: string | null
  points_earned: number | null
  holiday: string | null
  qualifying_days: number | null
  created_at: string | null
  updated_at: string | null
}

interface ShiftInsert
  extends Record<string, unknown>,
    Omit<ShiftDraft, 'sourceUniqueId' | 'userEmail'> {
  user_id: string
}

interface ParseStats {
  totalRows: number
  skippedMissingRequired: number
  skippedInvalidDate: number
  skippedDuplicateUniqueId: number
  skippedRowErrors: number
  skippedMissingUser: number
  totalPaySum: number
  entryTypeCounts: Record<EntryType, number>
}

function determineEntryType(row: CSVRow): { entry_type: EntryType; leave_type?: LeaveType } {
  if (row['stathol-check'] === 'yes') return { entry_type: 'stat_holiday' }
  if (row['vacday-check'] === 'yes') return { entry_type: 'vacation' }
  if (row['sickday-check'] === 'yes') return { entry_type: 'leave', leave_type: 'sick_leave' }
  if (row['personalday-check'] === 'yes') {
    return { entry_type: 'leave', leave_type: 'personal_leave' }
  }
  if (row['pluggedin'] === 'yes') return { entry_type: 'standby' }
  if (!row['JOB'] && parseFloat(row['totalpay'] || '0') === 0) return { entry_type: 'day_off' }
  return { entry_type: 'worked' }
}

function parseArgs(args: string[]) {
  const argSet = new Set(args)
  const execute = argSet.has('--execute')
  const dryRun = argSet.has('--dry-run') || !execute
  const usersOnly = argSet.has('--users-only')
  const shiftsOnly = argSet.has('--shifts-only')

  let runUsers = true
  let runShifts = true

  if (usersOnly && !shiftsOnly) runShifts = false
  if (shiftsOnly && !usersOnly) runUsers = false

  return { execute, dryRun, runUsers, runShifts }
}

function normalizeEmail(value?: string): string | null {
  const trimmed = value?.trim()
  if (!trimmed || !trimmed.includes('@')) return null
  return trimmed.toLowerCase()
}

function normalizeString(value?: string): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function parseNumber(value?: string): number | null {
  const trimmed = value?.trim()
  if (!trimmed) return null
  const parsed = Number.parseFloat(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function parseInteger(value?: string): number | null {
  const trimmed = value?.trim()
  if (!trimmed) return null
  const parsed = Number.parseInt(trimmed, 10)
  return Number.isFinite(parsed) ? parsed : null
}

function getSubjob(row: CSVRow): string | null {
  return (
    normalizeString(row['subjobnew']) ??
    normalizeString(row['subjob']) ??
    normalizeString(row['SUBJOB'])
  )
}

function mapShiftType(value?: string): ShiftType | null {
  const normalized = value?.trim().toUpperCase()
  if (!normalized) return null
  if (normalized === 'DAY') return 'day'
  if (normalized === 'NIGHT') return 'night'
  if (normalized === 'GRAVEYARD') return 'graveyard'
  return null
}

function normalizeLeaveType(value?: string): LeaveType | null {
  const normalized = value?.trim().toLowerCase()
  if (!normalized) return null
  if (normalized.includes('sick')) return 'sick_leave'
  if (normalized.includes('personal')) return 'personal_leave'
  if (normalized.includes('parental')) return 'parental_leave'
  return null
}

function parseDateOnly(value: string, rowNumber: number, fieldName: string): string | null {
  const parsed = parseDate(value, CSV_DATE_FORMAT, new Date())
  if (!isValid(parsed)) {
    console.warn(`Row ${rowNumber}: invalid ${fieldName}="${value}"`)
    return null
  }
  return format(parsed, 'yyyy-MM-dd')
}

function parseOptionalTimestamp(
  value: string | undefined,
  rowNumber: number,
  fieldName: string
): string | null | 'invalid' {
  const trimmed = value?.trim()
  if (!trimmed) return null
  const parsed = parseDate(trimmed, CSV_DATE_FORMAT, new Date())
  if (!isValid(parsed)) {
    console.warn(`Row ${rowNumber}: invalid ${fieldName}="${value}"`)
    return 'invalid'
  }
  return parsed.toISOString()
}

function generateRandomPassword(): string {
  return randomBytes(16).toString('hex')
}

function createStats(): ParseStats {
  return {
    totalRows: 0,
    skippedMissingRequired: 0,
    skippedInvalidDate: 0,
    skippedDuplicateUniqueId: 0,
    skippedRowErrors: 0,
    skippedMissingUser: 0,
    totalPaySum: 0,
    entryTypeCounts: {
      worked: 0,
      leave: 0,
      vacation: 0,
      standby: 0,
      stat_holiday: 0,
      day_off: 0,
    },
  }
}

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

async function parseCsv(csvPath: string, includeShifts: boolean) {
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at ${csvPath}`)
    process.exit(1)
  }

  const uniqueEmails = new Set<string>()
  const shiftDrafts: ShiftDraft[] = []
  const seenUniqueIds = new Set<string>()
  const stats = createStats()
  let rowNumber = 1

  const parser = fs
    .createReadStream(csvPath)
    .pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
      })
    )

  for await (const record of parser) {
    rowNumber += 1
    stats.totalRows += 1

    try {
      const row = record as CSVRow
      const email = normalizeEmail(row['relUser'])
      if (email) uniqueEmails.add(email)

      if (!includeShifts) {
        if (stats.totalRows % PARSE_LOG_INTERVAL === 0) {
          console.log(`Parsed ${stats.totalRows} rows`)
        }
        continue
      }

      const missingFields: string[] = []
      const uniqueId = normalizeString(row['unique id'])
      const rawDate = row['DATE']?.trim()

      if (!email) missingFields.push('relUser')
      if (!uniqueId) missingFields.push('unique id')
      if (!rawDate) missingFields.push('DATE')

      if (missingFields.length > 0) {
        stats.skippedMissingRequired += 1
        console.warn(
          `Row ${rowNumber}: missing required fields: ${missingFields.join(', ')}`
        )
        continue
      }

      if (!email || !uniqueId || !rawDate) {
        continue
      }

      if (seenUniqueIds.has(uniqueId)) {
        stats.skippedDuplicateUniqueId += 1
        console.warn(`Row ${rowNumber}: duplicate unique id "${uniqueId}"`)
        continue
      }

      seenUniqueIds.add(uniqueId)

      const date = parseDateOnly(rawDate, rowNumber, 'DATE')
      if (!date) {
        stats.skippedInvalidDate += 1
        continue
      }

      const createdAt = parseOptionalTimestamp(row['Creation Date'], rowNumber, 'Creation Date')
      if (createdAt === 'invalid') {
        stats.skippedInvalidDate += 1
        continue
      }

      const updatedAt = parseOptionalTimestamp(row['Modified Date'], rowNumber, 'Modified Date')
      if (updatedAt === 'invalid') {
        stats.skippedInvalidDate += 1
        continue
      }

      const entry = determineEntryType(row)
      const leaveType =
        entry.entry_type === 'leave'
          ? normalizeLeaveType(row['leaveType']) ?? entry.leave_type ?? null
          : null

      const draft: ShiftDraft = {
        sourceUniqueId: uniqueId,
        userEmail: email,
        entry_type: entry.entry_type,
        leave_type: leaveType,
        date,
        job: normalizeString(row['JOB']),
        subjob: getSubjob(row),
        location: normalizeString(row['LOCATION']),
        shift_type: mapShiftType(row['DNG']),
        hours: parseNumber(row['REG HR']),
        rate: parseNumber(row['REG RT']),
        overtime_hours: parseNumber(row['OT HR']),
        overtime_rate: parseNumber(row['OT RT']),
        total_pay: parseNumber(row['totalpay']),
        notes: normalizeString(row['notes']),
        foreman: normalizeString(row['Foreman']),
        vessel: normalizeString(row['Vessel']),
        points_earned: parseInteger(row['pointsAwarded']),
        holiday:
          entry.entry_type === 'stat_holiday' ? normalizeString(row['stat-holiday']) : null,
        qualifying_days: parseInteger(row['qualifyingDays']),
        created_at: createdAt === 'invalid' ? null : createdAt,
        updated_at: updatedAt === 'invalid' ? null : updatedAt,
      }

      stats.entryTypeCounts[draft.entry_type] += 1

      if (draft.total_pay !== null) {
        stats.totalPaySum += draft.total_pay
      }

      shiftDrafts.push(draft)

      if (stats.totalRows % PARSE_LOG_INTERVAL === 0) {
        console.log(`Parsed ${stats.totalRows} rows`)
      }
    } catch (error) {
      stats.skippedRowErrors += 1
      console.warn(`Row ${rowNumber}: error parsing row`, error)
    }
  }

  return { uniqueEmails, shiftDrafts, stats }
}

async function loadExistingUsersMap(supabase: SupabaseClient): Promise<Map<string, string>> {
  const existingUsers = await fetchAllPaginated<{ id: string; email: string }>(
    supabase,
    'users',
    'id,email'
  )
  const map = new Map<string, string>()
  for (const user of existingUsers) {
    if (user.email) {
      map.set(user.email.toLowerCase(), user.id)
    }
  }
  return map
}

async function findUserIdByEmail(
  supabase: SupabaseClient,
  email: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (error || !data?.id) return null
  return data.id
}

async function setPasswordResetRequired(
  supabase: SupabaseClient,
  userId: string,
  canSet: boolean | null
): Promise<boolean> {
  if (canSet === false) return false

  const { error } = await supabase
    .from('users')
    .update({ password_reset_required: true })
    .eq('id', userId)

  if (!error) return true

  const message = error.message.toLowerCase()
  if (message.includes('password_reset_required')) {
    if (canSet === null) {
      console.warn('password_reset_required column not found; skipping flag updates')
    }
    return false
  }

  console.warn(`Failed to set password_reset_required for ${userId}: ${error.message}`)
  return canSet ?? true
}

async function migrateUsers(
  supabase: SupabaseClient,
  emails: Set<string>,
  emailToUserId: Map<string, string>
) {
  let created = 0
  let skippedExisting = 0
  let errors = 0
  let canSetPasswordResetRequired: boolean | null = null

  const emailList = Array.from(emails).sort()

  for (let index = 0; index < emailList.length; index += 1) {
    const email = emailList[index]

    if (emailToUserId.has(email)) {
      skippedExisting += 1
      continue
    }

    const password = generateRandomPassword()
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error || !data?.user) {
      const lowerMessage = error?.message?.toLowerCase() ?? ''
      if (lowerMessage.includes('already') || lowerMessage.includes('exists')) {
        const existingId = await findUserIdByEmail(supabase, email)
        if (existingId) {
          emailToUserId.set(email, existingId)
          skippedExisting += 1
          continue
        }
      }

      console.error(`Failed to create user ${email}: ${error?.message ?? 'Unknown error'}`)
      errors += 1
      continue
    }

    emailToUserId.set(email, data.user.id)
    created += 1
    canSetPasswordResetRequired = await setPasswordResetRequired(
      supabase,
      data.user.id,
      canSetPasswordResetRequired
    )

    if ((index + 1) % 500 === 0) {
      console.log(`Users processed ${index + 1}/${emailList.length}`)
    }
  }

  return { created, skippedExisting, errors }
}

function buildShiftInserts(
  drafts: ShiftDraft[],
  emailToUserId: Map<string, string>,
  stats: ParseStats
): ShiftInsert[] {
  const inserts: ShiftInsert[] = []

  for (const draft of drafts) {
    const userId = emailToUserId.get(draft.userEmail)
    if (!userId) {
      stats.skippedMissingUser += 1
      console.warn(
        `Missing user for email ${draft.userEmail}; skipping shift ${draft.sourceUniqueId}`
      )
      continue
    }

    const { sourceUniqueId, userEmail, ...rest } = draft
    inserts.push({
      user_id: userId,
      ...rest,
    })
  }

  return inserts
}

async function insertShifts(
  supabase: SupabaseClient,
  inserts: ShiftInsert[]
): Promise<{ inserted: number; errors: number }> {
  let inserted = 0
  let errors = 0

  for (let i = 0; i < inserts.length; i += INSERT_LOG_INTERVAL) {
    const slice = inserts.slice(i, i + INSERT_LOG_INTERVAL)
    const result = await batchInsert(supabase, 'shifts', slice, 500)
    inserted += result.inserted
    errors += result.errors.length

    if (result.errors.length > 0) {
      result.errors.forEach((err) => console.error(err.message))
    }

    console.log(`Inserted ${Math.min(i + slice.length, inserts.length)}/${inserts.length} shifts`)
  }

  return { inserted, errors }
}

function logSummary(
  stats: ParseStats,
  uniqueEmailCount: number,
  shiftDraftCount: number
) {
  console.log('')
  console.log('Summary')
  console.log(`Total rows: ${stats.totalRows}`)
  console.log(`Unique emails: ${uniqueEmailCount}`)
  console.log(`Shift rows prepared: ${shiftDraftCount}`)
  console.log(`Skipped missing required: ${stats.skippedMissingRequired}`)
  console.log(`Skipped invalid dates: ${stats.skippedInvalidDate}`)
  console.log(`Skipped duplicates: ${stats.skippedDuplicateUniqueId}`)
  console.log(`Skipped row errors: ${stats.skippedRowErrors}`)
  console.log(`Skipped missing users: ${stats.skippedMissingUser}`)
  console.log(`Entry types: ${JSON.stringify(stats.entryTypeCounts)}`)
  console.log(`Total pay sum: ${stats.totalPaySum.toFixed(2)}`)
  console.log('')
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  console.log(`CSV: ${CSV_PATH}`)
  console.log(`Mode: ${options.dryRun ? 'dry-run' : 'execute'}`)
  console.log(`Users: ${options.runUsers ? 'yes' : 'no'}`)
  console.log(`Shifts: ${options.runShifts ? 'yes' : 'no'}`)

  const includeShifts = options.runShifts || options.dryRun
  const { uniqueEmails, shiftDrafts, stats } = await parseCsv(CSV_PATH, includeShifts)

  logSummary(stats, uniqueEmails.size, shiftDrafts.length)

  if (!options.execute) {
    console.log('Dry run complete. Use --execute to run the migration.')
    return
  }

  const supabase = createAdminClient()
  let emailToUserId = new Map<string, string>()

  try {
    emailToUserId = await loadExistingUsersMap(supabase)
  } catch (error) {
    console.warn('Failed to load existing users map:', error)
  }

  if (options.runUsers) {
    const userResult = await migrateUsers(supabase, uniqueEmails, emailToUserId)
    console.log(
      `Users created: ${userResult.created}, existing skipped: ${userResult.skippedExisting}, errors: ${userResult.errors}`
    )
  }

  if (options.runShifts) {
    const inserts = buildShiftInserts(shiftDrafts, emailToUserId, stats)
    const shiftResult = await insertShifts(supabase, inserts)
    console.log(
      `Shifts inserted: ${shiftResult.inserted}, insert errors: ${shiftResult.errors}`
    )
  }

  logSummary(stats, uniqueEmails.size, shiftDrafts.length)
}

main().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
