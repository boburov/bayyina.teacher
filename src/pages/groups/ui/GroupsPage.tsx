import { useQuery }   from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Users, Clock, ArrowRight, BookOpen } from 'lucide-react'
import { fetchGroups }     from '@/entities/group/model/api'
import { groupDetailsPath } from '@/shared/config/routes'
import { DashboardLayout } from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header }          from '@/widgets/header/ui/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge }           from '@/components/ui/badge'
import { Skeleton }        from '@/components/ui/skeleton'
import { cn }              from '@/lib/utils'

// ─── Skeletons ────────────────────────────────────────────────────────────────

function GroupCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-brown-100 shadow-soft p-6 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-4 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="w-full h-3 rounded-lg" />
        <Skeleton className="w-2/3 h-3 rounded-lg" />
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyGroups({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-brown-50 text-brown-300 mb-4">
        <Users size={28} />
      </div>
      <p className="text-base font-medium text-brown-700">{title}</p>
      <p className="text-sm text-brown-400 mt-1 max-w-xs">{description}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function GroupsPage() {
  const navigate = useNavigate()
  const { data: groups = [], isLoading, isError } = useQuery({
    queryKey: ['groups'],
    queryFn:  fetchGroups,
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
                'cursor-pointer transition-all duration-200',
                'hover:shadow-card-hover hover:-translate-y-0.5',
              )}
            >
              <CardContent className="p-6">
                {/* Top row */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-brown-50 text-brown-600 shrink-0">
                    <BookOpen size={20} />
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
                    <Users size={12} className="shrink-0 text-brown-400" />
                    <span>{group.schedule.days.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-brown-500">
                    <Clock size={12} className="shrink-0 text-brown-400" />
                    <span>{group.schedule.time}</span>
                  </div>
                </div>

                {/* CTA row */}
                <div className="flex items-center gap-1 text-xs font-medium text-brown-600 hover:text-brown-900 transition-colors">
                  Batafsil ko'rish
                  <ArrowRight size={13} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
