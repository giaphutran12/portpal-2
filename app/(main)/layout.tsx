import { BottomNav } from '@/components/layout/BottomNav'

export const dynamic = 'force-dynamic'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-20">
      {children}
      <BottomNav />
    </div>
  )
}
