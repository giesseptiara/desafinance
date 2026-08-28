import { NavLink, Outlet } from 'react-router-dom'

function DashboardLayout() {
  const menuItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Anggaran', path: '/budgets' },
  { name: 'Pendapatan', path: '/incomes' },
  { name: 'Belanja', path: '/expenses' },
  { name: 'Kategori', path: '/categories' },
  { name: 'Profil Desa', path: '/profile' },
]

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="px-6 py-5 border-b border-slate-700">
          <h1 className="text-xl font-bold">DesaFinance</h1>
          <p className="text-xs text-slate-400 mt-1">
            Sistem Keuangan Desa
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-white text-slate-900 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => {
              localStorage.removeItem('token')
              window.location.href = '/login'
            }}
            className="w-full px-4 py-3 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white text-left"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <p className="text-sm text-slate-500">
              Admin Panel
            </p>
          </div>

          <div className="text-sm font-medium text-slate-700">
            Administrator
          </div>
        </header>

        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default DashboardLayout