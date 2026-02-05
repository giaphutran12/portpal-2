import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award } from "lucide-react"

interface LevelDisplayProps {
  currentLevel: number
  levelName: string
  currentXP: number
  requiredXP: number
  progressPercentage: number
}

export function LevelDisplay({ currentLevel, levelName, currentXP, requiredXP, progressPercentage }: LevelDisplayProps) {
  return (
    <Card className="w-full">
        <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-12 w-12 text-primary" />
                </div>
                <div className="flex-1 w-full text-center md:text-left">
                    <div className="mb-1 text-sm font-medium text-muted-foreground">Level {currentLevel}</div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">{levelName}</h2>
                    <div className="space-y-2">
                         <div className="flex justify-between text-sm">
                             <span>{currentXP} XP</span>
                             <span className="text-muted-foreground">Target: {requiredXP} XP</span>
                         </div>
                         <Progress value={progressPercentage} className="h-2" />
                         <div className="text-right text-xs text-muted-foreground">{progressPercentage}% Complete</div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}
