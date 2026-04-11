import { useParams, useNavigate } from 'react-router-dom'
import { useQuery }               from '@tanstack/react-query'
import { Phone, CalendarCheck, Users, Clock, Loader2 } from 'lucide-react'
import { fetchGroupById } from '@/entities/group/model/api'
import { ROUTES }         from '@/shared/config/routes'
import { DashboardLayout }  from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header }           from '@/widgets/header/ui/Header'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge }            from '@/components/ui/badge'
import { Button }           from '@/components/ui/button'
import { Skeleton }         from '@/components/ui/skeleton'
import { Separator }        from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// ─── Info stat card ───────────────────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="px-5 py-4">
        <div className="flex items-center gap-2 text-brown-400 mb-1.5">
          {icon}
          <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-sm font-semibold text-brown-900">{value}</p>
      </CardContent>
    </Card>
  )
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function TableSkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent">
          <TableCell><Skeleton className="w-5 h-4" /></TableCell>
          <TableCell>
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="w-32 h-4" />
            </div>
          </TableCell>
          <TableCell className="hidden sm:table-cell"><Skeleton className="w-36 h-4" /></TableCell>
          <TableCell className="hidden sm:table-cell"><Skeleton className="w-14 h-6 rounded-full" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function GroupDetailsPage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: group, isLoading, isError } = useQuery({
    queryKey: ['group', id],
    queryFn:  () => fetchGroupById(id!),
    enabled:  !!id,
  })

  function goToAttendance() {
    navigate(`${ROUTES.ATTENDANCE}?groupId=${group!.id}`)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-brown-400" />
        </div>
      </DashboardLayout>
    )
  }

  if (isError || !group) {
    return (
      <DashboardLayout>
        <Header title="Guruh topilmadi" backPath={ROUTES.GROUPS} />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-brown-50 text-brown-300 mb-4">
            <Users size={28} />
          </div>
          <p className="text-base font-medium text-brown-700">Bunday guruh mavjud emas</p>
          <p className="text-sm text-brown-400 mt-1">URL to'g'ri ekanligini tekshiring.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Header
        title={group.name}
        subtitle={`${group.studentCount} o'quvchi`}
        backPath={ROUTES.GROUPS}
        action={
          <Button onClick={goToAttendance} size="default" className="gap-2">
            <CalendarCheck size={15} />
            Davomatga o'tish
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="O'quvchilar"
          value={`${group.studentCount} nafar`}
          icon={<Users size={15} />}
        />
        <StatCard
          label="Dars kunlari"
          value={group.schedule.days.join(', ')}
          icon={<Clock size={15} />}
        />
        <StatCard
          label="Dars vaqti"
          value={group.schedule.time}
          icon={<Clock size={15} />}
        />
      </div>

      {/* Students table card */}
      <Card className="overflow-hidden">
        <CardHeader className="px-6 py-4 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">O'quvchilar ro'yxati</CardTitle>
            <Badge variant="outline">{group.studentCount} nafar</Badge>
          </div>
        </CardHeader>

        <Separator className="mt-4" />

        <Table>
          <TableHeader>
            <TableRow className="bg-brown-50/60 hover:bg-brown-50/60">
              <TableHead className="w-12 pl-6">#</TableHead>
              <TableHead>Ism Familiya</TableHead>
              <TableHead className="hidden sm:table-cell">Telefon</TableHead>
              <TableHead className="hidden sm:table-cell">Holat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonRows />
            ) : (
              group.students.map((student, idx) => (
                <TableRow key={student.id}>
                  <TableCell className="pl-6 text-brown-400 text-xs font-mono">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm">
                        <AvatarFallback initials={student.name.charAt(0)} />
                      </Avatar>
                      <span className="font-medium text-brown-900">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {student.phone ? (
                      <span className="flex items-center gap-1.5 text-brown-600 font-mono text-xs">
                        <Phone size={12} />
                        {student.phone}
                      </span>
                    ) : (
                      <span className="text-brown-300 text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="success">Faol</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer CTA */}
        <Separator />
        <div className="px-6 py-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={goToAttendance} className="gap-1.5">
            <CalendarCheck size={14} />
            Davomatni boshqarish
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  )
}
