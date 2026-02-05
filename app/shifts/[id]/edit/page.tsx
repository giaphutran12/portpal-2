'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { use } from 'react'

interface EditShiftPageProps {
  params: Promise<{ id: string }>
}

interface Shift {
  id: string
  entry_type: string
  date: string
  job?: string
  subjob?: string
  location?: string
  shift_type?: string
  hours?: number
  rate?: number
  overtime_hours?: number
  overtime_rate?: number
  foreman?: string
  vessel?: string
  leave_type?: string
  holiday?: string
  qualifying_days?: number
  notes?: string
  total_pay?: number
}

export default function EditShiftPage({ params }: EditShiftPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [shift, setShift] = useState<Shift | null>(null)
  const originalShift = useRef<Shift | null>(null)

  useEffect(() => {
    async function fetchShift() {
      try {
        const res = await fetch(`/api/shifts/${id}`)
        if (!res.ok) throw new Error('Failed to fetch shift')
        const data = await res.json()
        setShift(data)
        originalShift.current = { ...data }
      } catch (error) {
        toast.error('Failed to load shift')
        router.push('/index/shifts/monthly')
      } finally {
        setLoading(false)
      }
    }
    fetchShift()
  }, [id, router])

  function handleReset() {
    if (originalShift.current) {
      setShift({ ...originalShift.current })
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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/shifts/${id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Edit Shift</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">{shift.entry_type.replace('_', ' ')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {shift.entry_type === 'worked' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hours">Hours</Label>
                      <Input
                        id="hours"
                        type="number"
                        step="0.5"
                        value={shift.hours || ''}
                        onChange={(e) => setShift({ ...shift, hours: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate">Rate ($/hr)</Label>
                      <Input
                        id="rate"
                        type="number"
                        step="0.01"
                        value={shift.rate || ''}
                        onChange={(e) => setShift({ ...shift, rate: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="overtime_hours">Overtime Hours</Label>
                      <Input
                        id="overtime_hours"
                        type="number"
                        step="0.5"
                        value={shift.overtime_hours || ''}
                        onChange={(e) => setShift({ ...shift, overtime_hours: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overtime_rate">OT Rate ($/hr)</Label>
                      <Input
                        id="overtime_rate"
                        type="number"
                        step="0.01"
                        value={shift.overtime_rate || ''}
                        onChange={(e) => setShift({ ...shift, overtime_rate: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="foreman">Foreman</Label>
                    <Input
                      id="foreman"
                      value={shift.foreman || ''}
                      onChange={(e) => setShift({ ...shift, foreman: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vessel">Vessel</Label>
                    <Input
                      id="vessel"
                      value={shift.vessel || ''}
                      onChange={(e) => setShift({ ...shift, vessel: e.target.value })}
                    />
                  </div>
                </>
              )}

              {shift.entry_type === 'leave' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      step="0.5"
                      value={shift.hours || ''}
                      onChange={(e) => setShift({ ...shift, hours: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate ($/hr)</Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.01"
                      value={shift.rate || ''}
                      onChange={(e) => setShift({ ...shift, rate: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={shift.notes || ''}
                  onChange={(e) => setShift({ ...shift, notes: e.target.value })}
                  placeholder="Add any notes..."
                  className="min-h-24"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 mt-4">
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
