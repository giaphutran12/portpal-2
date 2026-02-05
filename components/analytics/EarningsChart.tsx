"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface EarningsChartProps {
    data: { location: string; earnings: number }[]
}

export function EarningsChart({ data }: EarningsChartProps) {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Earnings by Location</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={data} margin={{ left: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="location" width={100} tick={{fontSize: 12}} />
                            <Tooltip 
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Earnings']}
                            />
                            <Bar dataKey="earnings" radius={[0, 4, 4, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
