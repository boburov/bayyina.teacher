import { useState }        from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Send, School, CheckCircle2 } from 'lucide-react'
import { fetchGroups, sendGroupMessage } from '@/entities/group/model/api'
import { useAuth }           from '@/app/providers/AuthProvider'
import { DashboardLayout }   from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header }            from '@/widgets/header/ui/Header'
import { useToast }          from '@/shared/lib/toast'
import type { Group }        from '@/entities/group/model/types'

export function SendMessagePage() {
  const { token } = useAuth()
  const toast = useToast()
  const [selected, setSelected]   = useState<Group | null>(null)
  const [message,  setMessage]    = useState('')
  const [lastResult, setLastResult] = useState<{ sent: number; failed: number } | null>(null)

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn:  () => fetchGroups(),
    enabled:  !!token,
    staleTime: 60_000,
  })

  const sendMut = useMutation({
    mutationFn: ({ id, msg }: { id: string; msg: string }) =>
      sendGroupMessage(id, msg),
    onSuccess: (res) => {
      setLastResult(res)
      toast.success(`${res.sent} ta xabar yuborildi`)
      setMessage('')
    },
    onError: (e: Error) => toast.error(e.message || 'Xatolik yuz berdi'),
  })

  const handleSend = () => {
    if (!selected) return toast.error('Guruh tanlang')
    if (!message.trim()) return toast.error('Xabar matni kiritilishi shart')
    setLastResult(null)
    sendMut.mutate({ id: selected.id, msg: message.trim() })
  }

  return (
    <DashboardLayout>
      <Header
        title="Guruhga xabar"
        subtitle="Tanlangan guruh o'quvchilariga Telegram orqali xabar yuborish"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Group list */}
        <div className="lg:col-span-1 bg-white border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Guruh tanlash
          </p>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <p className="text-sm text-gray-400">Guruhlar topilmadi</p>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-96 overflow-y-auto">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { setSelected(g); setLastResult(null) }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-sm border transition-colors text-left w-full ${
                    selected?.id === g.id
                      ? 'border-brown-800 bg-brown-50 text-brown-800 font-medium'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <School size={13} className="shrink-0" />
                  <span className="flex-1 truncate">{g.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="lg:col-span-2 bg-white border border-gray-200 p-4">
          {selected ? (
            <>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 shrink-0">
                  {selected.name[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{selected.name}</p>
                  <p className="text-xs text-gray-400">
                    {selected.schedule.days.join(', ')} · {selected.schedule.time}
                    {(selected.schedule as any).endTime ? ` – ${(selected.schedule as any).endTime}` : ''}
                  </p>
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Xabar matni
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="HTML format: <b>qalin</b>, <i>kursiv</i>"
                rows={6}
                className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-1 focus:ring-brown-800 placeholder:text-gray-400"
              />

              <div className="flex items-center justify-between mt-3 gap-3">
                <p className="text-xs text-gray-400">
                  Guruhning faol o'quvchilariga (Telegram bog'langan) yuboriladi
                </p>
                <button
                  onClick={handleSend}
                  disabled={sendMut.isPending || !message.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-brown-800 text-white text-sm font-medium hover:bg-brown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={14} />
                  {sendMut.isPending ? 'Yuborilmoqda...' : 'Yuborish'}
                </button>
              </div>

              {lastResult && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-green-50 border border-green-200 text-sm text-green-800">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                  <span>
                    <b>{lastResult.sent}</b> ta xabar muvaffaqiyatli yuborildi
                    {lastResult.failed > 0 && (
                      <span className="text-red-600 ml-1">({lastResult.failed} ta xato)</span>
                    )}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <School size={36} className="mb-2 opacity-25" />
              <p className="text-sm">Chap tarafdan guruh tanlang</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
