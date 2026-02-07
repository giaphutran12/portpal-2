'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface FeedbackFormProps {
  userId?: string
}

export function FeedbackForm({ userId }: FeedbackFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [ilwuLocal, setIlwuLocal] = useState('')
  const [comments, setComments] = useState('')
  const [anonymous, setAnonymous] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!comments.trim()) {
      toast.error('Please enter your feedback')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from('feedback').insert({
      user_id: anonymous ? null : userId,
      ilwu_local: ilwuLocal || null,
      content: comments,
      is_anonymous: anonymous,
    })

    if (error) {
      toast.error('Failed to submit feedback: ' + error.message)
      setLoading(false)
      return
    }

    toast.success('Thank you for your feedback!')
    setLoading(false)
    router.push('/home/account')
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Share Your Feedback</CardTitle>
        <CardDescription>Help us improve PortPal with your thoughts and suggestions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ilwu-local">ILWU Local</Label>
            <Input
              id="ilwu-local"
              placeholder="e.g 500, 502, etc..."
              value={ilwuLocal}
              onChange={(e) => setIlwuLocal(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments/Feedback *</Label>
            <Textarea
              id="comments"
              placeholder="Tell us what you think..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Upload Images (optional)</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              disabled
            />
            <p className="text-xs text-muted-foreground">Image upload coming soon</p>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
            <Label htmlFor="anonymous" className="cursor-pointer">
              Share anonymously
            </Label>
            <Switch
              id="anonymous"
              checked={anonymous}
              onCheckedChange={setAnonymous}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
