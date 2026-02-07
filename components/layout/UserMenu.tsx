'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface UserMenuProps {
  email?: string
  firstName?: string
  lastName?: string
}

export function UserMenu({ email, firstName, lastName }: UserMenuProps) {
  const router = useRouter()
  const [showAbout, setShowAbout] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const getInitial = () => {
    if (firstName) return firstName.charAt(0).toUpperCase()
    if (email) return email.charAt(0).toUpperCase()
    return 'U'
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      toast.error('Failed to log out')
      setIsLoggingOut(false)
      return
    }
    
    toast.success('Logged out successfully')
    router.push('/signin')
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 flex items-center justify-center"
          >
            <span className="text-sm font-semibold">{getInitial()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {email && (
            <>
              <div className="px-2 py-1.5 text-sm">
                <p className="font-semibold">{firstName && lastName ? `${firstName} ${lastName}` : 'User'}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => router.push('/home/account')}>
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/home/feedback')}>
            Contact
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowAbout(true)}>
            About Us
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut} className="text-red-600">
            {isLoggingOut ? 'Logging out...' : 'Log out'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showAbout} onOpenChange={setShowAbout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About PortPal</DialogTitle>
            <DialogDescription>
              Shift tracking for ILWU longshoremen
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              PortPal is a modern shift tracking application designed specifically for ILWU (International Longshore and Warehouse Union) longshoremen.
            </p>
            <p className="text-sm text-muted-foreground">
              Track your shifts, manage your schedule, and stay organized with our intuitive interface.
            </p>
            <p className="text-xs text-muted-foreground">
              Version 1.0.0
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
