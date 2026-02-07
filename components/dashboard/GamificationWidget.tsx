import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, Star, Trophy } from "lucide-react"

interface GamificationWidgetProps {
  streak: number
  points: number
  xp: number
}

export function GamificationWidget({ streak, points, xp }: GamificationWidgetProps) {
  return (
    <Link href="/analytics/journey" className="block mb-6">
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 hover:shadow-md transition-all cursor-pointer border-slate-200">
        <CardContent className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
            <span className="font-semibold text-sm sm:text-base">{streak} Day Streak</span>
          </div>
          
          <div className="h-6 w-px bg-border mx-2" />
          
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-sm sm:text-base">Points - {points}</span>
          </div>
          
          <div className="h-6 w-px bg-border mx-2" />
          
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-sm sm:text-base">XP {xp}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
