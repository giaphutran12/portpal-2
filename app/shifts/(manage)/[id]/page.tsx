import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil } from 'lucide-react'
import { DeleteShiftButton } from './delete-button'

interface ShiftDetailPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string; date?: string }>
}

export default async function ShiftDetailPage({ params, searchParams }: ShiftDetailPageProps) {
  const [{ id }, { from, date }] = await Promise.all([params, searchParams])
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  const { data: shift, error } = await supabase
    .from('shifts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !shift) notFound()

  const view = from === 'weekly' || from === 'monthly' || from === 'yearly' ? from : null
  const backDate = date || format(new Date(shift.date), 'yyyy-MM-dd')
  const backHref = view ? `/shifts/${view}?date=${backDate}` : '/shifts/monthly'

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={backHref}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Shift Details</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="capitalize">{shift.entry_type.replace('_', ' ')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Date</div>
                <div className="font-medium">{format(new Date(shift.date), 'EEEE, MMMM d, yyyy')}</div>
              </div>

              {shift.total_pay && shift.total_pay > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground">Total Pay</div>
                  <div className="text-2xl font-bold text-primary">${shift.total_pay.toFixed(2)}</div>
                </div>
              )}
            </div>

            {shift.entry_type === 'worked' && (
              <>
                {shift.job && (
                  <div>
                    <div className="text-sm text-muted-foreground">Job</div>
                    <div className="font-medium">{shift.job}{shift.subjob && ` - ${shift.subjob}`}</div>
                  </div>
                )}
                {shift.location && (
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium">{shift.location}</div>
                  </div>
                )}
                {shift.shift_type && (
                  <div>
                    <div className="text-sm text-muted-foreground">Shift Type</div>
                    <div className="font-medium capitalize">{shift.shift_type}</div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {shift.hours && (
                    <div>
                      <div className="text-sm text-muted-foreground">Hours</div>
                      <div className="font-medium">{shift.hours}h @ ${shift.rate?.toFixed(2)}/hr</div>
                    </div>
                  )}
                  {shift.overtime_hours > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground">Overtime</div>
                      <div className="font-medium">{shift.overtime_hours}h @ ${shift.overtime_rate?.toFixed(2)}/hr</div>
                    </div>
                  )}
                </div>
                {shift.foreman && (
                  <div>
                    <div className="text-sm text-muted-foreground">Foreman</div>
                    <div className="font-medium">{shift.foreman}</div>
                  </div>
                )}
                {shift.vessel && (
                  <div>
                    <div className="text-sm text-muted-foreground">Vessel</div>
                    <div className="font-medium">{shift.vessel}</div>
                  </div>
                )}
              </>
            )}

            {shift.entry_type === 'leave' && (
              <>
                {shift.leave_type && (
                  <div>
                    <div className="text-sm text-muted-foreground">Leave Type</div>
                    <div className="font-medium capitalize">{shift.leave_type.replace('_', ' ')}</div>
                  </div>
                )}
                {shift.hours && (
                  <div>
                    <div className="text-sm text-muted-foreground">Hours</div>
                    <div className="font-medium">{shift.hours}h @ ${shift.rate?.toFixed(2)}/hr</div>
                  </div>
                )}
              </>
            )}

            {shift.entry_type === 'stat_holiday' && (
              <>
                {shift.holiday && (
                  <div>
                    <div className="text-sm text-muted-foreground">Holiday</div>
                    <div className="font-medium">{shift.holiday}</div>
                  </div>
                )}
                {shift.qualifying_days && (
                  <div>
                    <div className="text-sm text-muted-foreground">Qualifying Days</div>
                    <div className="font-medium">{shift.qualifying_days}+ days</div>
                  </div>
                )}
              </>
            )}

            {shift.notes && (
              <div>
                <div className="text-sm text-muted-foreground">Notes</div>
                <div className="font-medium whitespace-pre-wrap">{shift.notes}</div>
              </div>
            )}
          </CardContent>
        </Card>

         <div className="flex gap-3">
           <Button asChild className="flex-1">
             <Link href={`/shifts/${id}/edit?from=${from || ''}&date=${backDate}`}>
               <Pencil className="h-4 w-4 mr-2" />
               Edit
             </Link>
           </Button>
           <DeleteShiftButton shiftId={id} />
         </div>
      </div>
    </div>
  )
}
