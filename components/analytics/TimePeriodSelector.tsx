"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type PeriodType = "this-week" | "this-month" | "this-year" | "last-week" | "last-month" | "last-year" | "custom"

interface TimePeriodSelectorProps {
  period: PeriodType
  setPeriod: (period: PeriodType) => void
  startDate: Date | undefined
  setStartDate: (date: Date | undefined) => void
  endDate: Date | undefined
  setEndDate: (date: Date | undefined) => void
}

export function TimePeriodSelector({
  period,
  setPeriod,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}: TimePeriodSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Select value={period} onValueChange={(value) => setPeriod(value as PeriodType)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="this-week">This Week</SelectItem>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="this-year">This Year</SelectItem>
          <SelectItem value="last-week">Last Week</SelectItem>
          <SelectItem value="last-month">Last Month</SelectItem>
          <SelectItem value="last-year">Last Year</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2 items-center">
        <DatePicker date={startDate} setDate={setStartDate} placeholder="Start Date" />
        <span className="text-muted-foreground">-</span>
        <DatePicker date={endDate} setDate={setEndDate} placeholder="End Date" />
      </div>
    </div>
  )
}

function DatePicker({ date, setDate, placeholder }: { date: Date | undefined, setDate: (d: Date | undefined) => void, placeholder: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[150px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
