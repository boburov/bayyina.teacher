import type { ReactNode } from 'react'
import { Navigate }       from 'react-router-dom'
import { Sidebar }        from '@/widgets/sidebar/ui/Sidebar'
import { useAuth }        from '@/app/providers/AuthProvider'
import { ROUTES }         from '@/shared/config/routes'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pl-16 lg:pl-6">
          {children}
        </div>
      </main>
    </div>
  )
}
