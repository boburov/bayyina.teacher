export const ROUTES = {
  LOGIN:         '/login',
  GROUPS:        '/groups',
  GROUP_DETAILS: '/groups/:id',
  ATTENDANCE:    '/attendance',
  NOTIFICATIONS: '/notifications',
  SALARIES:      '/salaries',
  DER_STATS:     '/der-stats',
  SEND_MESSAGE:  '/send-message',
} as const

export function groupDetailsPath(id: string | number) {
  return `/groups/${id}`
}
