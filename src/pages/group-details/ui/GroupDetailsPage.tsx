import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Phone, CalendarCheck, Users, Clock, Loader2 } from 'lucide-react'
import { fetchGroupById } from '@/entities/group/model/api'
import { fetchEnrollmentsByGroup } from '@/entities/enrollment/model/api'
import { useAuth } from '@/app/providers/AuthProvider'
import { ROUTES } from '@/shared/config/routes'
import { DashboardLayout } from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header } from '@/widgets/header/ui/Header'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// ─── Info stat card ────────────────────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="px-5 py-4">
        <div className="flex items-center gap-2 text-gray-400 mb-1.5">
          {icon}
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</span>
        </div>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  )
}

// ─── Skeleton rows ─────────────────────────────────────────────────────────────

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
          <TableCell className="hidden sm:table-cell"><Skeleton className="w-14 h-5 rounded" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export function GroupDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuth()

  const { data: group, isLoading: groupLoading, isError: groupError } = useQuery({
    queryKey: ['groups', id],
    queryFn: () => fetchGroupById(id!, token!),
    enabled: !!id && !!token,
  })

  const {
    data: enrollments = [],
    isLoading: enrollmentsLoading,
    isError: enrollmentsError,
  } = useQuery({
    queryKey: ['enrollments', id],
    queryFn: () => fetchEnrollmentsByGroup(id!, token!),
    enabled: !!id && !!token,
  })

  const isLoading = groupLoading || enrollmentsLoading

  function goToAttendance() {
    navigate(`${ROUTES.ATTENDANCE}?groupId=${id}`)
  }

  if (groupLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    )
  }

  if (groupError || !group) {
    return (
      <DashboardLayout>
        <Header title="Guruh topilmadi" backPath={ROUTES.GROUPS} />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 text-gray-400 mb-4">
            <Users size={22} />
          </div>
          <p className="text-sm font-medium text-gray-700">Bunday guruh mavjud emas</p>
          <p className="text-sm text-gray-500 mt-1">URL to'g'ri ekanligini tekshiring.</p>
        </div>
      </DashboardLayout>
    )
  }

  const studentCount = enrollments.length

  return (
    <DashboardLayout>
      <Header
        title={group.name}
        subtitle={`${studentCount} o'quvchi`}
        backPath={ROUTES.GROUPS}
        action={
          <Button onClick={goToAttendance} size="default" className="gap-2">
            <CalendarCheck size={14} />
            Davomatga o'tish
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="O'quvchilar"
          value={`${studentCount} nafar`}
          icon={<Users size={14} />}
        />
        <StatCard
          label="Dars kunlari"
          value={group.schedule.days.join(', ')}
          icon={<Clock size={14} />}
        />
        <StatCard
          label="Dars vaqti"
          value={group.schedule.time}
          icon={<Clock size={14} />}
        />
      </div>

      {/* Students table card */}
      <Card className="overflow-hidden">
        <CardHeader className="px-6 py-4 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900">O'quvchilar ro'yxati</CardTitle>
            {!enrollmentsLoading && (
              <Badge variant="outline">{studentCount} nafar</Badge>
            )}
          </div>
        </CardHeader>

        <Separator className="mt-4" />

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-12 pl-6">#</TableHead>
              <TableHead>Ism Familiya</TableHead>
              <TableHead className="hidden sm:table-cell">Telefon</TableHead>
              <TableHead className="hidden sm:table-cell">Holat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonRows />
            ) : enrollmentsError ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-gray-500 py-8">
                  O'quvchilar yuklanmadi
                </TableCell>
              </TableRow>
            ) : enrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-gray-500 py-8">
                  Hali o'quvchi yo'q
                </TableCell>
              </TableRow>
            ) : (
              enrollments.map((enrollment, idx) => {
                const s = enrollment.student
                const name = `${s.firstName} ${s.lastName}`
                const phone = String(s.phone)

                return (
                  <TableRow key={enrollment._id}>
                    <TableCell className="pl-6 text-gray-400 text-xs font-mono">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar size="sm">
                          <AvatarFallback initials={s.firstName.charAt(0)} />
                        </Avatar>
                        <span className="font-medium text-gray-900">{name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="flex items-center gap-1.5 text-gray-600 font-mono text-xs">
                        <Phone size={11} />
                        {phone}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={enrollment.status === 'active' ? 'success' : 'outline'}>
                        {enrollment.status === 'active' ? 'Faol' : enrollment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* Footer CTA */}
        <Separator />
        <div className="px-6 py-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={goToAttendance} className="gap-1.5">
            <CalendarCheck size={13} />
            Davomatni boshqarish
          </Button>
        </div>
      </Card>

    </DashboardLayout>
  )
}
