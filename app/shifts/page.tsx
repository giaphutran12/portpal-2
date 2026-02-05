import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'

export default async function ShiftsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  const { data: shifts } = await supabase
    .from('shifts')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">My Shifts</h1>
        <Button asChild size="sm">
          <Link href="/shifts/add">
            <Plus className="h-4 w-4 mr-1" />
            Add Shift
          </Link>
        </Button>
      </div>

      <div className="p-4 space-y-3">
        {shifts && shifts.length > 0 ? (
          shifts.map((shift) => (
            <Card key={shift.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium capitalize">{shift.entry_type.replace('_', ' ')}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(shift.date), 'PPP')}
                    </div>
                    {shift.job && (
                      <div className="text-sm">
                        {shift.job} {shift.subjob && `- ${shift.subjob}`}
                      </div>
                    )}
                    {shift.location && (
                      <div className="text-sm text-muted-foreground">{shift.location}</div>
                    )}
                    {shift.holiday && (
                      <div className="text-sm">{shift.holiday}</div>
                    )}
                    {shift.notes && (
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {shift.notes}
                      </div>
                    )}
                  </div>
                  {shift.total_pay && shift.total_pay > 0 && (
                    <div className="text-lg font-bold shrink-0">${shift.total_pay.toFixed(2)}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No shifts logged yet</p>
            <Button asChild className="mt-4">
              <Link href="/shifts/add">Add your first shift</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
