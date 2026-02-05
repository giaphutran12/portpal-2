import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface BadgeCardProps {
  level: number
  name: string
  minXP: number
  isUnlocked: boolean
}

export function BadgeCard({ level, name, minXP, isUnlocked }: BadgeCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", !isUnlocked && "opacity-60 bg-muted/50")}>
       {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[1px] z-10">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          Level {level}
          {isUnlocked && <Award className="h-4 w-4 text-yellow-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold mb-1">{name}</div>
        <p className="text-xs text-muted-foreground">Requires {minXP} XP</p>
      </CardContent>
    </Card>
  )
}
