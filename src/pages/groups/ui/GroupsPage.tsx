import { useQuery }    from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Users, Clock, ArrowRight, BookOpen } from 'lucide-react'
import { fetchGroups }      from '@/entities/group/model/api'
import { groupDetailsPath } from '@/shared/config/routes'
import { useAuth }          from '@/app/providers/AuthProvider'
import { DashboardLayout }  from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header }           from '@/widgets/header/ui/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge }            from '@/components/ui/badge'
import { Skeleton }         from '@/components/ui/skeleton'
import { cn }               from '@/lib/utils'

// ─── Skeletons ────────────────────────────────────────────────────────────────

function GroupCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="w-9 h-9 rounded-md" />
        <Skeleton className="w-20 h-5 rounded" />
      </div>
      <Skeleton className="w-3/4 h-4 rounded" />
      <div className="space-y-2">
        <Skeleton className="w-full h-3 rounded" />
        <Skeleton className="w-2/3 h-3 rounded" />
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyGroups({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 text-gray-400 mb-4">
        <Users size={22} />
      </div>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className="text-sm text-gray-500 mt-1 max-w-xs">{description}</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Card
              key={group.id}
              onClick={() => navigate(groupDetailsPath(group.id))}
              className={cn(
                'cursor-pointer transition-colors',
                'hover:bg-gray-50',
              )}
            >
              <CardContent className="p-5">
                {/* Top row */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 text-gray-600 shrink-0">
                    <BookOpen size={17} />
                  </div>
                  <Badge variant="outline">
                    {group.price.toLocaleString()} so'm
                  </Badge>
                </div>

                {/* Name */}
                <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                  {group.name}
                </h3>

                {/* Description */}
                {group.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {group.description}
                  </p>
                )}

                {/* Teacher */}
                <p className="text-xs text-gray-500 mb-3">
                  {group.teacher.firstName} {group.teacher.lastName}
                </p>

                {/* Schedule */}
                <div className="flex flex-col gap-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users size={11} className="shrink-0 text-gray-400" />
                    <span>{group.schedule.days.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={11} className="shrink-0 text-gray-400" />
                    <span>{group.schedule.time}</span>
                  </div>
                </div>

                {/* CTA row */}
                <div className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors pt-3 border-t border-gray-100">
                  Batafsil ko'rish
                  <ArrowRight size={12} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
