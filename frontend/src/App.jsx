import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Budgets from './pages/Budgets'
import Incomes from './pages/Incomes'
import Expenses from './pages/Expenses'
import PublicDashboard from './pages/PublicDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman awal */}
        <Route path="/" element={<PublicDashboard />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/incomes" element={<Incomes />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/transparansi" element={<PublicDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App