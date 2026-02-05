import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WeekProgressProps {
    shiftsLogged: number
    earnings: number
}

export function WeekProgress({ shiftsLogged, earnings }: WeekProgressProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>This Week's Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <div className="text-sm font-medium text-muted-foreground">Shifts Logged</div>
                         <div className="text-2xl font-bold">{shiftsLogged}</div>
                    </div>
                    <div>
                         <div className="text-sm font-medium text-muted-foreground">Earned</div>
                         <div className="text-2xl font-bold">${earnings.toFixed(2)}</div>
                    </div>
                </div>
                <div className="rounded-lg bg-primary/5 p-4 text-sm text-primary">
                    Keep logging shifts to earn more XP and unlock badges!
                </div>
            </CardContent>
        </Card>
    )
}
