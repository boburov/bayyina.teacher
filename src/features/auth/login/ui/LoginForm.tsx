import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useLogin } from '../model/useLogin'
import { Button } from '@/shared/ui/Button'
import { Input  } from '@/shared/ui/Input'

export function LoginForm() {
  const { values, errors, loading, handleChange, handleSubmit } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Input
        label="Email yoki login"
        type="email"
        placeholder="aziz@bayyina.uz"
        value={values.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        leftIcon={<Mail size={16} />}
        autoComplete="email"
        autoFocus
      />

      <Input
        label="Parol"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        value={values.password}
        onChange={(e) => handleChange('password', e.target.value)}
        error={errors.password}
        leftIcon={<Lock size={16} />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="text-brown-400 hover:text-brown-600 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        autoComplete="current-password"
      />

      {errors.general && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {errors.general}
        </div>
      )}

      <Button type="submit" loading={loading} fullWidth size="lg" className="mt-1">
        Kirish
      </Button>

      <p className="text-center text-xs text-brown-400">
        Demo: <span className="font-medium text-brown-600">aziz@bayyina.uz</span> / <span className="font-medium text-brown-600">any 3+ chars</span>
      </p>
    </form>
  )
}
