import { useQuery }    from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Users, Clock, ArrowRight, BookOpen } from 'lucide-react'
import { fetchGroups }      from '@/entities/group/model/api'
import { groupDetailsPath } from '@/shared/config/routes'
import { useAuth }          from '@/app/providers/AuthProvider'
import { DashboardLayout }  from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header }           from '@/widgets/header/ui/Header'
import { cn }               from '@/lib/utils'

// ─── Skeletons ────────────────────────────────────────────────────────────────

function GroupCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 p-4 space-y-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-8 h-8 bg-gray-100" />
        <div className="w-20 h-5 bg-gray-100 rounded-sm" />
      </div>
      <div className="w-3/4 h-4 bg-gray-100 rounded-sm" />
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-gray-100 rounded-sm" />
        <div className="w-2/3 h-3 bg-gray-100 rounded-sm" />
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyGroups({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-gray-200 bg-white">
      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-400 mb-3">
        <Users size={18} />
      </div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-xs text-gray-400 mt-1 max-w-xs">{description}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function GroupsPage() {
  const navigate    = useNavigate()
  const { token }   = useAuth()

  const { data: groups = [], isLoading, isError } = useQuery({
    queryKey: ['groups'],
    queryFn:  () => fetchGroups(token!),
    enabled:  !!token,
  })

  return (
    <DashboardLayout>
      <Header title="Guruhlar" subtitle="Sizga biriktirilgan guruhlar ro'yxati" />

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => <GroupCardSkeleton key={i} />)}
        </div>
      )}

      {/* Error */}
      {isError && (
        <EmptyGroups
          title="Ma'lumot yuklanmadi"
          description="Sahifani yangilab ko'ring yoki administratorga murojaat qiling."
        />
      )}

      {/* No groups */}
      {!isLoading && !isError && groups.length === 0 && (
        <EmptyGroups
          title="Guruhlar topilmadi"
          description="Sizga hali biror guruh biriktirilmagan."
        />
      )}

      {/* Groups grid */}
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
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-500 shrink-0">
                  <BookOpen size={15} />
                </div>
                <span className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 font-medium">
                  {group.price.toLocaleString()} so'm
                </span>
              </div>

              {/* Name */}
              <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                {group.name}
              </h3>

              {/* Description */}
              {group.description && (
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {group.description}
                </p>
              )}

              {/* Teacher */}
              <p className="text-xs text-gray-400 mb-2">
                {group.teacher.firstName} {group.teacher.lastName}
              </p>

              {/* Schedule */}
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

              {/* CTA */}
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
