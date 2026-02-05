'use client'

import { UserMenu } from './UserMenu'

interface HeaderProps {
  email?: string
  firstName?: string
  lastName?: string
}

export function Header({ email, firstName, lastName }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-lg hidden sm:inline">PortPal</span>
        </div>
        
        <UserMenu email={email} firstName={firstName} lastName={lastName} />
      </div>
    </header>
  )
}
