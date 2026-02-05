'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, RotateCcw, CalendarIcon, Sun, Moon, Sunset } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { calculateRegularRate, calculateOvertimeRate, getDifferentialForJob, TRAVEL_RATE, MEAL_HOURS } from '@/lib/pay/calculate'
import { use } from 'react'

interface EditShiftPageProps {
  params: Promise<{ id: string }>
}

interface Job {
  id: string
  name: string
  has_subjobs: boolean
  subjobs: string[]
}

interface Location {
  id: string
  name: string
}

interface Holiday {
  id: string
  name: string
  date: string
}

interface Shift {
  id: string
  entry_type: string
  date: string
  job?: string
  subjob?: string
  location?: string
  shift_type?: 'day' | 'night' | 'graveyard'
  hours?: number
  rate?: number
  overtime_hours?: number
  overtime_rate?: number
  travel_hours?: number
  meal?: boolean
  foreman?: string
  vessel?: string
  leave_type?: string
  holiday_id?: string
  qualifying_days?: string
  will_receive_paystub?: boolean
  notes?: string
  total_pay?: number
}

const LEAVE_TYPES = [
  { value: 'sick_leave', label: 'Sick Leave' },
  { value: 'personal_leave', label: 'Personal Leave' },
  { value: 'parental_leave', label: 'Parental Leave' },
] as const

const QUALIFYING_DAYS_OPTIONS = [
  { value: '1-14', label: '1-14 days' },
  { value: '15+', label: '15+ days' },
] as const

const SHIFT_TYPE_ICONS = {
  day: Sun,
  night: Moon,
  graveyard: Sunset,
}

const ENTRY_TYPES = [
  { value: 'worked', label: 'Worked' },
  { value: 'leave', label: 'Leave' },
  { value: 'stat_holiday', label: 'Stat Holiday' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'standby', label: 'Standby' },
  { value: 'day_off', label: 'Day Off' },
]

