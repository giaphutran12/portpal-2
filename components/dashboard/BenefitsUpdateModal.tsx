"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export interface BenefitsData {
  validityStart: Date
  validityEnd: Date
  totalAvailable: number
}

interface BenefitsUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  initialData: BenefitsData
  onSave: (data: BenefitsData) => void
}

export function BenefitsUpdateModal({ isOpen, onClose, title, initialData, onSave }: BenefitsUpdateModalProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(initialData.validityStart)
  const [endDate, setEndDate] = useState<Date | undefined>(initialData.validityEnd)
  const [total, setTotal] = useState(initialData.totalAvailable.toString())

  useEffect(() => {
    if (isOpen) {
      setStartDate(initialData.validityStart)
      setEndDate(initialData.validityEnd)
      setTotal(initialData.totalAvailable.toString())
    }
  }, [isOpen, initialData])

  const handleSave = () => {
    if (startDate && endDate && total) {
      onSave({
        validityStart: startDate,
        validityEnd: endDate,
        totalAvailable: parseInt(total) || 0
      })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Validity Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label>Validity End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="total">Total Available Days</Label>
            <Input
              id="total"
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
