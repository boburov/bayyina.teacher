import { useState } from 'react'
import { useQuery }  from '@tanstack/react-query'
import { Trophy, RefreshCw } from 'lucide-react'
import { fetchDerStats } from '@/entities/attendance/model/api'
import { fetchGroups }   from '@/entities/group/model/api'
import type { Group }    from '@/entities/group/model/types'
import type { DerStudentStat } from '@/entities/attendance/model/types'
import { DashboardLayout } from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header }          from '@/widgets/header/ui/Header'
import { Card }            from '@/components/ui/card'
import { Button }          from '@/components/ui/button'
import { Skeleton }        from '@/components/ui/skeleton'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

function defaultFrom(): string {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return toDateStr(d)
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-amber-500 font-bold text-sm">🥇 1</span>
  if (rank === 2) return <span className="text-gray-400 font-bold text-sm">🥈 2</span>
  if (rank === 3) return <span className="text-amber-700 font-bold text-sm">🥉 3</span>
  return <span className="text-gray-500 text-sm font-mono">{rank}</span>
}

function GradeDisplay({ avg }: { avg: number | null }) {
  if (avg == null) return <span className="text-gray-300 text-xs">—</span>
  const color =
    avg >= 4.5 ? 'text-emerald-600' :
    avg >= 3.5 ? 'text-blue-600' :
    avg >= 2.5 ? 'text-amber-600' :
    'text-rose-600'
  return (
    <span className={cn('text-sm font-bold', color)}>
      {avg.toFixed(1)}
    </span>
  )
}

export function DerStatsPage() {
  const today    = toDateStr(new Date())
  const [from,   setFrom]          = useState(defaultFrom)
  const [to,     setTo]            = useState(today)
  const [groupId, setGroupId]      = useState('')
  const [applied, setApplied]      = useState({ from: defaultFrom(), to: today, groupId: '' })

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn:  () => fetchGroups(),
  })

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['der-stats', applied],
    queryFn:  () => fetchDerStats({
      group: applied.groupId || undefined,
      from:  applied.from,
      to:    applied.to,
    }),
  })

  const stats = data?.stats ?? []

  return (
    <DashboardLayout>
      <Header title="Baho Reytingi" subtitle="Kundalik davomat va baho statistikasi" />

      {/* Filters */}
      <Card className="p-4 flex flex-wrap items-end gap-3 mb-4">
        <div className="flex flex-col gap-1 min-w-[130px]">
          <label className="text-xs font-medium text-gray-500">Guruh</label>
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="h-9 px-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-brown-800"
          >
            <option value="">Barcha guruhlar</option>
            {(groups ?? []).map((g: Group) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Dan</label>
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => setFrom(e.target.value)}
            className="h-9 px-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brown-800"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Gacha</label>
          <input
            type="date"
            value={to}
            min={from}
            max={today}
            onChange={(e) => setTo(e.target.value)}
            className="h-9 px-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brown-800"
          />
        </div>

        <Button
          onClick={() => setApplied({ from, to, groupId })}
          className="h-9"
        >
          Ko'rish
        </Button>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-12 pl-6">O'rin</TableHead>
              <TableHead>O'quvchi</TableHead>
              <TableHead className="hidden sm:table-cell">Guruh</TableHead>
              <TableHead>Davomat</TableHead>
              <TableHead>O'rtacha baho</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell><Skeleton className="w-6 h-4" /></TableCell>
                  <TableCell><Skeleton className="w-32 h-4" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="w-24 h-4" /></TableCell>
                  <TableCell><Skeleton className="w-20 h-4" /></TableCell>
                  <TableCell><Skeleton className="w-16 h-4" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12">
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    <p className="text-sm font-medium">Ma'lumotlar yuklanmadi</p>
                    <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
                      <RefreshCw size={13} />
                      Qayta yuklash
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : stats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Trophy size={24} />
                    <p className="text-sm">Bu davr uchun ma'lumot yo'q</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              stats.map((s: DerStudentStat) => {
                const name = `${s.student.firstName} ${s.student.lastName}`
                const attendancePct = s.totalSessions > 0
                  ? Math.round((s.totalPresent / s.totalSessions) * 100)
                  : 0
                return (
                  <TableRow
                    key={`${s.student._id}_${s.group?._id}`}
                    className={cn(s.rankGlobal <= 3 && 'bg-amber-50/40')}
                  >
                    <TableCell className="pl-6">
                      <RankBadge rank={s.rankGlobal} />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold shrink-0">
                          {name.charAt(0)}
                        </span>
                        <span className="font-medium text-gray-900 text-sm">{name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="hidden sm:table-cell text-gray-500 text-sm">
                      {s.group?.name ?? '—'}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-gray-800">
                          {s.totalPresent}/{s.totalSessions}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                attendancePct >= 80 ? 'bg-emerald-400' : attendancePct >= 50 ? 'bg-amber-400' : 'bg-rose-400',
                              )}
                              style={{ width: `${attendancePct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{attendancePct}%</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <GradeDisplay avg={s.avgGrade} />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </DashboardLayout>
  )
}
