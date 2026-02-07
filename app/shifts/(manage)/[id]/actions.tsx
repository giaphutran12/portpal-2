'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2, Pencil } from 'lucide-react'
import { toast } from 'sonner'

interface ShiftActionsProps {
  id: string
}

export function ShiftActions({ id }: ShiftActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/shifts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete shift')
      }

      toast.success('Shift deleted successfully')
      router.push('/shifts/monthly')
      router.refresh()
    } catch (error) {
      console.error('Error deleting shift:', error)
      toast.error('Failed to delete shift')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href={`/shifts/${id}/edit`}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={isDeleting}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this shift entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
