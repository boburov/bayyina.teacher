import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'
import { useLogin } from '../model/useLogin'
import { Button }   from '@/shared/ui/Button'
import { Input }    from '@/shared/ui/Input'
import { InputTel } from '@/components/ui/input-tel'

export function LoginForm() {
  const { values, errors, loading, handleChange, handleSubmit } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((s) => !s)}
      className="text-gray-400 hover:text-brown-800 transition-colors"
      tabIndex={-1}
      aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
    >
      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  )

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

      <InputTel
        label="Telefon raqam"
        id="phone"
        value={values.phone}
        onChange={(formatted) => handleChange('phone', formatted)}
        error={errors.phone}
        autoFocus
      />

      <Input
        label="Parol"
        id="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        value={values.password}
        onChange={(e) => handleChange('password', e.target.value)}
        error={errors.password}
        autoComplete="current-password"
        leftIcon={<Lock size={14} />}
        rightIcon={passwordToggle}
      />

      {errors.general && (
        <div className="border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 rounded-sm">
          {errors.general}
        </div>
      )}

      <Button type="submit" loading={loading} fullWidth className="mt-1 h-10">
        Kirish
      </Button>
    </form>
  )
}
