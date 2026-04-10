import { NavLink, useNavigate } from 'react-router-dom'
import { Users, CalendarCheck, LogOut, GraduationCap, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ROUTES } from '@/shared/config/routes'
import { useAuth } from '@/app/providers/AuthProvider'
import { cn } from '@/shared/lib/cn'

interface NavItem {
  label:  string
  icon:   React.ReactNode
  path:   string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Guruhlar',  icon: <Users size={18} />,         path: ROUTES.GROUPS    },
  { label: 'Davomat',   icon: <CalendarCheck size={18} />, path: ROUTES.ATTENDANCE },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout }  = useAuth()
  const navigate           = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  const content = (
    <aside
      className={cn(
        'flex flex-col w-64 h-full bg-white border-r border-brown-100 shadow-soft',
        className,
      )}
    >
      {/* Logo / brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-brown-100">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brown-800">
          <GraduationCap size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-brown-900 leading-tight">Bayyina</p>
          <p className="text-xs text-brown-400">Teacher Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setMobileOpen(false)}
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

      {/* User footer */}
      <div className="px-3 py-4 border-t border-brown-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brown-100 text-brown-700 text-xs font-semibold shrink-0">
            {user?.name.charAt(0) ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-brown-900 truncate">{user?.name}</p>
            <p className="text-xs text-brown-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-brown-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={15} />
          Chiqish
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full">{content}</div>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-card border border-brown-100 text-brown-700"
        aria-label="Menu"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-brown-900/20 z-40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 h-full z-50">
            {content}
          </div>
        </>
      )}
    </>
  )
}
