import type { ReactNode } from 'react'
import { ChevronLeft }    from 'lucide-react'
import { useNavigate }    from 'react-router-dom'
import { Button }         from '@/components/ui/button'
import { Separator }      from '@/components/ui/separator'

interface HeaderProps {
  title:      string
  subtitle?:  string
  backPath?:  string
  action?:    ReactNode
}

export function Header({ title, subtitle, backPath, action }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {backPath && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(backPath)}
              aria-label="Orqaga"
              className="h-8 w-8 rounded-xl shrink-0"
            >
              <ChevronLeft size={16} />
            </Button>
          )}
          <div>
            <h1 className="text-xl font-semibold text-brown-900 leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-brown-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <Separator className="mt-5" />
    </div>
  )
}
