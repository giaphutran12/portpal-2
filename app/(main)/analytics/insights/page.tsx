"use client"

import { useState, useEffect, useMemo } from "react"
import { DollarSign, Clock, MapPin, Briefcase, Loader2 } from "lucide-react"
import { StatCard } from "@/components/analytics/StatCard"
import { TimePeriodSelector, PeriodType } from "@/components/analytics/TimePeriodSelector"
import { EarningsChart } from "@/components/analytics/EarningsChart"
import { ShiftsChart } from "@/components/analytics/ShiftsChart"
import { startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears, format } from "date-fns"

interface Shift {
    id: string
    entry_type: string
    date: string
    job?: string | null
    location?: string | null
    hours?: number | null
    overtime_hours?: number | null
    total_pay?: number | null
}

export default function WorkInsightsPage() {
    const [period, setPeriod] = useState<PeriodType>("this-week")
    const [startDate, setStartDate] = useState<Date | undefined>(startOfWeek(new Date()))
    const [endDate, setEndDate] = useState<Date | undefined>(endOfWeek(new Date()))
    const [shifts, setShifts] = useState<Shift[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        
        async function fetchShifts() {
            if (!startDate || !endDate) return
            
            setLoading(true)
            try {
                const params = new URLSearchParams({
                    start: format(startDate, 'yyyy-MM-dd'),
                    end: format(endDate, 'yyyy-MM-dd')
                })
                const res = await fetch(`/api/shifts?${params}`, { signal: controller.signal })
                if (res.ok) {
                    const data = await res.json()
                    setShifts(data)
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Failed to fetch shifts:', error)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchShifts()
        
        return () => controller.abort()
    }, [startDate, endDate])

    const stats = useMemo(() => {
        const totalEarnings = shifts.reduce((sum, s) => sum + (s.total_pay || 0), 0)
        const workedShifts = shifts.filter(s => s.entry_type === 'worked')
        const leaveShifts = shifts.filter(s => s.entry_type === 'leave')
        const earningsWorked = workedShifts.reduce((sum, s) => sum + (s.total_pay || 0), 0)
        const earningsLeave = leaveShifts.reduce((sum, s) => sum + (s.total_pay || 0), 0)
        const totalShifts = shifts.length
        const totalHours = shifts.reduce((sum, s) => sum + (s.hours || 0) + (s.overtime_hours || 0), 0)
        
        const locationCounts = shifts.reduce((acc, s) => {
            if (s.location) {
                acc[s.location] = (acc[s.location] || 0) + 1
            }
            return acc
        }, {} as Record<string, number>)
        
        const locations = Object.keys(locationCounts).length
        const mostFrequent = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

        return { totalEarnings, earningsWorked, earningsLeave, totalShifts, totalHours, locations, mostFrequent }
    }, [shifts])

    const earningsData = useMemo(() => {
        const locationEarnings = shifts.reduce((acc, s) => {
            if (s.location && s.total_pay) {
                acc[s.location] = (acc[s.location] || 0) + s.total_pay
            }
            return acc
        }, {} as Record<string, number>)
        
        return Object.entries(locationEarnings)
            .map(([location, earnings]) => ({ location, earnings }))
            .sort((a, b) => b.earnings - a.earnings)
            .slice(0, 5)
    }, [shifts])

    const shiftsData = useMemo(() => {
        const typeCounts = shifts.reduce((acc, s) => {
            acc[s.entry_type] = (acc[s.entry_type] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        const colors: Record<string, string> = {
            worked: "#2563eb",
            leave: "#16a34a",
            vacation: "#ca8a04",
            standby: "#9333ea",
            stat_holiday: "#dc2626",
            day_off: "#6b7280"
        }

        return Object.entries(typeCounts).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
            value,
            color: colors[name] || "#6b7280"
        }))
    }, [shifts])

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
                setStartDate={(date) => {
                    setStartDate(date)
                    if (period !== 'custom') setPeriod('custom')
                }}
                endDate={endDate}
                setEndDate={(date) => {
                    setEndDate(date)
                    if (period !== 'custom') setPeriod('custom')
                }}
            />

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <>
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
                </>
            )}
        </div>
    )
}
