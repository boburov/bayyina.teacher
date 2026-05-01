import { NavLink, useNavigate } from 'react-router-dom'
import { Users, CalendarCheck, LogOut, GraduationCap, Menu, X, Bell, Wallet, Trophy } from 'lucide-react'
import { useState } from 'react'
import { ROUTES }   from '@/shared/config/routes'
import { useAuth }  from '@/app/providers/AuthProvider'
import { cn }       from '@/lib/utils'

interface NavItem {
  label: string
  icon:  React.ElementType
  path:  string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Guruhlar',     icon: Users,         path: ROUTES.GROUPS        },
  { label: 'Davomat',      icon: CalendarCheck, path: ROUTES.ATTENDANCE    },
  { label: 'Reyting',      icon: Trophy,        path: ROUTES.DER_STATS     },
  { label: 'Xabarnomalar', icon: Bell,          path: ROUTES.NOTIFICATIONS },
  { label: 'Maosh',        icon: Wallet,        path: ROUTES.SALARIES      },
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
    <aside className="flex flex-col w-56 h-full bg-white border-r border-gray-200">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-center w-7 h-7 bg-brown-800 shrink-0">
          <GraduationCap size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">Bayyina</p>
          <p className="text-xs text-gray-400">O'qituvchi paneli</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 mb-2">
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
                    'flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-l-2 border-brown-800 text-brown-800 bg-brown-50 pl-[10px]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={15} strokeWidth={isActive ? 2 : 1.5} />
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User footer */}
      <div className="border-t border-gray-200 px-3 py-3">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          <div className="flex items-center justify-center w-7 h-7 bg-brown-800 text-white text-xs font-semibold shrink-0">
            {getUserInitials(user)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate leading-tight">
              {user ? `${user.firstName} ${user.lastName}` : '—'}
            </p>
            {user?.role && (
              <p className="text-xs text-gray-400 truncate capitalize">{user.role}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={13} />
          Chiqish
        </button>
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
        className="lg:hidden fixed top-3 left-3 z-50 flex items-center justify-center w-8 h-8 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        aria-label="Menyu"
      >
        {mobileOpen ? <X size={15} /> : <Menu size={15} />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/10 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 h-full z-50">
            <SidebarContent onNavClick={() => setMobileOpen(false)} />
          </div>
        </>
      )}
    </>
  )
}
