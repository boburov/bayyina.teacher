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
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-brown-800">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">Bayyina</h1>
            <p className="text-sm text-gray-400 mt-0.5">O'qituvchi paneli</p>
          </div>
        </div>

        {/* Login form */}
        <div className="border border-gray-200 bg-white px-6 py-7">
          <h2 className="text-sm font-semibold text-gray-700 mb-5">Tizimga kirish</h2>
          <LoginForm />
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          © {new Date().getFullYear()} Bayyina Ta'lim Markazi
        </p>
      </div>
    </div>
  )
}
