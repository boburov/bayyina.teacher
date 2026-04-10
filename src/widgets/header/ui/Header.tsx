import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title:       string
  subtitle?:   string
  backPath?:   string
  action?:     ReactNode
}

export function Header({ title, subtitle, backPath, action }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {backPath && (
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center justify-center w-8 h-8 rounded-xl border border-brown-200 text-brown-500 hover:bg-brown-50 hover:text-brown-800 transition-colors shrink-0"
            aria-label="Orqaga"
          >
            <ChevronLeft size={16} />
          </button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-brown-900 leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-brown-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
