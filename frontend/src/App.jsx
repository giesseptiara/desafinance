import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Budgets from './pages/Budgets'
import Incomes from './pages/Incomes'
import Expenses from './pages/Expenses'
import PublicDashboard from './pages/PublicDashboard'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Halaman publik */}
        <Route path="/" element={<PublicDashboard />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Halaman admin */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/incomes" element={<Incomes />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App