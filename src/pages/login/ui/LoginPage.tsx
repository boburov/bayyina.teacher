import { Navigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { LoginForm } from '@/features/auth/login/ui/LoginForm'
import { useAuth } from '@/app/providers/AuthProvider'
import { ROUTES } from '@/shared/config/routes'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function LoginPage() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.GROUPS} replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">

        {/* Brand mark */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-brown-800">
            <GraduationCap size={22} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">Bayyina</h1>
            <p className="text-sm text-gray-500 mt-0.5">O'qituvchi paneli</p>
          </div>
        </div>

        {/* Login card */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Tizimga kirish</CardTitle>
            <CardDescription>
              Telefon raqam va parolni kiriting
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Bayyina Ta'lim Markazi
        </p>
      </div>
    </div>
  )
}
