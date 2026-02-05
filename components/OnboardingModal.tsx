'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

const LOCALS = ['500', '502'] as const
const BOARDS = ['A BOARD', 'B BOARD', 'C BOARD', 'T BOARD', '00 BOARD', 'R BOARD', 'UNION'] as const

interface OnboardingModalProps {
  open: boolean
  onComplete: () => void
  userId: string
}

export function OnboardingModal({ open, onComplete, userId }: OnboardingModalProps) {
  const [loading, setLoading] = useState(false)
  const [local, setLocal] = useState<string>('')
  const [board, setBoard] = useState<string>('')

  async function handleSubmit() {
    if (!local || !board) {
      toast.error('Please select both Local and Board')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('users')
      .update({
        ilwu_local: local,
        board: board,
        onboarding_completed: true,
      })
      .eq('id', userId)

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success('Welcome to PortPal!')
    onComplete()
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>Tell us a bit about yourself to get started</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>ILWU Local</Label>
            <Select value={local} onValueChange={setLocal}>
              <SelectTrigger>
                <SelectValue placeholder="Select your local" />
              </SelectTrigger>
              <SelectContent>
                {LOCALS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Board</Label>
            <Select value={board} onValueChange={setBoard}>
              <SelectTrigger>
                <SelectValue placeholder="Select your board" />
              </SelectTrigger>
              <SelectContent>
                {BOARDS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? 'Saving...' : 'Get Started'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
