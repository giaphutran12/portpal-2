"use client"

import { useState } from "react"
import { DollarSign, Clock, MapPin, Briefcase } from "lucide-react"
import { StatCard } from "@/components/analytics/StatCard"
import { TimePeriodSelector, PeriodType } from "@/components/analytics/TimePeriodSelector"
import { EarningsChart } from "@/components/analytics/EarningsChart"
import { ShiftsChart } from "@/components/analytics/ShiftsChart"
import { startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears } from "date-fns"

export default function WorkInsightsPage() {
    const [period, setPeriod] = useState<PeriodType>("this-week")
    const [startDate, setStartDate] = useState<Date | undefined>(startOfWeek(new Date()))
    const [endDate, setEndDate] = useState<Date | undefined>(endOfWeek(new Date()))

    const stats = {
        totalEarnings: 1250.50,
        earningsWorked: 1000.00,
        earningsLeave: 250.50,
        totalShifts: 5,
        totalHours: 40,
        locations: 3,
        mostFrequent: "PCT"
    }

    const earningsData = [
        { location: "PCT", earnings: 600 },
        { location: "Pier 400", earnings: 400 },
        { location: "YTI", earnings: 250.50 },
    ]

    const shiftsData = [
        { name: "Worked", value: 4, color: "#2563eb" },
        { name: "Leave", value: 1, color: "#16a34a" },
        { name: "Vacation", value: 0, color: "#ca8a04" },
    ]

    const handlePeriodChange = (newPeriod: PeriodType) => {
        setPeriod(newPeriod)
        const now = new Date()
        switch (newPeriod) {
            case "this-week":
                setStartDate(startOfWeek(now))
                setEndDate(endOfWeek(now))
                break
            case "this-month":
                setStartDate(startOfMonth(now))
                setEndDate(endOfMonth(now))
                break
            case "this-year":
                setStartDate(startOfYear(now))
                setEndDate(endOfYear(now))
                break
            case "last-week":
                const lastWeek = subWeeks(now, 1)
                setStartDate(startOfWeek(lastWeek))
                setEndDate(endOfWeek(lastWeek))
                break
            case "last-month":
                const lastMonth = subMonths(now, 1)
                setStartDate(startOfMonth(lastMonth))
                setEndDate(endOfMonth(lastMonth))
                break
            case "last-year":
                const lastYear = subYears(now, 1)
                setStartDate(startOfYear(lastYear))
                setEndDate(endOfYear(lastYear))
                break
            case "custom":
                break
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Work Insights</h1>
                <p className="text-muted-foreground">Track your earnings and shift patterns.</p>
            </div>

            <TimePeriodSelector 
                period={period} 
                setPeriod={handlePeriodChange}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="Total Earnings" 
                    value={`$${stats.totalEarnings.toFixed(2)}`} 
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard 
                    title="Earnings Split" 
                    value={`$${stats.earningsWorked.toFixed(0)} + $${stats.earningsLeave.toFixed(0)}`}
                    subtext="Worked + Leave"
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard 
                    title="Total Shifts" 
                    value={stats.totalShifts}
                    icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard 
                    title="Total Hours" 
                    value={stats.totalHours}
                    icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard 
                    title="Locations" 
                    value={stats.locations}
                    subtext="Unique terminals"
                    icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard 
                    title="Most Frequent" 
                    value={stats.mostFrequent}
                    icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <EarningsChart data={earningsData} />
                <ShiftsChart data={shiftsData} />
            </div>
        </div>
    )
}
