'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Plus, BarChart3, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/index/home/dashboard', icon: Home, label: 'Home' },
  { href: '/index/shifts/weekly', icon: Calendar, label: 'Shifts' },
  { href: '/shifts/add', icon: Plus, label: 'Add', isCenter: true },
  { href: '/index/analytics/insights', icon: BarChart3, label: 'Analytics' },
  { href: '/index/home/account', icon: User, label: 'Account' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href.split('/').slice(0, 3).join('/'))
          const Icon = item.icon

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <span className="text-xs mt-1 font-medium text-primary">
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
