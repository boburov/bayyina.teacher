import type { ReactNode } from 'react'
import { ChevronLeft }    from 'lucide-react'
import { useNavigate }    from 'react-router-dom'

interface HeaderProps {
  title:      string
  subtitle?:  string
  backPath?:  string
  onBack?:    () => void
  action?:    ReactNode
}

export function Header({ title, subtitle, backPath, onBack, action }: HeaderProps) {
  const navigate = useNavigate()

  const handleBack = onBack ?? (backPath ? () => navigate(backPath) : undefined)

  return (
    <div className="mb-6 pb-4 border-b border-gray-200">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {handleBack && (
            <button
              onClick={handleBack}
              aria-label="Orqaga"
              className="flex items-center justify-center w-7 h-7 border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors shrink-0"
            >
              <ChevronLeft size={14} />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-gray-900 leading-tight truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0 ml-2">{action}</div>}
      </div>
    </div>
  )
}
