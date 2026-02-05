'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Post {
  id: string
  title: string
  content: string
  published_at: string
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [expanded, setExpanded] = useState(false)

  const preview = post.content.length > 100 
    ? post.content.substring(0, 100) + '...' 
    : post.content

  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{post.title}</CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground mb-4">
          {expanded ? post.content : preview}
        </p>
        {post.content.length > 100 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Read less' : 'Read more'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
