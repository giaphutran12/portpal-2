import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { ilwu_local, comments, anonymous } = body

    if (!comments || !comments.trim()) {
      return NextResponse.json(
        { error: 'Comments are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id: anonymous ? null : user.id,
        ilwu_local: ilwu_local || null,
        content: comments,
        is_anonymous: anonymous,
      })
      .select()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
