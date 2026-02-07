'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp, resetPassword, signInWithGoogle, signInWithFacebook } from '@/lib/supabase/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const LOCALS = ['500', '502'] as const
const BOARDS = ['A BOARD', 'B BOARD', 'C BOARD', 'T BOARD', '00 BOARD', 'R BOARD', 'UNION'] as const

export default function SignInPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setDebugInfo(null)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('[AUTH] Attempting sign in for:', email)

    try {
      const { data, error } = await signIn(email, password)
      
      console.log('[AUTH] Sign in response:', { data, error })
      
      if (error) {
        console.error('[AUTH] Sign in error:', error)
        toast.error(error.message || 'Sign in failed')
        setDebugInfo(`Error: ${error.message}`)
        setLoading(false)
        return
      }

      if (!data?.user) {
        console.error('[AUTH] No user returned after sign in')
        toast.error('Sign in failed - no user returned')
        setDebugInfo('Error: No user returned')
        setLoading(false)
        return
      }

      console.log('[AUTH] Sign in successful, redirecting...')
      toast.success('Signed in successfully!')
      router.push('/home/dashboard')
      router.refresh()
    } catch (err) {
      console.error('[AUTH] Unexpected error during sign in:', err)
      const message = err instanceof Error ? err.message : 'Unexpected error'
      toast.error(message)
      setDebugInfo(`Exception: ${message}`)
      setLoading(false)
    }
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setDebugInfo(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const ilwuLocal = formData.get('local') as string
    const board = formData.get('board') as string

    console.log('[AUTH] Attempting sign up for:', email, { firstName, lastName, ilwuLocal, board })

    if (!ilwuLocal || !board) {
      toast.error('Please select your Local and Board')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await signUp(email, password, {
        firstName,
        lastName,
        ilwuLocal,
        board,
      })

      console.log('[AUTH] Sign up response:', { data, error })

      if (error) {
        console.error('[AUTH] Sign up error:', error)
        toast.error(error.message || 'Sign up failed')
        setDebugInfo(`Error: ${error.message}`)
        setLoading(false)
        return
      }

      if (data?.user?.identities?.length === 0) {
        console.log('[AUTH] User already exists')
        toast.error('An account with this email already exists. Please sign in.')
        setDebugInfo('User already exists')
        setLoading(false)
        return
      }

      if (data?.user) {
        console.log('[AUTH] Sign up successful:', data.user.email)
        
        if (data.session) {
          console.log('[AUTH] Session created, redirecting to dashboard')
          toast.success('Account created! Redirecting...')
          router.push('/home/dashboard')
          router.refresh()
        } else {
          console.log('[AUTH] Email confirmation required')
          toast.success('Check your email to confirm your account')
          setDebugInfo('Email confirmation sent')
        }
      } else {
        console.log('[AUTH] No user or error returned')
        toast.info('Check your email to confirm your account')
        setDebugInfo('Awaiting email confirmation')
      }
      
      setLoading(false)
    } catch (err) {
      console.error('[AUTH] Unexpected error during sign up:', err)
      const message = err instanceof Error ? err.message : 'Unexpected error'
      toast.error(message)
      setDebugInfo(`Exception: ${message}`)
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    if (!forgotEmail) {
      toast.error('Please enter your email')
      return
    }

    setLoading(true)
    console.log('[AUTH] Requesting password reset for:', forgotEmail)

    try {
      const { error } = await resetPassword(forgotEmail)
      
      if (error) {
        console.error('[AUTH] Password reset error:', error)
        toast.error(error.message)
        setLoading(false)
        return
      }

      console.log('[AUTH] Password reset email sent')
      toast.success('A password reset link has been sent to your email')
      setShowForgotPassword(false)
      setLoading(false)
    } catch (err) {
      console.error('[AUTH] Unexpected error during password reset:', err)
      const message = err instanceof Error ? err.message : 'Unexpected error'
      toast.error(message)
      setLoading(false)
    }
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter your email to receive a reset link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowForgotPassword(false)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleForgotPassword} disabled={loading} className="flex-1">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">PortPal</CardTitle>
          <CardDescription>Track your shifts, earnings, and more</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" name="email" type="email" required placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-muted-foreground hover:underline w-full text-center"
              >
                Forgot Password?
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => signInWithGoogle()} type="button">
                  Google
                </Button>
                <Button variant="outline" onClick={() => signInWithFacebook()} type="button">
                  Facebook
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" name="email" type="email" required placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" name="password" type="password" required minLength={6} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="local">ILWU Local</Label>
                  <Select name="local" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your local" />
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
                  <Select name="board" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your board" />
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {debugInfo && (
            <div className="mt-4 p-3 bg-muted rounded-md text-sm font-mono">
              <p className="text-muted-foreground">Debug: {debugInfo}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
