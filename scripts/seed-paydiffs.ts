import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import Papa from 'papaparse'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

interface PaydiffRow {
  JOB: string
  SHIFT: string
  LOCATION: string
  SUBJOB: string
  REGHRS: string
  OTHRS: string
}

async function seedPaydiffs() {
  const csvPath = path.join(__dirname, '../pay_data/PAYDIFFS_clean.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  
  const { data } = Papa.parse<PaydiffRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  })

  console.log(`Parsed ${data.length} PAYDIFFS rows`)

  const records = data.map((row) => ({
    job: row.JOB.trim(),
    subjob: row.SUBJOB?.trim() || null,
    location: row.LOCATION.trim(),
    shift_type: row.SHIFT.trim().toUpperCase(),
    hours: parseFloat(row.REGHRS),
    overtime_hours: parseFloat(row.OTHRS) || 0,
  }))

  const BATCH_SIZE = 100
  let inserted = 0

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE)
    const { error } = await supabase.from('pay_overrides').upsert(batch, {
      onConflict: 'job,subjob,location,shift_type',
    })

    if (error) {
      console.error(`Batch ${i / BATCH_SIZE + 1} error:`, error.message)
    } else {
      inserted += batch.length
      console.log(`Inserted batch ${i / BATCH_SIZE + 1} (${inserted}/${records.length})`)
    }
  }

  console.log(`\nDone! Inserted ${inserted} PAYDIFFS records`)
}

seedPaydiffs().catch(console.error)
