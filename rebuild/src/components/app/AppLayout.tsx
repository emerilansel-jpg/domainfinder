import { Outlet } from 'react-router'
import AppSidebar from './AppSidebar'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      <main className="flex-1 lg:ml-0 p-4 lg:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
