'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ShiftsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  
  // Determine current tab value from pathname
  const currentTab = pathname.includes('/monthly') ? 'monthly' :
                     pathname.includes('/yearly') ? 'yearly' : 'weekly'

  return (
    <div className="flex flex-col min-h-screen space-y-6 p-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Shifts Calendar</h1>
      </div>
      
      <Tabs value={currentTab} onValueChange={(val) => router.push(`/index/shifts/${val}`)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
