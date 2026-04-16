import { Eye, EyeOff, Lock, Phone } from 'lucide-react'
import { useState } from 'react'
import { useLogin } from '../model/useLogin'
import { Button } from '@/shared/ui/Button'
import { Input  } from '@/shared/ui/Input'

export function LoginForm() {
  const { values, errors, loading, handleChange, handleSubmit } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

      {/* Phone field */}
      <Input
        label="Telefon raqam"
        id="phone"
        type="tel"
        inputMode="numeric"
        placeholder="+998 90 123 45 67"
        value={values.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        error={errors.phone}
        autoComplete="tel"
        autoFocus
        leftIcon={<Phone size={14} />}
      />

      {/* Password field */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">Parol</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Lock size={14} />
          </span>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            autoComplete="current-password"
            className={`w-full h-9 rounded-sm border bg-white px-3 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:border-brown-800 ${errors.password ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brown-800 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
      </div>

      {/* General error */}
      {errors.general && (
        <div className="border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
          {errors.general}
        </div>
      )}

      <Button type="submit" loading={loading} fullWidth className="mt-1 h-10">
        Kirish
      </Button>
    </form>
  )
}
