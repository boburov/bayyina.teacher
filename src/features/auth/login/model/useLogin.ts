import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_TEACHER } from '@/shared/api/mock-data'
import { setStoredAuth } from '@/entities/user/model/auth-store'
import { ROUTES } from '@/shared/config/routes'
import { useAuth } from '@/app/providers/AuthProvider'

interface LoginFormValues {
  email: string
  password: string
}

interface LoginErrors {
  email?: string
  password?: string
  general?: string
}

export function useLogin() {
  const navigate  = useNavigate()
  const { login } = useAuth()

  const [values,   setValues]   = useState<LoginFormValues>({ email: '', password: '' })
  const [errors,   setErrors]   = useState<LoginErrors>({})
  const [loading,  setLoading]  = useState(false)

  function handleChange(field: keyof LoginFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }))
  }

  function validate(): boolean {
    const next: LoginErrors = {}
    if (!values.email.trim())    next.email    = 'Email yoki login kiritilmadi'
    if (!values.password.trim()) next.password = 'Parol kiritilmadi'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      // Simulate an API call
      await new Promise((r) => setTimeout(r, 900))

      // Demo: accept any email/password combo but check mock credentials
      const emailMatch = values.email === MOCK_TEACHER.email || values.email === 'aziz'
      if (!emailMatch || values.password.length < 3) {
        setErrors({ general: 'Email yoki parol noto\'g\'ri' })
        return
      }

      const token = 'mock_token_' + Date.now()
      setStoredAuth(MOCK_TEACHER, token)
      login(MOCK_TEACHER, token)
      navigate(ROUTES.GROUPS, { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return { values, errors, loading, handleChange, handleSubmit }
}
