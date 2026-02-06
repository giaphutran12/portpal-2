'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

const QUALIFYING_DAYS_OPTIONS = [
  { value: '14', label: '1-14 days' },
  { value: '15', label: '15+ days' },
] as const

export function StatHolidayForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [holidays, setHolidays] = useState<Array<{ id: string; name: string }>>([])
  const [holidaysLoading, setHolidaysLoading] = useState(true)

  const [holiday, setHoliday] = useState<string>('')
  const [qualifyingDays, setQualifyingDays] = useState<string>('')
  const [date, setDate] = useState<Date>(new Date())
  const [notes, setNotes] = useState<string>('')

  useEffect(() => {
    async function fetchHolidays() {
      try {
        const res = await fetch('/api/reference/holidays')
        if (!res.ok) throw new Error('Failed to fetch holidays')
        const data = await res.json()
        setHolidays(data)
      } catch (error) {
        toast.error('Failed to load holidays')
      } finally {
        setHolidaysLoading(false)
      }
    }

    fetchHolidays()
  }, [])

  async function handleSubmit() {
    if (!holiday) {
      toast.error('Please select a holiday')
      return
    }

    if (!qualifyingDays) {
      toast.error('Please select qualifying days')
      return
    }

    setLoading(true)
    try {
       const res = await fetch('/api/shifts', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           entry_type: 'stat_holiday',
           holiday_id: holiday,
           qualifying_days: parseInt(qualifyingDays, 10),
           date: format(date, 'yyyy-MM-dd'),
           notes: notes || null,
         }),
       })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create stat holiday entry')
      }

      toast.success('Stat holiday entry added!')
      router.push('/shifts')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add stat holiday entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Stat Holiday</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Holiday</Label>
            <Select value={holiday} onValueChange={setHoliday} disabled={holidaysLoading}>
              <SelectTrigger>
                <SelectValue placeholder={holidaysLoading ? 'Loading...' : 'Select a holiday'} />
              </SelectTrigger>
              <SelectContent>
                {holidays.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Qualifying Days</Label>
            <Select value={qualifyingDays} onValueChange={setQualifyingDays}>
              <SelectTrigger>
                <SelectValue placeholder="Select qualifying days" />
              </SelectTrigger>
              <SelectContent>
                {QUALIFYING_DAYS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
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
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-24"
            />
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Log'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
