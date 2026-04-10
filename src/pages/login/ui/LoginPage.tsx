import { Navigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { LoginForm } from '@/features/auth/login/ui/LoginForm'
import { useAuth } from '@/app/providers/AuthProvider'
import { ROUTES } from '@/shared/config/routes'

export function LoginPage() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.GROUPS} replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      {/* Decorative circles */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full bg-brown-100/40 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-64 h-64 rounded-full bg-brown-200/30 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card border border-brown-100 p-8">
          {/* Brand header */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brown-800 mb-4 shadow-soft">
              <GraduationCap size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-brown-900 tracking-tight">Bayyina</h1>
            <p className="text-sm text-brown-400 mt-1">O'qituvchi paneli</p>
          </div>

          <LoginForm />
        </div>

        <p className="text-center text-xs text-brown-300 mt-5">
          © {new Date().getFullYear()} Bayyina Ta'lim Markazi
        </p>
      </div>
    </div>
  )
}
