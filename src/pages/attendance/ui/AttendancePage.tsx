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
    <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-md px-3 py-2 mb-5">
      <Calendar size={13} className="text-gray-400" />
      <span className="capitalize">{formatFullDate(today)}</span>
    </div>
  )
}

// ─── Group card skeleton ──────────────────────────────────────────────────────

function GroupSelectorSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-2/3 h-4 rounded" />
              <Skeleton className="w-1/2 h-3 rounded" />
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
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 text-gray-400 mb-4">
          <BookOpen size={22} />
        </div>
        <p className="text-sm font-medium text-gray-700">Ma'lumot yuklanmadi</p>
        <p className="text-sm text-gray-500 mt-1">Sahifani yangilab ko'ring.</p>
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 text-gray-400 mb-4">
          <Users size={22} />
        </div>
        <p className="text-sm font-medium text-gray-700">Guruhlar topilmadi</p>
        <p className="text-sm text-gray-500 mt-1">Sizga hali biror guruh biriktirilmagan.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {groups.map((group) => (
        <Card
          key={group.id}
          onClick={() => onSelect(group)}
          className={cn('cursor-pointer transition-colors hover:bg-gray-50')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 text-gray-600 shrink-0">
                <BookOpen size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{group.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {group.schedule.days.join(', ')} · {group.schedule.time}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline">{group.studentCount} o'q</Badge>
                <ChevronRight size={14} className="text-gray-400" />
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
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1.5 text-gray-600 -ml-2"
        >
          <ArrowLeft size={13} />
          Guruhlar
        </Button>
        <span className="text-gray-300 text-sm">/</span>
        <div>
          <span className="text-sm font-semibold text-gray-900">{group.name}</span>
          <span className="text-xs text-gray-500 ml-2">· {group.studentCount} o'quvchi</span>
        </div>
        <div className="ml-auto inline-flex items-center gap-2 text-xs border border-amber-200 bg-amber-50 rounded-md px-2.5 py-1.5">
          <Calendar size={11} className="text-amber-600" />
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
