import { NavLink, useNavigate } from 'react-router-dom'
import { Users, CalendarCheck, LogOut, GraduationCap, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ROUTES }   from '@/shared/config/routes'
import { useAuth }  from '@/app/providers/AuthProvider'
import { cn }       from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button }    from '@/components/ui/button'

interface NavItem {
  label: string
  icon:  React.ReactNode
  path:  string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Guruhlar', icon: <Users size={16} />,         path: ROUTES.GROUPS    },
  { label: 'Davomat',  icon: <CalendarCheck size={16} />, path: ROUTES.ATTENDANCE },
]

function getUserInitials(user: { firstName?: string; lastName?: string; name?: string } | null): string {
  if (!user) return 'U'
  if (user.firstName && user.lastName) {
    return (user.firstName[0] + user.lastName[0]).toUpperCase()
  }
  return (user.name ?? 'U').charAt(0).toUpperCase()
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()

  function handleLogout() {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <aside className="flex flex-col w-64 h-full bg-white border-r border-gray-200">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-brown-800 shrink-0">
          <GraduationCap size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">Bayyina</p>
          <p className="text-xs text-gray-500">Teacher Panel</p>
        </div>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 px-3 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 mb-1.5">
          Menyu
        </p>
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onNavClick}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brown-800 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Separator />

      {/* User footer */}
      <div className="px-3 py-3 space-y-0.5">
        {/* User row */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-md">
          <Avatar size="sm">
            <AvatarFallback initials={getUserInitials(user)} />
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate leading-tight">
              {user ? `${user.firstName} ${user.lastName}` : '—'}
            </p>
            {user?.role && (
              <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
            )}
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={14} />
          Chiqish
        </Button>
      </div>
    </aside>
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex h-full">
        <SidebarContent />
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-9 h-9 bg-white rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        aria-label="Menu"
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/20 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 h-full z-50 animate-fadeIn">
            <SidebarContent onNavClick={() => setMobileOpen(false)} />
          </div>
        </>
      )}
    </>
  )
}
