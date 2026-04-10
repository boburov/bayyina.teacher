export const ROUTES = {
  LOGIN:         '/login',
  GROUPS:        '/groups',
  GROUP_DETAILS: '/groups/:id',
  ATTENDANCE:    '/attendance',
} as const

export function groupDetailsPath(id: string | number) {
  return `/groups/${id}`
}
