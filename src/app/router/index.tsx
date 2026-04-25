import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'
import { useAuth } from '@/app/providers/AuthProvider'
import { LoginPage }          from '@/pages/login/ui/LoginPage'
import { GroupsPage }         from '@/pages/groups/ui/GroupsPage'
import { GroupDetailsPage }   from '@/pages/group-details/ui/GroupDetailsPage'
import { AttendancePage }     from '@/pages/attendance/ui/AttendancePage'
import { NotificationsPage }  from '@/pages/notifications/ui/NotificationsPage'
import { SalariesPage }       from '@/pages/salaries/ui/SalariesPage'

/** Redirects unauthenticated users to /login */
function AuthGuard() {
  const { token } = useAuth()
  if (!token) return <Navigate to={ROUTES.LOGIN} replace />
  return <Outlet />
}

/** Redirects authenticated users away from the login page */
function GuestGuard() {
  const { token } = useAuth()
  if (token) return <Navigate to={ROUTES.GROUPS} replace />
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.GROUPS} replace />,
  },
  {
    element: <GuestGuard />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      { path: ROUTES.GROUPS,        element: <GroupsPage /> },
      { path: ROUTES.GROUP_DETAILS, element: <GroupDetailsPage /> },
      { path: ROUTES.ATTENDANCE,    element: <AttendancePage /> },
      { path: ROUTES.NOTIFICATIONS, element: <NotificationsPage /> },
      { path: ROUTES.SALARIES,      element: <SalariesPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.GROUPS} replace />,
  },
])
