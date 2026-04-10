import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Users, Clock, ArrowRight, BookOpen } from 'lucide-react'
import { fetchGroups } from '@/entities/group/model/api'
import { groupDetailsPath } from '@/shared/config/routes'
import { DashboardLayout } from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header }          from '@/widgets/header/ui/Header'
import { Card }            from '@/shared/ui/Card'
import { Badge }           from '@/shared/ui/Badge'
import { CardSkeleton }    from '@/shared/ui/Skeleton'
import { EmptyState }      from '@/shared/ui/EmptyState'

export function GroupsPage() {
  const navigate = useNavigate()
  const { data: groups = [], isLoading, isError } = useQuery({
    queryKey: ['groups'],
    queryFn:  fetchGroups,
  })

  return (
    <DashboardLayout>
      <Header title="Guruhlar" subtitle="Sizga biriktirilgan guruhlar ro'yxati" />

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {isError && (
        <EmptyState
          icon={<BookOpen size={48} />}
          title="Ma'lumot yuklanmadi"
          description="Sahifani yangilab ko'ring yoki administratorga murojaat qiling."
        />
      )}

      {!isLoading && !isError && groups.length === 0 && (
        <EmptyState
          icon={<Users size={48} />}
          title="Guruhlar topilmadi"
          description="Sizga hali biror guruh biriktirilmagan."
        />
      )}

      {!isLoading && !isError && groups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Card
              key={group.id}
              hover
              padding="md"
              onClick={() => navigate(groupDetailsPath(group.id))}
            >
              {/* Card top */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brown-50 text-brown-600 shrink-0">
                  <BookOpen size={18} />
                </div>
                <Badge variant="default">{group.studentCount} o'quvchi</Badge>
              </div>

              {/* Name */}
              <h3 className="text-sm font-semibold text-brown-900 mb-3 leading-snug">
                {group.name}
              </h3>

              {/* Schedule */}
              <div className="flex flex-col gap-1.5 mb-5">
                <div className="flex items-center gap-2 text-xs text-brown-500">
                  <Users size={13} className="shrink-0" />
                  <span>{group.schedule.days.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-brown-500">
                  <Clock size={13} className="shrink-0" />
                  <span>{group.schedule.time}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1 text-xs font-medium text-brown-700 group-hover:text-brown-900 transition-colors">
                Batafsil ko'rish
                <ArrowRight size={13} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
