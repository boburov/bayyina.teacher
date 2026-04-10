import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from './cn'

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id:      string
  message: string
  type:    ToastType
}

interface ToastContextValue {
  success: (message: string) => void
  error:   (message: string) => void
  info:    (message: string) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

// ─── Individual toast ─────────────────────────────────────────────────────────

const ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle size={17} className="text-emerald-500 shrink-0" />,
  error:   <XCircle    size={17} className="text-red-500    shrink-0" />,
  info:    <Info       size={17} className="text-blue-500   shrink-0" />,
}

const BORDER: Record<ToastType, string> = {
  success: 'border-l-emerald-400',
  error:   'border-l-red-400',
  info:    'border-l-blue-400',
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 bg-white border border-brown-100 border-l-4 rounded-xl shadow-card',
        'px-4 py-3 min-w-[15rem] max-w-[22rem] w-full',
        'animate-[slideInRight_0.25s_ease-out]',
        BORDER[toast.type],
      )}
      role="alert"
    >
      {ICONS[toast.type]}
      <p className="flex-1 text-sm font-medium text-brown-900 leading-snug">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-brown-300 hover:text-brown-600 transition-colors shrink-0"
        aria-label="Yopish"
      >
        <X size={14} />
      </button>
    </div>
  )
}

// ─── Container ────────────────────────────────────────────────────────────────

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const add = useCallback(
    (message: string, type: ToastType) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => remove(id), 3500)
    },
    [remove],
  )

  const value: ToastContextValue = {
    success: (msg) => add(msg, 'success'),
    error:   (msg) => add(msg, 'error'),
    info:    (msg) => add(msg, 'info'),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  )
}
