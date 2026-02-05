"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pencil, Check, X } from "lucide-react"

interface YearlyGoalWidgetProps {
  currentEarnings: number
  initialGoal?: number
}

export function YearlyGoalWidget({ currentEarnings, initialGoal = 120000 }: YearlyGoalWidgetProps) {
  const [goal, setGoal] = useState(initialGoal)
  const [isEditing, setIsEditing] = useState(false)
  const [tempGoal, setTempGoal] = useState(initialGoal.toString())

  const progressPercentage = Math.min(100, Math.max(0, (currentEarnings / goal) * 100))

  const handleSave = () => {
    const newGoal = parseFloat(tempGoal)
    if (!isNaN(newGoal) && newGoal > 0) {
      setGoal(newGoal)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setTempGoal(goal.toString())
    setIsEditing(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="mb-8 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-slate-800">Yearly Goal</h2>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={tempGoal}
              onChange={(e) => setTempGoal(e.target.value)}
              className="w-32 h-8 text-right"
            />
            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 px-2 py-1 rounded-md transition-colors"
            onClick={() => setIsEditing(true)}
          >
            <span className="font-medium text-slate-900">{formatCurrency(goal)}</span>
            <Pencil className="h-3 w-3 text-slate-400" />
          </div>
        )}
      </div>

      <Progress value={progressPercentage} className="h-3 bg-slate-100" />
      
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>{formatCurrency(currentEarnings)} earned</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
    </div>
  )
}
