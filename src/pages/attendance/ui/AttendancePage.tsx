import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery }        from '@tanstack/react-query'
import { Calendar, BookOpen, Users, ChevronRight, ArrowLeft } from 'lucide-react'
import { fetchGroups }     from '@/entities/group/model/api'
import type { Group }      from '@/entities/group/model/types'
import { DashboardLayout } from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header }          from '@/widgets/header/ui/Header'
import { Card }            from '@/shared/ui/Card'
import { Badge }           from '@/shared/ui/Badge'
import { CardSkeleton }    from '@/shared/ui/Skeleton'
import { EmptyState }      from '@/shared/ui/EmptyState'
import { Button }          from '@/shared/ui/Button'
import { AttendanceTable } from '@/features/attendance/attendance-table/ui/AttendanceTable'
import { formatFullDate, getLocalDateString } from '@/shared/lib/dates'

// ─── Group selector ────────────────────────────────────────────────────────────

interface GroupSelectorProps {
  groups:    Group[]
  isLoading: boolean
  isError:   boolean
  onSelect:  (group: Group) => void
}

function GroupSelector({ groups, isLoading, isError, onSelect }: GroupSelectorProps) {
  const today = getLocalDateString()

  return (
    <>
      {/* Date strip */}
      <div className="flex items-center gap-2 mb-6 text-sm text-brown-500 bg-white border border-brown-100 rounded-xl px-4 py-2.5 shadow-soft w-fit">
        <Calendar size={15} className="text-brown-400" />
        <span className="capitalize">{formatFullDate(today)}</span>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {isError && (
        <EmptyState
          icon={<BookOpen size={48} />}
          title="Ma'lumot yuklanmadi"
          description="Sahifani yangilab ko'ring."
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {groups.map((group) => (
            <Card
              key={group.id}
              hover
              padding="md"
              onClick={() => onSelect(group)}
            >
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
                  <ChevronRight size={16} className="text-brown-300" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

// ─── Attendance view ───────────────────────────────────────────────────────────

interface AttendanceViewProps {
  group:   Group
  onBack:  () => void
}

function AttendanceView({ group, onBack }: AttendanceViewProps) {
  const today = getLocalDateString()

  return (
    <>
      {/* Back + group info bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 text-brown-600">
          <ArrowLeft size={14} />
          Guruhlar
        </Button>
        <div className="h-4 w-px bg-brown-200" />
        <div>
          <span className="text-sm font-semibold text-brown-900">{group.name}</span>
          <span className="text-xs text-brown-400 ml-2">· {group.studentCount} o'quvchi</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-brown-500 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
          <Calendar size={13} className="text-amber-600" />
          <span className="capitalize font-medium text-amber-700">{formatFullDate(today)}</span>
        </div>
      </div>

      {/* Table */}
      <Card padding="md">
        <AttendanceTable group={group} />
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

  // Auto-select group from URL param (e.g. navigated from GroupDetails)
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
          <Header
            title="Davomat"
            subtitle="Davomat olish uchun guruhni tanlang"
          />
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
