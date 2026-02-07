import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FeedbackForm } from '@/components/feedback/FeedbackForm'

export default async function FeedbackPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-center">Share Your Feedback</h1>
      </div>
      <div className="max-w-2xl mx-auto p-4">
        <FeedbackForm userId={user.id} />
      </div>
    </div>
  )
}
