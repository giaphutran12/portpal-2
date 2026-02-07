'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Goal {
  id?: string
  name: string
  goal_type: 'weekly' | 'monthly' | 'yearly'
  kind: 'earnings' | 'hours' | 'shifts' | 'pension'
  start_date: string
  end_date: string
  target: number
}

interface GoalFormProps {
  goal?: Goal
  mode: 'create' | 'edit'
}

const goalTypes = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
] as const

const goalKinds = [
  { value: 'earnings', label: 'Earnings' },
  { value: 'hours', label: 'Hours' },
  { value: 'shifts', label: 'Shifts' },
  { value: 'pension', label: 'Pension' },
] as const

const targetLabels: Record<Goal['kind'], string> = {
  earnings: 'Target Amount ($)',
  hours: 'Target Hours',
  shifts: 'Target Shifts',
  pension: 'Target Amount ($)',
}

export function GoalForm({ goal, mode }: GoalFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [name, setName] = useState(goal?.name ?? '')
  const [type, setType] = useState<Goal['goal_type']>(goal?.goal_type ?? 'monthly')
  const [kind, setKind] = useState<Goal['kind']>(goal?.kind ?? 'earnings')
  const [startDate, setStartDate] = useState<Date | undefined>(
    goal?.start_date ? new Date(goal.start_date) : new Date()
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    goal?.end_date ? new Date(goal.end_date) : undefined
  )
  const [targetValue, setTargetValue] = useState(goal?.target?.toString() ?? '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('Please enter a goal name')
      return
    }
    if (!startDate || !endDate) {
      toast.error('Please select start and end dates')
      return
    }
    if (!targetValue || Number(targetValue) <= 0) {
      toast.error('Please enter a valid target value')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        name: name.trim(),
        goal_type: type,
        kind,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        target: Number(targetValue),
      }

      const url = mode === 'create' ? '/api/goals' : `/api/goals/${goal?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      toast.success(mode === 'create' ? 'Goal created!' : 'Goal updated!')
      router.push('/goals')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="e.g Level-Up Year"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Goal Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as Goal['goal_type'])}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {goalTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Kind</Label>
          <Select value={kind} onValueChange={(v) => setKind(v as Goal['kind'])}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {goalKinds.map((k) => (
                <SelectItem key={k.value} value={k.value}>
                  {k.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => startDate ? date < startDate : false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="target">{targetLabels[kind]}</Label>
        <Input
          id="target"
          type="number"
          min="0"
          step={kind === 'shifts' ? '1' : '0.01'}
          placeholder={kind === 'shifts' ? 'e.g. 100' : 'e.g. 50000'}
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Create Goal' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
