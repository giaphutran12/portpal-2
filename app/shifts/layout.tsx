import { BottomNav } from '@/components/layout/BottomNav'

export default function ShiftsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-20">
      {children}
      <BottomNav />
    </div>
  )
}
