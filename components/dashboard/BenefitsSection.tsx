"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BenefitsUpdateModal, BenefitsData } from "./BenefitsUpdateModal"

export interface BenefitState {
  total: number
  used: number
  validityStart: Date
  validityEnd: Date
}

interface BenefitsSectionProps {
  sickLeave: BenefitState
  personalLeave: BenefitState
  onUpdateSickLeave: (data: BenefitsData) => void
  onUpdatePersonalLeave: (data: BenefitsData) => void
}

export function BenefitsSection({ 
  sickLeave, 
  personalLeave, 
  onUpdateSickLeave, 
  onUpdatePersonalLeave 
}: BenefitsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"sick" | "personal">("sick")

  const openModal = (type: "sick" | "personal") => {
    setModalType(type)
    setModalOpen(true)
  }

  const handleSave = (data: BenefitsData) => {
    if (modalType === "sick") {
      onUpdateSickLeave(data)
    } else {
      onUpdatePersonalLeave(data)
    }
  }

  const renderBenefitCard = (title: string, data: BenefitState, type: "sick" | "personal") => {
    const remaining = data.total - data.used
    const percentage = Math.min(100, Math.max(0, (data.used / data.total) * 100))
    
    return (
      <div className="bg-white rounded-lg border p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 h-auto p-0 hover:text-blue-800 font-normal"
            onClick={() => openModal(type)}
          >
            Update
          </Button>
        </div>

        <div className="flex justify-between text-sm mb-2 text-slate-500">
          <div className="text-center">
            <div className="font-bold text-slate-900 text-lg">{data.total}</div>
            <div className="text-xs">Available</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-slate-900 text-lg">{data.used}</div>
            <div className="text-xs">Used</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-slate-900 text-lg">{remaining}</div>
            <div className="text-xs">Remaining</div>
          </div>
        </div>

        <Progress value={percentage} className="h-2 mb-2" />
        
        <div className="text-xs text-slate-400 text-right">
          {percentage.toFixed(0)}% used
        </div>
      </div>
    )
  }

  const currentData = modalType === "sick" 
    ? { validityStart: sickLeave.validityStart, validityEnd: sickLeave.validityEnd, totalAvailable: sickLeave.total }
    : { validityStart: personalLeave.validityStart, validityEnd: personalLeave.validityEnd, totalAvailable: personalLeave.total }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Benefits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderBenefitCard("Sick Days", sickLeave, "sick")}
        {renderBenefitCard("Personal Leave", personalLeave, "personal")}
      </div>

      <BenefitsUpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalType === "sick" ? "Update Sick Leave" : "Update Personal Leave"}
        initialData={currentData}
        onSave={handleSave}
      />
    </div>
  )
}
