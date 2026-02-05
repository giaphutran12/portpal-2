import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function validationErrorResponse(error: ZodError) {
  const messages = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`)
  return NextResponse.json(
    { error: 'Validation failed', details: messages },
    { status: 400 }
  )
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function notFoundResponse(resource = 'Resource') {
  return NextResponse.json({ error: `${resource} not found` }, { status: 404 })
}

export function serverErrorResponse(error: unknown) {
  console.error('Server error:', error)
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}
