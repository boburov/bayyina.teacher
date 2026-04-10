import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'
import { LoginPage }        from '@/pages/login/ui/LoginPage'
import { GroupsPage }       from '@/pages/groups/ui/GroupsPage'
import { GroupDetailsPage } from '@/pages/group-details/ui/GroupDetailsPage'
import { AttendancePage }   from '@/pages/attendance/ui/AttendancePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.GROUPS} replace />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.GROUPS,
    element: <GroupsPage />,
  },
  {
    path: ROUTES.GROUP_DETAILS,
    element: <GroupDetailsPage />,
  },
  {
    path: ROUTES.ATTENDANCE,
    element: <AttendancePage />,
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.GROUPS} replace />,
  },
])
