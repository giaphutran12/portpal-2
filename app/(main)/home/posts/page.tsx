import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PostCard } from '@/components/posts/PostCard'
import { fetchAllRows } from '@/lib/supabase/pagination'

export default async function PostsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  const posts = await fetchAllRows<any>(
    supabase
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-center">Posts Archive</h1>
      </div>
      <div className="max-w-2xl mx-auto p-4">
        {posts && posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No posts available</p>
        )}
      </div>
    </div>
  )
}
