import { useState }              from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Bell, ChevronLeft, ChevronRight,
  MessageSquare, Send, User,
} from 'lucide-react'
import { fetchNotifications, postFeedback } from '@/entities/notification/model/api'
import type { Notification }               from '@/entities/notification/model/types'
import { useAuth }                         from '@/app/providers/AuthProvider'
import { DashboardLayout }                 from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header }                          from '@/widgets/header/ui/Header'
import { useToast }                        from '@/shared/lib/toast'
import { cn }                              from '@/lib/utils'

// ─── Static maps ──────────────────────────────────────────────────────────────

const typeLabel: Record<string, string> = {
  complaint:  'Shikoyat',
  suggestion: 'Taklif',
  info:       "Ma'lumot",
  request:    "So'rov",
}

const statusCls: Record<string, string> = {
  open:        'bg-amber-50 text-amber-700 border border-amber-200',
  in_progress: 'bg-blue-50 text-blue-700 border border-blue-200',
  resolved:    'bg-green-50 text-green-700 border border-green-200',
  closed:      'bg-gray-100 text-gray-500 border border-gray-200',
  pending:     'bg-gray-100 text-gray-500 border border-gray-200',
}

const statusText: Record<string, string> = {
  open:        'Ochiq',
  in_progress: 'Jarayonda',
  resolved:    'Hal qilindi',
  closed:      'Yopiq',
  pending:     'Kutilmoqda',
}

const PAGE_LIMIT = 15

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupName(n: Notification): string {
  if (!n.group) return '—'
  if (typeof n.group === 'string') return '—'
  return n.group.name
}

function senderName(n: Notification): string {
  if (!n.sender) return '—'
  if (typeof n.sender === 'string') return '—'
  return `${n.sender.firstName} ${n.sender.lastName}`.trim()
}

function fmtDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('uz-UZ', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric',
  })
}

