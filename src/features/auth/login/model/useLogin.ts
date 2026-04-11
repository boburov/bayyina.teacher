import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { loginApi, fetchProfile } from '@/entities/user/model/api'
import { ApiError } from '@/shared/api/http'
import { ROUTES } from '@/shared/config/routes'

interface LoginFormValues {
  phone:    string
  password: string
}

interface LoginErrors {
  phone?:    string
  password?: string
  general?:  string
}

/** Strip all non-digit characters */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Format UZ phone progressively as user types.
 * Input: raw string with any chars. Output: +998 XX XXX XX XX
 */
export function formatPhone(raw: string): string {
  const digits = digitsOnly(raw)
  const local  = digits.startsWith('998') ? digits.slice(3) : digits

  let result = '+998'
  if (local.length === 0) return result

  result += ' ' + local.slice(0, 2)
  if (local.length <= 2) return result

  result += ' ' + local.slice(2, 5)
  if (local.length <= 5) return result

  result += ' ' + local.slice(5, 7)
  if (local.length <= 7) return result

  result += ' ' + local.slice(7, 9)
  return result
}

function isPhoneComplete(phone: string): boolean {
  const digits = digitsOnly(phone)
  const local  = digits.startsWith('998') ? digits.slice(3) : digits
  return local.length === 9
}

export function useLogin() {
  const navigate  = useNavigate()
  const { login } = useAuth()

  const [values,  setValues]  = useState<LoginFormValues>({ phone: '', password: '' })
  const [errors,  setErrors]  = useState<LoginErrors>({})
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof LoginFormValues, value: string) {
    if (field === 'phone') {
      const digits = digitsOnly(value)
      const local  = digits.startsWith('998') ? digits.slice(3) : digits
      if (local.length > 9) return
      setValues((prev) => ({ ...prev, phone: formatPhone(digits) }))
    } else {
      setValues((prev) => ({ ...prev, [field]: value }))
    }
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }))
  }

  function validate(): boolean {
    const next: LoginErrors = {}
    if (!values.phone.trim()) {
      next.phone = 'Telefon raqam kiritilmadi'
    } else if (!isPhoneComplete(values.phone)) {
      next.phone = 'Telefon raqam to\'liq emas'
    }
    if (!values.password.trim()) next.password = 'Parol kiritilmadi'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      // Build numeric phone: 998XXXXXXXXX
      const digits      = digitsOnly(values.phone)
      const phoneNumber = digits.startsWith('998')
        ? Number(digits)
        : Number('998' + digits)

      // 1. Login → token
      const token = await loginApi(phoneNumber, values.password)

      // 2. Fetch profile with fresh token
      const user = await fetchProfile(token)

      // 3. Persist & navigate
      login(user, token)
      navigate(ROUTES.GROUPS, { replace: true })
    } catch (err) {
      if (err instanceof ApiError && (err.status === 400 || err.status === 401)) {
        setErrors({ general: 'Telefon raqam yoki parol noto\'g\'ri' })
      } else {
        setErrors({ general: 'Serverga ulanishda xatolik yuz berdi' })
      }
    } finally {
      setLoading(false)
    }
  }

  return { values, errors, loading, handleChange, handleSubmit }
}
