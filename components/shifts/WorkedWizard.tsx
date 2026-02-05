'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { CalendarIcon, Sun, Moon, Sunset } from 'lucide-react'
import { cn } from '@/lib/utils'
import { calculateShiftPay, getDifferentialForJob, TRAVEL_RATE } from '@/lib/pay'

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

interface WorkedWizardProps {
  jobs: Job[]
  locations: Location[]
}

type ShiftType = 'day' | 'night' | 'graveyard'

const SHIFT_TYPE_ICONS = {
  day: Sun,
  night: Moon,
  graveyard: Sunset,
}

export function WorkedWizard({ jobs, locations }: WorkedWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [job, setJob] = useState<string>('')
  const [subjob, setSubjob] = useState<string>('')
  const [date, setDate] = useState<Date>(new Date())
  const [shiftType, setShiftType] = useState<ShiftType>('day')
  const [location, setLocation] = useState<string>('')
  const [hours, setHours] = useState<number>(8)
  const [overtimeHours, setOvertimeHours] = useState<number>(0)
  const [includeTravel, setIncludeTravel] = useState(false)
  const [travelHours, setTravelHours] = useState<number>(1)
  const [includeMeal, setIncludeMeal] = useState(false)
  const [foreman, setForeman] = useState('')
  const [vessel, setVessel] = useState('')
  const [notes, setNotes] = useState('')

  const selectedJob = useMemo(() => jobs.find((j) => j.name === job), [jobs, job])

  const payCalc = useMemo(() => {
    if (!job) return null
    return calculateShiftPay({
      job,
      hours,
      overtimeHours,
      travelHours: includeTravel ? travelHours : 0,
      includeMeal,
    })
  }, [job, hours, overtimeHours, includeTravel, travelHours, includeMeal])

  useEffect(() => {
    if (job && location && shiftType) {
      fetchHoursOverride()
    }
  }, [job, subjob, location, shiftType])

  async function fetchHoursOverride() {
    try {
      const params = new URLSearchParams({
        job,
        location,
        shift_type: shiftType,
        ...(subjob && { subjob }),
      })
      const res = await fetch(`/api/pay/calculate?${params}`)
      if (res.ok) {
        const data = await res.json()
        setHours(data.hours || 8)
        setOvertimeHours(data.overtime_hours || 0)
      }
    } catch {
    }
  }

  async function handleSubmit() {
    if (!payCalc) {
      console.error('[WorkedWizard] Cannot submit: payCalc is null')
      return
    }

    const payload = {
      entry_type: 'worked',
      date: format(date, 'yyyy-MM-dd'),
      job,
      subjob: subjob || null,
      location,
      shift_type: shiftType,
      hours,
      rate: payCalc.regularRate,
      overtime_hours: overtimeHours,
      overtime_rate: payCalc.overtimeRate,
      travel_hours: includeTravel ? travelHours : 0,
      meal: includeMeal,
      foreman: foreman || null,
      vessel: vessel || null,
      notes: notes || null,
      total_pay: payCalc.totalPay,
    }

    console.log('[WorkedWizard] Submitting shift:', JSON.stringify(payload, null, 2))

    setLoading(true)
    try {
      const res = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      console.log('[WorkedWizard] Response status:', res.status)
      console.log('[WorkedWizard] Response data:', JSON.stringify(data, null, 2))

      if (!res.ok) {
        const errorMsg = data.error || data.message || 'Failed to create shift'
        console.error('[WorkedWizard] Error:', errorMsg)
        if (data.details) {
          console.error('[WorkedWizard] Validation details:', JSON.stringify(data.details, null, 2))
        }
        throw new Error(errorMsg)
      }

      toast.success('Shift added successfully!')
      router.push('/index/shifts/weekly')
    } catch (error) {
      console.error('[WorkedWizard] Submit error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add shift')
    } finally {
      setLoading(false)
    }
  }

  function canProceed(): boolean {
    if (step === 1) return !!job && (!selectedJob?.has_subjobs || !!subjob)
    if (step === 2) return !!date && !!shiftType && !!location
    return true
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              'w-3 h-3 rounded-full',
              s === step ? 'bg-primary' : s < step ? 'bg-primary/50' : 'bg-muted'
            )}
          />
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>What job did you work?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Job Type</Label>
              <Select value={job} onValueChange={(v) => { setJob(v); setSubjob('') }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((j) => (
                    <SelectItem key={j.id} value={j.name}>
                      {j.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedJob?.has_subjobs && selectedJob.subjobs.filter(s => s).length > 0 && (
              <div className="space-y-2">
                <Label>Sub-type</Label>
                <Select value={subjob} onValueChange={setSubjob}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-type" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedJob.subjobs.filter(s => s).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Where and when?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Shift Type</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['day', 'night', 'graveyard'] as const).map((type) => {
                  const Icon = SHIFT_TYPE_ICONS[type]
                  const label = type === 'graveyard' ? 'grave' : type
                  return (
                    <Button
                      key={type}
                      type="button"
                      variant={shiftType === type ? 'default' : 'outline'}
                      className="flex flex-col items-center py-3 px-2 h-auto min-w-0 whitespace-normal"
                      onClick={() => setShiftType(type)}
                    >
                      <Icon className="h-5 w-5 mb-1 shrink-0" />
                      <span className="text-xs capitalize leading-tight">{label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((l) => (
                    <SelectItem key={l.id} value={l.name}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && payCalc && (
        <Card>
          <CardHeader>
            <CardTitle>Hours and pay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Regular Hours</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={hours}
                  onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Rate ($/hr)</Label>
                <Input value={`$${payCalc.regularRate.toFixed(2)}`} readOnly className="bg-muted" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Overtime Hours</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>OT Rate ($/hr)</Label>
                <Input value={`$${payCalc.overtimeRate.toFixed(2)}`} readOnly className="bg-muted" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="travel">Include Travel</Label>
              <Switch id="travel" checked={includeTravel} onCheckedChange={setIncludeTravel} />
            </div>

            {includeTravel && (
              <div className="grid grid-cols-2 gap-4 pl-4 border-l-2">
                <div className="space-y-2">
                  <Label>Travel Hours</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={travelHours}
                    onChange={(e) => setTravelHours(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Travel Rate</Label>
                  <Input value={`$${TRAVEL_RATE.toFixed(2)}`} readOnly className="bg-muted" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="meal">Include Meal Period</Label>
              <Switch id="meal" checked={includeMeal} onCheckedChange={setIncludeMeal} />
            </div>

            <div className="space-y-2">
              <Label>Foreman</Label>
              <Input value={foreman} onChange={(e) => setForeman(e.target.value)} placeholder="Enter foreman name" />
            </div>

            <div className="space-y-2">
              <Label>Vessel</Label>
              <Input value={vessel} onChange={(e) => setVessel(e.target.value)} placeholder="Enter vessel" />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any notes about this shift" />
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Pay</div>
              <div className="text-2xl font-bold">${payCalc.totalPay.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 min-w-0">
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="flex-1 min-w-0">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading} className="flex-1 min-w-0">
            {loading ? 'Adding...' : 'Add Shift'}
          </Button>
        )}
      </div>
    </div>
  )
}
