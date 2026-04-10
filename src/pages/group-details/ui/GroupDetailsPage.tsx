import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Phone, User, CalendarCheck, Users, Clock } from 'lucide-react'
import { fetchGroupById } from '@/entities/group/model/api'
import { ROUTES }         from '@/shared/config/routes'
import { DashboardLayout }  from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header }           from '@/widgets/header/ui/Header'
import { Card }             from '@/shared/ui/Card'
import { Badge }            from '@/shared/ui/Badge'
import { Button }           from '@/shared/ui/Button'
import { TableRowSkeleton } from '@/shared/ui/Skeleton'
import { EmptyState }       from '@/shared/ui/EmptyState'
import { PageSpinner }      from '@/shared/ui/Spinner'

export function GroupDetailsPage() {
  const { id }    = useParams<{ id: string }>()
  const navigate  = useNavigate()

  const { data: group, isLoading, isError } = useQuery({
    queryKey: ['group', id],
    queryFn:  () => fetchGroupById(id!),
    enabled:  !!id,
  })

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageSpinner />
      </DashboardLayout>
    )
  }

  if (isError || !group) {
    return (
      <DashboardLayout>
        <Header title="Guruh topilmadi" backPath={ROUTES.GROUPS} />
        <EmptyState
          icon={<Users size={48} />}
          title="Bunday guruh mavjud emas"
          description="URL to'g'ri ekanligini tekshiring."
        />
      </DashboardLayout>
    )
  }

  function goToAttendance() {
    navigate(`${ROUTES.ATTENDANCE}?groupId=${group!.id}`)
  }

  return (
    <DashboardLayout>
      <Header
        title={group.name}
        subtitle={`${group.studentCount} o'quvchi`}
        backPath={ROUTES.GROUPS}
        action={
          <Button onClick={goToAttendance} size="md" className="gap-2">
            <CalendarCheck size={15} />
            Davomatga o'tish
          </Button>
        }
      />

      {/* Info stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <InfoCard
          label="O'quvchilar soni"
          value={`${group.studentCount} nafar`}
          icon={<Users size={16} />}
        />
        <InfoCard
          label="Dars kunlari"
          value={group.schedule.days.join(', ')}
          icon={<Clock size={16} />}
        />
        <InfoCard
          label="Dars vaqti"
          value={group.schedule.time}
          icon={<Clock size={16} />}
        />
      </div>

      {/* Students table */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-brown-50">
          <h2 className="text-sm font-semibold text-brown-900">
            O'quvchilar ro'yxati
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brown-50 bg-brown-50/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-brown-400 uppercase tracking-wider w-10">
                  #
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-400 uppercase tracking-wider">
                  Ism Familiya
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-400 uppercase tracking-wider hidden sm:table-cell">
                  Telefon
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-400 uppercase tracking-wider hidden sm:table-cell">
                  Holat
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} cols={4} />
                  ))
                : group.students.map((student, idx) => (
                    <tr
                      key={student.id}
                      className="border-b border-brown-50 last:border-0 hover:bg-brown-50/50 transition-colors"
                    >
                      <td className="px-6 py-3.5 text-brown-400 text-sm">{idx + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-brown-100 text-brown-600 text-xs font-semibold shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-medium text-brown-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        {student.phone ? (
                          <span className="flex items-center gap-1.5 text-brown-600 font-mono text-xs">
                            <Phone size={12} />
                            {student.phone}
                          </span>
                        ) : (
                          <span className="text-brown-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <Badge variant="success">Faol</Badge>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Floating CTA at the bottom */}
        <div className="px-6 py-4 border-t border-brown-50 flex justify-end">
          <Button variant="secondary" size="sm" onClick={goToAttendance} className="gap-1.5">
            <CalendarCheck size={14} />
            Davomatni boshqarish
          </Button>
        </div>
      </Card>

      {/* Info helper */}
      <div className="mt-4 flex items-start gap-2.5 px-1">
        <User size={14} className="text-brown-300 mt-0.5 shrink-0" />
        <p className="text-xs text-brown-400 leading-relaxed">
          Davomat olish uchun yuqoridagi "Davomatga o'tish" tugmasini bosing yoki
          chap menudagi <strong className="text-brown-600">Davomat</strong> bo'limiga o'ting.
        </p>
      </div>
    </DashboardLayout>
  )
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-brown-100 shadow-soft px-5 py-4">
      <div className="flex items-center gap-2 text-brown-400 mb-1.5">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold text-brown-900">{value}</p>
    </div>
  )
}
