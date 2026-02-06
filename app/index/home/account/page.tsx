'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'
import { toast } from 'sonner'

const LOCALS = ['500', '502', 'Other'] as const
const BOARDS = ['A BOARD', 'B BOARD', 'C BOARD', 'T BOARD', '00 BOARD', 'R BOARD', 'UNION'] as const
const THEMES = ['light', 'dark', 'system'] as const

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  ilwu_local: string
  board: string
  theme_preference: string
  subscription_tier: string
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})
  const [originalData, setOriginalData] = useState<Partial<UserProfile>>({})
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (!authUser) {
          router.push('/signin')
          return
        }

        const response = await fetch('/api/user/profile')
        if (!response.ok) {
          const errorData = await response.json()
          toast.error(errorData.error || 'Failed to load profile')
          return
        }

        const profile = await response.json()

        setUser(profile)
        setFormData(profile)
        setOriginalData(profile)
      } catch (error) {
        toast.error('Error loading profile')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDiscard = () => {
    setFormData(originalData)
    toast.info('Changes discarded')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          ilwu_local: formData.ilwu_local,
          board: formData.board,
          theme_preference: formData.theme_preference,
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to save profile')
        return
      }

      const updatedProfile = await response.json()

      setUser(updatedProfile)
      setFormData(updatedProfile)
      setOriginalData(updatedProfile)

      // Apply theme preference
      applyTheme(updatedProfile.theme_preference)

      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Error saving profile')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setChangingPassword(true)
    try {
      const supabase = createClient()
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: passwordForm.currentPassword
      })

      if (signInError) {
        toast.error('Current password is incorrect')
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      })

      if (updateError) {
        toast.error(updateError.message || 'Failed to update password')
        return
      }

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Password updated successfully')
    } catch (error) {
      toast.error('Error changing password')
      console.error(error)
    } finally {
      setChangingPassword(false)
    }
  }

  const applyTheme = (theme: string) => {
    const html = document.documentElement
    if (theme === 'dark') {
      html.classList.add('dark')
    } else if (theme === 'light') {
      html.classList.remove('dark')
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header email={user?.email} firstName={user?.first_name} lastName={user?.last_name} />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Failed to load profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header email={user.email} firstName={user.first_name} lastName={user.last_name} />
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your profile and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your name and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.first_name || ''}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.last_name || ''}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
            </CardContent>
          </Card>

          {/* ILWU Information */}
          <Card>
            <CardHeader>
              <CardTitle>ILWU Information</CardTitle>
              <CardDescription>Your union local and board assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="local">Local</Label>
                  <Select value={formData.ilwu_local || ''} onValueChange={(value) => handleInputChange('ilwu_local', value)}>
                    <SelectTrigger id="local">
                      <SelectValue placeholder="Select local" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCALS.map((local) => (
                        <SelectItem key={local} value={local}>
                          {local}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="board">Board</Label>
                  <Select value={formData.board || ''} onValueChange={(value) => handleInputChange('board', value)}>
                    <SelectTrigger id="board">
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOARDS.map((board) => (
                        <SelectItem key={board} value={board}>
                          {board}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={formData.theme_preference || 'system'} onValueChange={(value) => handleInputChange('theme_preference', value)}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {THEMES.map((theme) => (
                      <SelectItem key={theme} value={theme}>
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>
              <Button 
                onClick={handlePasswordChange} 
                disabled={changingPassword}
                variant="outline"
                className="w-full"
              >
                {changingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Your current plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold capitalize">{user.subscription_tier || 'Free'} Plan</p>
                  <p className="text-sm text-muted-foreground">Current plan details</p>
                </div>
                <Button variant="outline" disabled>
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={handleDiscard}
              disabled={saving}
            >
              Discard Changes
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
