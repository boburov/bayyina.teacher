/** Returns "YYYY-MM-DD" for today + optional day offset in local time */
export function getLocalDateString(offset = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Returns array of last N ISO date strings, oldest first */
export function getLastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => getLocalDateString(i - (n - 1)))
}

const UZ_WEEKDAYS = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh']

export interface ColumnHeader {
  abbr:  string
  day:   number
  month: number
}

export function parseColumnHeader(isoDate: string): ColumnHeader {
  const [y, m, d] = isoDate.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return { abbr: UZ_WEEKDAYS[date.getDay()], day: d, month: m }
}

export function formatFullDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('uz-UZ', {
    day:     'numeric',
    month:   'long',
    year:    'numeric',
    weekday: 'long',
  })
}