export default function EditShiftPage({ params }: EditShiftPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Reference Data
  const [jobs, setJobs] = useState<Job[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [holidays, setHolidays] = useState<Holiday[]>([])
  
  // Form State
  const [shift, setShift] = useState<Shift | null>(null)
  const originalShift = useRef<Shift | null>(null)

  // Derived state for job selection
  const selectedJob = useMemo(() => jobs.find(j => j.name === shift?.job), [jobs, shift?.job])

  useEffect(() => {
    async function loadData() {
      try {
        const [shiftRes, jobsRes, locsRes, holsRes] = await Promise.all([
          fetch(`/api/shifts/${id}`),
          fetch('/api/reference/jobs'),
          fetch('/api/reference/locations'),
          fetch('/api/reference/holidays')
        ])

        if (!shiftRes.ok) throw new Error('Failed to fetch shift')
        
        const shiftData = await shiftRes.json()
        const jobsData = await jobsRes.json().catch(() => [])
        const locsData = await locsRes.json().catch(() => [])
        const holsData = await holsRes.json().catch(() => [])

        // Ensure date is consistent string for form but we'll use Date object for Calendar
        setShift(shiftData)
        originalShift.current = JSON.parse(JSON.stringify(shiftData))
        
        setJobs(jobsData)
        setLocations(locsData)
        setHolidays(holsData)
      } catch (error) {
        toast.error('Failed to load data')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  // Pay Calculation Effect
  useEffect(() => {
    if (!shift || shift.entry_type !== 'worked') return

    // Calculate total pay whenever relevant fields change
    const hours = shift.hours || 0
    const rate = shift.rate || 0
    const otHours = shift.overtime_hours || 0
    const otRate = shift.overtime_rate || 0
    const travelHours = shift.travel_hours || 0
    const mealPay = shift.meal ? (MEAL_HOURS * otRate) : 0
    
    const total = (hours * rate) + (otHours * otRate) + (travelHours * TRAVEL_RATE) + mealPay
    
    // Only update if difference is significant to avoid infinite loops with floats
    if (Math.abs((shift.total_pay || 0) - total) > 0.01) {
        setShift(prev => prev ? ({ ...prev, total_pay: Number(total.toFixed(2)) }) : null)
    }
  }, [
    shift?.entry_type,
    shift?.hours, 
    shift?.rate, 
    shift?.overtime_hours, 
    shift?.overtime_rate, 
    shift?.travel_hours, 
    shift?.meal
  ])

  function handleEntryTypeChange(newType: string) {
    if (!shift) return

    // Preserve common fields: id, date, notes
    const common = {
        id: shift.id,
        date: shift.date,
        notes: shift.notes,
        entry_type: newType
    }

    // Initialize defaults based on type
    let newShift: Shift = { ...common }

    if (newType === 'worked') {
        newShift = {
            ...newShift,
            hours: 8,
            rate: 55.30, // Default base rate
            shift_type: 'day',
            overtime_hours: 0,
            overtime_rate: 82.95, // Default OT rate
            travel_hours: 0,
            meal: false
        }
    } else if (newType === 'leave') {
        newShift = {
            ...newShift,
            hours: 8,
            rate: 55.30,
            will_receive_paystub: false
        }
    }

    setShift(newShift)
  }

  function handleJobChange(jobName: string) {
    const job = jobs.find(j => j.name === jobName)
    if (!job || !shift) return

    const differential = getDifferentialForJob(jobName)
    const newRate = calculateRegularRate(differential)
    const newOtRate = calculateOvertimeRate(differential)

    setShift({
        ...shift,
        job: jobName,
        subjob: '', // Reset subjob
        rate: newRate,
        overtime_rate: newOtRate
    })
  }

  function handleReset() {
    if (originalShift.current) {
      setShift(JSON.parse(JSON.stringify(originalShift.current)))
      toast.success('Reset to original values')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!shift) return

    setSaving(true)
    try {
      const res = await fetch(`/api/shifts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shift),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update shift')
      }

      toast.success('Shift updated')
      router.push(`/shifts/${id}`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update shift')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!shift) return null

  // Helper to handle simple field updates
  const updateField = (field: keyof Shift, value: any) => {
    setShift(prev => prev ? ({ ...prev, [field]: value }) : null)
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/shifts/${id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Edit Shift</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Top Section: Entry Type & Date */}
          <Card>
            <CardHeader>
                <CardTitle>Shift Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Entry Type</Label>
                    <Select value={shift.entry_type} onValueChange={handleEntryTypeChange}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {ENTRY_TYPES.map(t => (
                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {shift.date ? format(new Date(shift.date), 'PPP') : 'Pick a date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar 
                                mode="single" 
                                selected={shift.date ? new Date(shift.date) : undefined} 
                                onSelect={(d) => d && updateField('date', format(d, 'yyyy-MM-dd'))} 
                                initialFocus 
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </CardContent>
          </Card>

          {/* DYNAMIC SECTIONS BASED ON TYPE */}

          {/* WORKED SECTION */}
          {shift.entry_type === 'worked' && (
            <>
                <Card>
                    <CardHeader><CardTitle>Job & Location</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Job</Label>
                            <Select value={shift.job} onValueChange={handleJobChange}>
                                <SelectTrigger><SelectValue placeholder="Select job" /></SelectTrigger>
                                <SelectContent>
                                    {jobs.map(j => (
                                        <SelectItem key={j.id} value={j.name}>{j.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedJob?.has_subjobs && selectedJob.subjobs.filter(s => s).length > 0 && (
                            <div className="space-y-2">
                                <Label>Sub-job</Label>
                                <Select value={shift.subjob || ''} onValueChange={(v) => updateField('subjob', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select sub-job" /></SelectTrigger>
                                    <SelectContent>
                                        {selectedJob.subjobs.filter(s => s).map(s => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Select value={shift.location || ''} onValueChange={(v) => updateField('location', v)}>
                                <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                                <SelectContent>
                                    {locations.map(l => (
                                        <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Shift Type</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['day', 'night', 'graveyard'] as const).map((type) => {
                                    const Icon = SHIFT_TYPE_ICONS[type]
                                    return (
                                        <Button
                                            key={type}
                                            type="button"
                                            variant={shift.shift_type === type ? 'default' : 'outline'}
                                            className="flex flex-col items-center py-3 px-2 h-auto"
                                            onClick={() => updateField('shift_type', type)}
                                        >
                                            <Icon className="h-5 w-5 mb-1" />
                                            <span className="capitalize text-xs">{type === 'graveyard' ? 'Grave' : type}</span>
                                        </Button>
                                    )
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Pay Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Hours</Label>
                                <Input type="number" step="0.5" value={shift.hours || 0} onChange={(e) => updateField('hours', parseFloat(e.target.value) || 0)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Rate</Label>
                                <Input type="number" step="0.01" value={shift.rate || 0} onChange={(e) => updateField('rate', parseFloat(e.target.value) || 0)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Overtime Hours</Label>
                                <Input type="number" step="0.5" value={shift.overtime_hours || 0} onChange={(e) => updateField('overtime_hours', parseFloat(e.target.value) || 0)} />
                            </div>
                            <div className="space-y-2">
                                <Label>OT Rate</Label>
                                <Input type="number" step="0.01" value={shift.overtime_rate || 0} onChange={(e) => updateField('overtime_rate', parseFloat(e.target.value) || 0)} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t pt-4">
                            <Label htmlFor="travel_toggle">Travel Time</Label>
                            <Switch 
                                id="travel_toggle" 
                                checked={(shift.travel_hours || 0) > 0} 
                                onCheckedChange={(checked) => updateField('travel_hours', checked ? 1 : 0)} 
                            />
                        </div>
                        {(shift.travel_hours || 0) > 0 && (
                            <div className="grid grid-cols-2 gap-4 pl-4 border-l-2">
                                <div className="space-y-2">
                                    <Label>Travel Hours</Label>
                                    <Input type="number" step="0.5" value={shift.travel_hours || 0} onChange={(e) => updateField('travel_hours', parseFloat(e.target.value) || 0)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Travel Rate</Label>
                                    <Input value={`$${TRAVEL_RATE.toFixed(2)}`} readOnly disabled />
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between border-t pt-4">
                            <Label htmlFor="meal_toggle">Meal Period</Label>
                            <Switch 
                                id="meal_toggle" 
                                checked={shift.meal || false} 
                                onCheckedChange={(checked) => updateField('meal', checked)} 
                            />
                        </div>

                        <div className="p-4 bg-muted rounded-lg mt-4">
                            <div className="text-sm text-muted-foreground">Total Pay</div>
                            <div className="text-2xl font-bold">${shift.total_pay?.toFixed(2)}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Extra Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Foreman</Label>
                            <Input value={shift.foreman || ''} onChange={(e) => updateField('foreman', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Vessel</Label>
                            <Input value={shift.vessel || ''} onChange={(e) => updateField('vessel', e.target.value)} />
                        </div>
                    </CardContent>
                </Card>
            </>
          )}

          {/* LEAVE SECTION */}
          {shift.entry_type === 'leave' && (
            <Card>
                <CardHeader><CardTitle>Leave Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Leave Type</Label>
                        <Select value={shift.leave_type || ''} onValueChange={(v) => updateField('leave_type', v)}>
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                                {LEAVE_TYPES.map(t => (
                                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Hours</Label>
                            <Input type="number" step="0.5" value={shift.hours || 0} onChange={(e) => updateField('hours', parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Rate</Label>
                            <Input type="number" step="0.01" value={shift.rate || 0} onChange={(e) => updateField('rate', parseFloat(e.target.value) || 0)} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label>Will receive paystub later</Label>
                        <Switch 
                            checked={shift.will_receive_paystub || false} 
                            onCheckedChange={(c) => updateField('will_receive_paystub', c)} 
                        />
                    </div>
                </CardContent>
            </Card>
          )}

          {/* STAT HOLIDAY SECTION */}
          {shift.entry_type === 'stat_holiday' && (
            <Card>
                <CardHeader><CardTitle>Holiday Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Holiday</Label>
                        <Select value={shift.holiday_id || ''} onValueChange={(v) => updateField('holiday_id', v)}>
                            <SelectTrigger><SelectValue placeholder="Select holiday" /></SelectTrigger>
                            <SelectContent>
                                {holidays.map(h => (
                                    <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Qualifying Days</Label>
                        <Select value={shift.qualifying_days || ''} onValueChange={(v) => updateField('qualifying_days', v)}>
                            <SelectTrigger><SelectValue placeholder="Select days" /></SelectTrigger>
                            <SelectContent>
                                {QUALIFYING_DAYS_OPTIONS.map(o => (
                                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
          )}

          {/* NOTES SECTION (COMMON) */}
          <Card>
            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
            <CardContent>
                <Textarea 
                    value={shift.notes || ''} 
                    onChange={(e) => updateField('notes', e.target.value)} 
                    placeholder="Add notes..." 
                    className="min-h-[100px]"
                />
            </CardContent>
          </Card>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button type="button" variant="outline" className="flex-1" asChild>
              <Link href={`/shifts/${id}`}>Cancel</Link>
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
