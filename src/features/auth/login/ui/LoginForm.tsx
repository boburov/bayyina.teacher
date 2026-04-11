import { Eye, EyeOff, Lock, Phone } from 'lucide-react'
import { useState } from 'react'
import { useLogin } from '../model/useLogin'
import { Button } from '@/components/ui/button'
import { Input  } from '@/components/ui/input'
import { Label  } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function LoginForm() {
  const { values, errors, loading, handleChange, handleSubmit } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      {/* Phone field */}
      <div className="space-y-1.5">
        <Label htmlFor="phone">Telefon raqam</Label>
        <div className="relative">
          <Phone
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 pointer-events-none"
          />
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            placeholder="+998 90 123 45 67"
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            autoComplete="tel"
            autoFocus
            className="pl-9"
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone}</p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-1.5">
        <Label htmlFor="password">Parol</Label>
        <div className="relative">
          <Lock
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 pointer-events-none"
          />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            autoComplete="current-password"
            className="pl-9 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'text-brown-400 hover:text-brown-600 transition-colors',
            )}
            tabIndex={-1}
            aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}
      </div>

      {/* General error */}
      {errors.general && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {errors.general}
        </div>
      )}

      <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
        Kirish
      </Button>

      {/* Demo hint */}
      <p className="text-center text-xs text-brown-400">
        Demo:{' '}
        <span className="font-medium text-brown-600">+998 90 123 45 67</span>
        {' '}/ istalgan 3+ belgili parol
      </p>
    </form>
  )
}
