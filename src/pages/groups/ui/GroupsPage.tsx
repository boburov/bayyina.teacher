import { useQuery }      from '@tanstack/react-query'
import { useNavigate }  from 'react-router-dom'
import { Users, Clock, ArrowRight, BookOpen } from 'lucide-react'
import { fetchGroups }      from '@/entities/group/model/api'
import { groupDetailsPath } from '@/shared/config/routes'
import { useAuth }          from '@/app/providers/AuthProvider'
import { DashboardLayout }  from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header }           from '@/widgets/header/ui/Header'
import { EmptyState }       from '@/components/ui/empty-state'
import { CardSkeleton }     from '@/shared/ui/Skeleton'
import { cn }               from '@/lib/utils'

export function GroupsPage() {
  const navigate  = useNavigate()
  const { token } = useAuth()

  const { data: groups = [], isLoading, isError } = useQuery({
    queryKey: ['groups'],
    queryFn:  () => fetchGroups(),
    enabled:  !!token,
  })

  return (
    <DashboardLayout>
      <Header title="Guruhlar" subtitle="Sizga biriktirilgan guruhlar ro'yxati" />

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {isError && (
        <EmptyState
          icon={<Users size={32} />}
          title="Ma'lumot yuklanmadi"
          description="Sahifani yangilab ko'ring yoki administratorga murojaat qiling."
        />
      )}

      {!isLoading && !isError && groups.length === 0 && (
        <EmptyState
          icon={<Users size={32} />}
          title="Guruhlar topilmadi"
          description="Sizga hali biror guruh biriktirilmagan."
        />
      )}

      {!isLoading && !isError && groups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => navigate(groupDetailsPath(group.id))}
              className={cn(
                'bg-white border border-gray-200 p-4 cursor-pointer transition-colors hover:bg-gray-50',
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-500 shrink-0">
                  <BookOpen size={15} />
                </div>
                <span className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 font-medium">
                  {group.price.toLocaleString()} so'm
                </span>
              </div>

              <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                {group.name}
              </h3>

              {group.description && (
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {group.description}
                </p>
              )}

              <p className="text-xs text-gray-400 mb-2">
                {group.teacher.firstName} {group.teacher.lastName}
              </p>

              <div className="flex flex-col gap-1 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Users size={10} className="shrink-0 text-gray-400" />
                  <span>{group.schedule.days.join(', ')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock size={10} className="shrink-0 text-gray-400" />
                  <span>{group.schedule.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-brown-800 transition-colors pt-3 border-t border-gray-100">
                Batafsil ko'rish
                <ArrowRight size={11} />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
