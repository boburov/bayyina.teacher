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
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-12">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="fixed top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-brown-100/50 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"
      />
      <div
        aria-hidden
        className="fixed bottom-0 left-0 w-64 h-64 rounded-full bg-brown-200/30 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"
      />

      <div className="relative w-full max-w-sm flex flex-col items-center gap-6">

        {/* Brand mark */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brown-800 shadow-soft">
            <GraduationCap size={26} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-brown-900">Bayyina</h1>
            <p className="text-sm text-brown-400 mt-0.5">O'qituvchi paneli</p>
          </div>
        </div>

        {/* Login card */}
        <Card className="w-full shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Tizimga kirish</CardTitle>
            <CardDescription>
              Telefon raqam va parolni kiriting
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-xs text-brown-300">
          © {new Date().getFullYear()} Bayyina Ta'lim Markazi
        </p>
      </div>
    </div>
  )
}
