import type { ReactNode } from 'react'
import { ChevronLeft }    from 'lucide-react'
import { useNavigate }    from 'react-router-dom'

interface HeaderProps {
  title:      string
  subtitle?:  string
  backPath?:  string
  action?:    ReactNode
}

export function Header({ title, subtitle, backPath, action }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="mb-6 pb-4 border-b border-gray-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {backPath && (
            <button
              onClick={() => navigate(backPath)}
              aria-label="Orqaga"
              className="flex items-center justify-center w-7 h-7 border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors shrink-0"
            >
              <ChevronLeft size={14} />
            </button>
          )}
          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
