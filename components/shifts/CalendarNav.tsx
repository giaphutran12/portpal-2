'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarNavProps {
  onPrev: () => void
  onNext: () => void
  label: string
  prevDisabled?: boolean
  nextDisabled?: boolean
}

export function CalendarNav({
  onPrev,
  onNext,
  label,
  prevDisabled = false,
  nextDisabled = false,
}: CalendarNavProps) {
  return (
    <div className="flex items-center justify-between bg-card border rounded-lg p-2 w-full max-w-sm mx-auto mb-6 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrev}
        disabled={prevDisabled}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous</span>
      </Button>
      
      <span className="font-semibold text-lg">{label}</span>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={nextDisabled}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next</span>
      </Button>
    </div>
  )
}
