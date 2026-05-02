import type { ReactNode } from 'react'
import { Navigate }       from 'react-router-dom'
import { Sidebar }        from '@/widgets/sidebar/ui/Sidebar'
import { useAuth }        from '@/app/providers/AuthProvider'
import { ROUTES }         from '@/shared/config/routes'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pl-12 sm:pl-14 lg:pl-6">
          {children}
        </div>
      </main>
    </div>
  )
}
