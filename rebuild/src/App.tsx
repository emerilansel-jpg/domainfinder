import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BrowseDomains from './pages/BrowseDomains'
import DomainDetail from './pages/DomainDetail'
import CheckDomain from './pages/CheckDomain'
import Pricing from './pages/Pricing'
import SavedDomains from './pages/SavedDomains'
import { AppLayout } from './components/app/AppSidebar'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="browse" element={<BrowseDomains />} />
        <Route path="domain/:id" element={<DomainDetail />} />
        <Route path="check" element={<CheckDomain />} />
        <Route path="saved" element={<SavedDomains />} />
        <Route path="pricing" element={<Pricing />} />
      </Route>
    </Routes>
  )
}
