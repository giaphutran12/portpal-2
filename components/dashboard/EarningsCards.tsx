import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export interface PeriodData {
  range: string
  earnings: number
  shifts: number
  hours: number
  totalShifts?: number
  pension?: number
  pensionPercentage?: number
}

interface EarningsCardsProps {
  thisWeek: PeriodData
  lastWeek: PeriodData
  thisYear: PeriodData
}

export function EarningsCards({ thisWeek, lastWeek, thisYear }: EarningsCardsProps) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            This Week
          </CardTitle>
          <div className="text-xs text-muted-foreground">{thisWeek.range}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{formatCurrency(thisWeek.earnings)}</div>
          <div className="flex justify-between text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Shifts</span>
              <span className="font-medium">{thisWeek.shifts}{thisWeek.totalShifts ? `/${thisWeek.totalShifts}` : ''}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-muted-foreground text-xs">Hours</span>
              <span className="font-medium">{thisWeek.hours}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Last Week
          </CardTitle>
          <div className="text-xs text-muted-foreground">{lastWeek.range}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{formatCurrency(lastWeek.earnings)}</div>
          <div className="flex justify-between text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Shifts</span>
              <span className="font-medium">{lastWeek.shifts}{lastWeek.totalShifts ? `/${lastWeek.totalShifts}` : ''}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-muted-foreground text-xs">Hours</span>
              <span className="font-medium">{lastWeek.hours}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-50 border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            This Year (Fiscal)
          </CardTitle>
          <div className="text-xs text-slate-400">{thisYear.range}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2 text-slate-900">{formatCurrency(thisYear.earnings)}</div>
          <div className="flex justify-between text-sm mb-3">
            <div className="flex flex-col">
              <span className="text-slate-500 text-xs">Shifts</span>
              <span className="font-medium text-slate-700">{thisYear.shifts}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-slate-500 text-xs">Hours</span>
              <span className="font-medium text-slate-700">{thisYear.hours}</span>
            </div>
          </div>
          
          {thisYear.pension !== undefined && (
            <>
              <Separator className="my-2" />
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-medium text-slate-600">Pension</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800">{formatCurrency(thisYear.pension)}</span>
                  {thisYear.pensionPercentage && (
                    <span className="text-xs text-slate-400 ml-1">({thisYear.pensionPercentage}%)</span>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