function fmtTime(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// ─── Detail panel ─────────────────────────────────────────────────────────────

interface DetailProps {
  notification: Notification
  token:        string
  onClose:      () => void
}

function DetailPanel({ notification: n, token, onClose }: DetailProps) {
  const [text, setText]   = useState('')
  const toast             = useToast()
  const queryClient       = useQueryClient()

  const { mutate: sendFeedback, isPending } = useMutation({
    mutationFn: () => postFeedback(n._id, { message: text.trim() }, token),
    onSuccess: () => {
      toast.success('Javob yuborildi')
      setText('')
      queryClient.invalidateQueries({ queryKey: ['teacher-notifications'] })
    },
    onError: () => toast.error('Xatolik yuz berdi'),
  })

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    sendFeedback()
  }

  const st   = n.status
  const type = typeLabel[n.type] ?? n.type

  return (
    <div className="flex flex-col h-full border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-200">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400">{type}</span>
            <span className="text-gray-300">·</span>
            <span className={cn('text-xs px-2 py-0.5 font-medium', statusCls[st] ?? statusCls.pending)}>
              {statusText[st] ?? st}
            </span>
          </div>
          <h2 className="text-sm font-semibold text-gray-900 leading-snug">{n.title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {groupName(n)} · {senderName(n)} · {fmtDate(n.createdAt)} {fmtTime(n.createdAt)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
          aria-label="Yopish"
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Message body */}
      <div className="px-5 py-4 border-b border-gray-200">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{n.message}</p>
      </div>

      {/* Feedback thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Fikr-mulohazalar ({n.feedback?.length ?? 0})
        </p>

        {(n.feedback ?? []).length === 0 ? (
          <p className="text-sm text-gray-400">Hali javob yo'q</p>
        ) : (
          (n.feedback ?? []).map((fb) => (
            <div key={fb._id} className="border border-gray-200 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <User size={12} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-600 capitalize">{fb.role}</span>
                <span className="text-xs text-gray-400 ml-auto">{fmtDate(fb.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-700">{fb.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Feedback input */}
      <form onSubmit={handleSend} className="px-5 py-4 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-600 mb-2">Javob yozish</p>
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Javobingizni kiriting..."
            className="flex-1 px-3 py-2 rounded-sm border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-brown-800 transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={isPending || !text.trim()}
            className="flex items-center justify-center w-9 h-9 self-end bg-brown-800 text-white hover:bg-brown-900 transition-colors disabled:opacity-40"
            aria-label="Yuborish"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function NotificationsPage() {
  const { token }                       = useAuth()
  const [page, setPage]                 = useState(1)
  const [selected, setSelected]         = useState<Notification | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['teacher-notifications', page],
    queryFn:  () => fetchNotifications(token!, { page, limit: PAGE_LIMIT }),
    enabled:  !!token,
    keepPreviousData: true,
  })

  const notifications = data?.notifications ?? []
  const totalPages    = data?.totalPages    ?? 1
  const hasNext       = data?.hasNextPage   ?? false
  const hasPrev       = data?.hasPrevPage   ?? false

  return (
    <DashboardLayout>
      <Header title="Xabarnomalar" subtitle="O'quvchilardan kelgan xabarlar va shikoyatlar" />

      <div className={cn('flex gap-4', selected ? 'items-start' : '')}>

        {/* ── List ── */}
        <div className={cn('flex-1 min-w-0', selected && 'lg:max-w-[52%]')}>

          {/* Loading */}
          {isLoading && (
            <div className="border border-gray-200 bg-white divide-y divide-gray-100">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-4 py-4 animate-pulse space-y-2">
                  <div className="w-1/2 h-3 bg-gray-100" />
                  <div className="w-3/4 h-4 bg-gray-100" />
                  <div className="w-1/4 h-3 bg-gray-100" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <div className="border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-600">
              Ma'lumotlarni yuklashda xatolik yuz berdi
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && notifications.length === 0 && (
            <div className="border border-gray-200 bg-white flex flex-col items-center py-16 gap-2 text-gray-400">
              <Bell size={28} strokeWidth={1.5} className="opacity-30" />
              <p className="text-sm">Xabarnomalar yo'q</p>
            </div>
          )}

          {/* Rows */}
          {!isLoading && !isError && notifications.length > 0 && (
            <div className="border border-gray-200 bg-white divide-y divide-gray-100">
              {notifications.map((n) => {
                const isActive = selected?._id === n._id
                const st       = n.status
                return (
                  <button
                    key={n._id}
                    onClick={() => setSelected(isActive ? null : n)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 transition-colors',
                      isActive
                        ? 'bg-brown-50 border-l-2 border-l-brown-800'
                        : 'hover:bg-gray-50 border-l-2 border-l-transparent',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs text-gray-400">{typeLabel[n.type] ?? n.type}</span>
                      <div className="flex items-center gap-2">
                        <span className={cn('text-[10px] px-1.5 py-0.5 font-medium', statusCls[st] ?? statusCls.pending)}>
                          {statusText[st] ?? st}
                        </span>
                        {(n.feedback?.length ?? 0) > 0 && (
                          <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                            <MessageSquare size={10} />
                            {n.feedback.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {groupName(n)} · {fmtDate(n.createdAt)}
                    </p>
                  </button>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
              <span>{page}/{totalPages}-sahifa</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!hasPrev}
                  className="flex items-center justify-center w-7 h-7 border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={13} />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext}
                  className="flex items-center justify-center w-7 h-7 border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Detail panel ── */}
        {selected && (
          <div className="hidden lg:block flex-1 min-w-0 sticky top-6" style={{ maxHeight: 'calc(100vh - 10rem)' }}>
            <DetailPanel
              notification={selected}
              token={token!}
              onClose={() => setSelected(null)}
            />
          </div>
        )}
      </div>

      {/* Mobile detail sheet */}
      {selected && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <DetailPanel
            notification={selected}
            token={token!}
            onClose={() => setSelected(null)}
          />
        </div>
      )}
    </DashboardLayout>
  )
}
