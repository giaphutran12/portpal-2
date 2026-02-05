'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

const LEAVE_TYPES = [
  { value: 'sick_leave', label: 'Sick Leave' },
  { value: 'personal_leave', label: 'Personal Leave' },
  { value: 'parental_leave', label: 'Parental Leave' },
] as const

export function LeaveForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [leaveType, setLeaveType] = useState<string>('')
  const [date, setDate] = useState<Date>(new Date())
  const [hours, setHours] = useState<number>(8)
  const [rate, setRate] = useState<number>(55.30)
  const [willReceivePaystub, setWillReceivePaystub] = useState(false)

  async function handleSubmit() {
    if (!leaveType) {
      toast.error('Please select a leave type')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry_type: 'leave',
          date: format(date, 'yyyy-MM-dd'),
          leave_type: leaveType,
          hours,
          rate,
          will_receive_paystub: willReceivePaystub,
          total_pay: hours * rate,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create leave entry')
      }

      toast.success('Leave entry added!')
      router.push('/shifts')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add leave entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Leave</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Leave Type</Label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {LEAVE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hours</Label>
              <Input
                type="number"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Rate ($/hr)</Label>
              <Input
                type="number"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="paystub">Will receive paystub later</Label>
            <Switch id="paystub" checked={willReceivePaystub} onCheckedChange={setWillReceivePaystub} />
          </div>

          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Pay</div>
            <div className="text-2xl font-bold">${(hours * rate).toFixed(2)}</div>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Log'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
