import { useState }     from 'react'
import { useQuery }      from '@tanstack/react-query'
import { Wallet, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchSalaries } from '@/entities/salary/model/api'
import type { Salary, SalaryGroup } from '@/entities/salary/model/types'
import { useAuth }           from '@/app/providers/AuthProvider'
import { DashboardLayout }   from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header }            from '@/widgets/header/ui/Header'
import { cn, formatMoney }  from '@/lib/utils'

function monthLabel(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' })
}

// Returns YYYY-MM-01 for a given year+month offset
function monthValue(offsetFromNow = 0): string {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() + offsetFromNow)
  return d.toISOString().slice(0, 7) + '-01'
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <tr className="animate-pulse border-t border-gray-100">
      <td className="px-4 py-3"><div className="h-4 w-28 bg-gray-100 rounded-sm" /></td>
      <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-100 rounded-sm" /></td>
      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-4 w-16 bg-gray-100 rounded-sm" /></td>
      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-4 w-16 bg-gray-100 rounded-sm" /></td>
      <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-100 rounded-sm" /></td>
      <td className="px-4 py-3"><div className="h-5 w-14 bg-gray-100 rounded-sm" /></td>
    </tr>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const paid = status === 'paid'
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium',
        paid
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-amber-50 text-amber-700 border border-amber-200',
      )}
    >
      {paid ? 'To\'langan' : 'Kutilmoqda'}
    </span>
  )
}

// ─── Detail drawer ────────────────────────────────────────────────────────────

function SalaryDetail({ salary, onClose }: { salary: Salary; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white w-full sm:max-w-lg mx-auto sm:mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <p className="text-sm font-semibold text-gray-900">{monthLabel(salary.month)}</p>
            <p className="text-xs text-gray-400">Oylik tafsiloti</p>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors px-2 py-1"
          >
            Yopish
          </button>
        </div>

        {/* Groups breakdown */}
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Guruhlar bo'yicha
          </p>
          <div className="space-y-2">
            {salary.groups.map((g: SalaryGroup, i: number) => (
              <div key={i} className="flex items-start justify-between gap-2 py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{g.groupName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {g.salaryType === 'percentage'
                      ? `${g.salaryValue}%`
                      : g.salaryType === 'fixed'
                      ? 'Belgilangan'
                      : `${formatMoney(g.salaryValue)} / talaba`}
                    {g.minSalary > 0 && ` · min ${formatMoney(g.minSalary)}`}
                    {' · '}{g.paidStudentsCount}/{g.studentCount} talaba
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 shrink-0">{formatMoney(g.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="px-5 py-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Jami hisoblangan</span>
            <span className="font-medium">{formatMoney(salary.totalAmount)}</span>
          </div>
          {salary.bonus > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Bonus</span>
              <span className="font-medium">+{formatMoney(salary.bonus)}</span>
            </div>
          )}
          {salary.deduction > 0 && (
            <div className="flex justify-between text-sm text-red-500">
              <span>Jarima</span>
              <span className="font-medium">-{formatMoney(salary.deduction)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-semibold text-gray-900 pt-2 border-t border-gray-100">
            <span>Sof to'lov</span>
            <span>{formatMoney(salary.netAmount)}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-gray-400">Holat</span>
            <StatusBadge status={salary.status} />
          </div>
          {salary.paidAt && (
            <div className="flex justify-between text-xs text-gray-400">
              <span>To'langan sana</span>
              <span>{new Date(salary.paidAt).toLocaleDateString('uz-UZ')}</span>
            </div>
          )}
          {salary.note && (
            <div className="mt-2 p-3 bg-gray-50 text-xs text-gray-500 border border-gray-100">
              {salary.note}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SalariesPage() {
  const { token }  = useAuth()
  const [monthOffset, setMonthOffset] = useState(0)
  const [page, setPage]               = useState(1)
  const [selected, setSelected]       = useState<Salary | null>(null)

  const month = monthValue(monthOffset)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['salaries', month, page],
    queryFn:  () => fetchSalaries({ month, page, limit: 20 }),
    enabled:  !!token,
  })

  const salaries   = data?.salaries ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <DashboardLayout>
      <Header title="Oylik maosh" subtitle="Oyma-oy maoshingizni kuzating" />

      {/* Month navigation */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => { setMonthOffset(o => o - 1); setPage(1) }}
          className="flex items-center justify-center w-7 h-7 border border-gray-200 hover:bg-gray-50 transition-colors"
          aria-label="Oldingi oy"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-medium text-gray-800 min-w-[120px] text-center capitalize">
          {new Date(month).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' })}
        </span>
        <button
          onClick={() => { setMonthOffset(o => o + 1); setPage(1) }}
          disabled={monthOffset >= 0}
          className="flex items-center justify-center w-7 h-7 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Keyingi oy"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Oy</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Hisoblangan</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Bonus</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Jarima</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Sof to'lov</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Holat</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} />)}

            {!isLoading && !isError && salaries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-400">
                      <Wallet size={18} />
                    </div>
                    <p className="text-sm text-gray-500">Bu oy uchun maosh ma'lumoti yo'q</p>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && isError && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                  Ma'lumot yuklanmadi. Sahifani yangilab ko'ring.
                </td>
              </tr>
            )}

            {!isLoading && !isError && salaries.map((salary) => (
              <tr
                key={salary._id}
                onClick={() => setSelected(salary)}
                className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-800 capitalize">
                  {monthLabel(salary.month)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{formatMoney(salary.totalAmount)}</td>
                <td className="px-4 py-3 text-right text-green-600 hidden sm:table-cell">
                  {salary.bonus > 0 ? `+${formatMoney(salary.bonus)}` : '—'}
                </td>
                <td className="px-4 py-3 text-right text-red-500 hidden sm:table-cell">
                  {salary.deduction > 0 ? `-${formatMoney(salary.deduction)}` : '—'}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatMoney(salary.netAmount)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={salary.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-400">
            {page} / {totalPages} sahifa
          </p>
          <div className="flex gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="flex items-center justify-center w-7 h-7 border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="flex items-center justify-center w-7 h-7 border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <SalaryDetail salary={selected} onClose={() => setSelected(null)} />
      )}
    </DashboardLayout>
  )
}
