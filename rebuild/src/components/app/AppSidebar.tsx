import { Link, useLocation, Outlet } from 'react-router'
import { useAuth } from '@/lib/auth'
import {
  LayoutDashboard,
  Search,
  Globe,
  Heart,
  Crown,
  LogIn,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function AppSidebar() {
  const { user, isLoggedIn, logout, isPro } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = [
    { path: '/app', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/app/browse', icon: Globe, label: 'Browse Domains' },
    { path: '/app/check', icon: Search, label: 'Check Domain' },
    { path: '/app/saved', icon: Heart, label: 'Saved' },
    { path: '/app/pricing', icon: Crown, label: 'Pricing' },
  ]

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow border"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static flex flex-col`}
      >
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <span className="font-bold text-lg text-gray-900">DomainIQ</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {item.label === 'Browse Domains' && (
                <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">NEW</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          {isLoggedIn ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              {isPro && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 px-3">
                  <Crown size={14} />
                  <span className="font-semibold">Pro Plan</span>
                </div>
              )}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" className="w-full gap-2">
                <LogIn size={16} />
                Login
              </Button>
            </Link>
          )}
        </div>
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  )
}

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      <main className="flex-1 lg:ml-0 p-4 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
