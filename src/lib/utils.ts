import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(val: string | number | null | undefined): string {
  if (val == null) return ''
  const d = String(val).replace(/\D/g, '')
  if (d.length === 12)
    return `+${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5, 8)}-${d.slice(8, 10)}-${d.slice(10, 12)}`
  return String(val)
}

export function formatNumber(val: number | null | undefined): string {
  if (val == null) return '0'
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function formatMoney(val: number | null | undefined): string {
  return formatNumber(val) + " so'm"
}
