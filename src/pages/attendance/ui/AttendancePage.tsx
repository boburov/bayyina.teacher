import { useEffect, useState } from 'react'
import { useSearchParams }     from 'react-router-dom'
import { useQuery }            from '@tanstack/react-query'
import { Calendar, BookOpen, Users, ChevronRight, ArrowLeft } from 'lucide-react'
import { fetchGroups }         from '@/entities/group/model/api'
import type { Group }          from '@/entities/group/model/types'
import { DashboardLayout }     from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header }              from '@/widgets/header/ui/Header'
import { Card, CardContent }   from '@/components/ui/card'
import { Badge }               from '@/components/ui/badge'
import { Button }              from '@/components/ui/button'
import { Skeleton }            from '@/components/ui/skeleton'
import { AttendanceTable }     from '@/features/attendance/attendance-table/ui/AttendanceTable'
import { formatFullDate, getLocalDateString } from '@/shared/lib/dates'
import { cn }                  from '@/lib/utils'

// ─── Date strip ───────────────────────────────────────────────────────────────

function DateStrip() {
  const today = getLocalDateString()
  return (
    <div className="inline-flex items-center gap-2 text-sm text-brown-500 bg-white border border-brown-100 rounded-xl px-4 py-2.5 shadow-soft mb-6">
      <Calendar size={14} className="text-brown-400" />
      <span className="capitalize">{formatFullDate(today)}</span>
    </div>
  )
}

// ─── Group card skeleton ──────────────────────────────────────────────────────

function GroupSelectorSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-brown-100 shadow-soft p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="w-11 h-11 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-2/3 h-4 rounded-lg" />
              <Skeleton className="w-1/2 h-3 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Group selector ───────────────────────────────────────────────────────────

interface GroupSelectorProps {
  groups:    Group[]
  isLoading: boolean
  isError:   boolean
  onSelect:  (group: Group) => void
}

function GroupSelector({ groups, isLoading, isError, onSelect }: GroupSelectorProps) {
  if (isLoading) return <GroupSelectorSkeleton />

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-brown-50 text-brown-300 mb-4">
          <BookOpen size={28} />
        </div>
        <p className="text-base font-medium text-brown-700">Ma'lumot yuklanmadi</p>
        <p className="text-sm text-brown-400 mt-1">Sahifani yangilab ko'ring.</p>
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-brown-50 text-brown-300 mb-4">
          <Users size={28} />
        </div>
        <p className="text-base font-medium text-brown-700">Guruhlar topilmadi</p>
        <p className="text-sm text-brown-400 mt-1">Sizga hali biror guruh biriktirilmagan.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {groups.map((group) => (
        <Card
          key={group.id}
          onClick={() => onSelect(group)}
          className={cn(
            'cursor-pointer transition-all duration-200',
            'hover:shadow-card-hover hover:-translate-y-0.5',
          )}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-brown-50 text-brown-600 shrink-0">
                <BookOpen size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-brown-900 truncate">{group.name}</h3>
                <p className="text-xs text-brown-400 mt-0.5 truncate">
                  {group.schedule.days.join(', ')} · {group.schedule.time}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="default">{group.studentCount} o'q</Badge>
                <ChevronRight size={15} className="text-brown-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ─── Attendance view ──────────────────────────────────────────────────────────

interface AttendanceViewProps {
  group:  Group
  onBack: () => void
}

function AttendanceView({ group, onBack }: AttendanceViewProps) {
  const today = getLocalDateString()

  return (
    <>
      {/* Breadcrumb bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1.5 text-brown-600 -ml-2"
        >
          <ArrowLeft size={14} />
          Guruhlar
        </Button>
        <span className="text-brown-200 text-sm">|</span>
        <div>
          <span className="text-sm font-semibold text-brown-900">{group.name}</span>
          <span className="text-xs text-brown-400 ml-2">· {group.studentCount} o'quvchi</span>
        </div>
        <div className="ml-auto inline-flex items-center gap-2 text-xs bg-amber-50 border border-amber-100 rounded-xl px-3 py-1.5">
          <Calendar size={12} className="text-amber-600" />
          <span className="capitalize font-medium text-amber-700">{formatFullDate(today)}</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <AttendanceTable group={group} />
        </CardContent>
      </Card>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AttendancePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  const { data: groups = [], isLoading, isError } = useQuery({
    queryKey: ['groups'],
    queryFn:  fetchGroups,
  })

  const urlGroupId = searchParams.get('groupId')
  useEffect(() => {
    if (urlGroupId && groups.length > 0 && !selectedGroup) {
      const found = groups.find((g) => g.id === urlGroupId)
      if (found) setSelectedGroup(found)
    }
  }, [urlGroupId, groups, selectedGroup])

  function selectGroup(group: Group) {
    setSelectedGroup(group)
    setSearchParams({ groupId: group.id }, { replace: true })
  }

  function goBack() {
    setSelectedGroup(null)
    setSearchParams({}, { replace: true })
  }

  return (
    <DashboardLayout>
      {selectedGroup ? (
        <>
          <Header title="Davomat" subtitle={`Bugungi davomat — ${selectedGroup.name}`} />
          <AttendanceView group={selectedGroup} onBack={goBack} />
        </>
      ) : (
        <>
          <Header title="Davomat" subtitle="Davomat olish uchun guruhni tanlang" />
          <DateStrip />
          <GroupSelector
            groups={groups}
            isLoading={isLoading}
            isError={isError}
            onSelect={selectGroup}
          />
        </>
      )}
    </DashboardLayout>
  )
}
