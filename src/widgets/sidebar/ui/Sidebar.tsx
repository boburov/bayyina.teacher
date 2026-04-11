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
  { label: 'Guruhlar', icon: <Users size={17} />,         path: ROUTES.GROUPS    },
  { label: 'Davomat',  icon: <CalendarCheck size={17} />, path: ROUTES.ATTENDANCE },
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
    <aside className="flex flex-col w-64 h-full bg-white border-r border-brown-100 shadow-soft">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brown-800 shrink-0">
          <GraduationCap size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-brown-900 leading-tight">Bayyina</p>
          <p className="text-xs text-brown-400">Teacher Panel</p>
        </div>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brown-300 px-3 mb-2">
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
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-brown-800 text-white shadow-soft'
                      : 'text-brown-600 hover:bg-brown-50 hover:text-brown-900',
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
      <div className="px-3 py-4 space-y-1">
        {/* User row */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <Avatar size="sm">
            <AvatarFallback initials={getUserInitials(user)} />
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-brown-900 truncate leading-tight">
              {user ? `${user.firstName} ${user.lastName}` : '—'}
            </p>
            {user?.role && (
              <p className="text-xs text-brown-400 truncate capitalize">{user.role}</p>
            )}
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-brown-500 hover:bg-red-50 hover:text-red-600"
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
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-card border border-brown-100 text-brown-700 hover:bg-brown-50 transition-colors"
        aria-label="Menu"
      >
        {mobileOpen ? <X size={17} /> : <Menu size={17} />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-brown-900/20 z-40 backdrop-blur-sm"
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
