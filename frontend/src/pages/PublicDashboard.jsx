import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'
import { Link } from 'react-router-dom'

function PublicDashboard() {
  const [data, setData] = useState(null)
  const [profile, setProfile] = useState(null)
  const [budgets, setBudgets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      apiRequest('/public/summary'),
      apiRequest('/public/profile'),
      apiRequest('/public/budgets'),
      apiRequest('/public/transactions'),
    ])
      .then(
        ([
          summaryResponse,
          profileResponse,
          budgetsResponse,
          transactionsResponse,
        ]) => {
          setData(summaryResponse.data)
          setProfile(profileResponse.data)
          setBudgets(budgetsResponse.data)
          setTransactions(transactionsResponse.data)
        }
      )
      .catch((error) => {
        console.error('PUBLIC DASHBOARD ERROR:', error)
        setError(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value))
  }

  const formatDate = (value) => {
    return new Date(value).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />

          <p className="text-slate-500 mt-4">
            Memuat transparansi keuangan...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-6 text-center shadow-sm">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl">
            !
          </div>

          <h2 className="text-lg font-semibold text-slate-900 mt-4">
            Data tidak dapat dimuat
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error}
          </p>
        </div>
      </div>
    )
  }

  const percentage =
    data.totalBudget > 0
      ? Math.min(
          (data.totalExpense / data.totalBudget) * 100,
          100
        )
      : 0

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">

            <div>
              <p className="text-lg font-bold text-slate-900">
                {profile?.name || 'DesaFinance'}
              </p>

              <p className="text-xs text-slate-500">
                Portal Transparansi Keuangan Desa
              </p>
            </div>

            <a
              href="#transparansi"
              className="hidden sm:inline-flex px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
            >
              Lihat Keuangan
            </a>

          </div>
        </div>
      </header>


      {/* HERO */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/10 rounded-full text-sm text-slate-300">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              Informasi publik desa
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-6">
              {profile?.name || 'Desa'}
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 mt-3">
              Transparansi untuk desa yang lebih terbuka.
            </p>

            <p className="text-slate-400 mt-5 max-w-2xl leading-relaxed">
              Lihat informasi anggaran, pendapatan, belanja, dan
              penggunaan keuangan desa secara terbuka dan mudah
              dipahami masyarakat.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">

              <a
                href="#transparansi"
                className="inline-flex items-center justify-center px-5 py-3 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition"
              >
                Lihat Transparansi
                <span className="ml-2">↓</span>
              </a>

              <a
                href="#profil"
                className="inline-flex items-center justify-center px-5 py-3 border border-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-800 transition"
              >
                Tentang Desa
              </a>

            </div>

          </div>

        </div>
      </section>


      {/* MAIN */}
      <main
        id="transparansi"
        className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-12"
      >

        {/* SECTION TITLE */}
        <div className="mb-6">

          <p className="text-sm font-medium text-violet-600">
            TRANSPARANSI KEUANGAN
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mt-1">
            Ringkasan Keuangan Desa
          </h2>

          <p className="text-slate-500 mt-2">
            Gambaran umum kondisi keuangan desa berdasarkan data
            yang tercatat.
          </p>

        </div>


        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Budget */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Total Anggaran
              </p>

              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                Rp
              </div>

            </div>

            <p className="text-2xl font-bold mt-4">
              {formatRupiah(data.totalBudget)}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Total anggaran yang tercatat
            </p>

          </div>


          {/* Income */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Pendapatan
              </p>

              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                ↑
              </div>

            </div>

            <p className="text-2xl font-bold text-emerald-600 mt-4">
              {formatRupiah(data.totalIncome)}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Total pendapatan desa
            </p>

          </div>


          {/* Expense */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Belanja
              </p>

              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                ↓
              </div>

            </div>

            <p className="text-2xl font-bold text-red-600 mt-4">
              {formatRupiah(data.totalExpense)}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Total belanja desa
            </p>

          </div>


          {/* Remaining */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Sisa Anggaran
              </p>

              <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                ✓
              </div>

            </div>

            <p className="text-2xl font-bold text-violet-600 mt-4">
              {formatRupiah(data.remainingBudget)}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Anggaran setelah belanja
            </p>

          </div>

        </div>


        {/* REALISASI */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 mt-6 shadow-sm">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Realisasi Anggaran
              </p>

              <h3 className="text-xl font-bold mt-1">
                {percentage.toFixed(1)}% anggaran telah digunakan
              </h3>
            </div>

            <div className="text-sm text-slate-500">
              {formatRupiah(data.totalExpense)} dari{' '}
              {formatRupiah(data.totalBudget)}
            </div>

          </div>

          <div className="mt-5 h-4 bg-slate-100 rounded-full overflow-hidden">

            <div
              className="h-full bg-violet-600 rounded-full transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />

          </div>

          <div className="flex justify-between mt-3 text-xs text-slate-400">
            <span>Belanja</span>
            <span>100% Anggaran</span>
          </div>

        </div>


        {/* TWO COLUMNS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">


          {/* BUDGETS */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

            <div className="p-6 border-b border-slate-200">

              <p className="text-sm font-medium text-violet-600">
                ANGGARAN
              </p>

              <h3 className="text-xl font-bold mt-1">
                Anggaran Desa
              </h3> 

              <p className="text-sm text-slate-500 mt-1">
                Daftar anggaran yang tercatat dalam sistem.
              </p> <Link
  to="/public/budgets"
  className="text-sm font-medium text-violet-600 hover:text-violet-800"
>
  Lihat Semua →
</Link>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-slate-50">

                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                      Tahun
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                      Anggaran
                    </th>

                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                      Nilai
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {budgets.length === 0 ? (

                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-8 text-center text-sm text-slate-500"
                      >
                        Belum ada data anggaran.
                      </td>
                    </tr>

                  ) : (

                    budgets.map((budget) => (

                      <tr
                        key={budget.id}
                        className="border-t border-slate-100"
                      >

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {budget.year}
                        </td>

                        <td className="px-6 py-4">

                          <p className="text-sm font-medium text-slate-900">
                            {budget.name}
                          </p>

                          {budget.description && (
                            <p className="text-xs text-slate-400 mt-1">
                              {budget.description}
                            </p>
                          )}

                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-right text-slate-900">
                          {formatRupiah(budget.total_amount)}
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* TRANSACTIONS */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

            <div className="p-6 border-b border-slate-200">

              <p className="text-sm font-medium text-violet-600">
                AKTIVITAS TERBARU
              </p>

              <h3 className="text-xl font-bold mt-1">
                Transaksi Keuangan
              </h3> 

              <p className="text-sm text-slate-500 mt-1">
                Riwayat pendapatan dan belanja terbaru.
              </p>
              <Link
    to="/public/transactions"
    className="text-sm font-medium text-violet-600 hover:text-violet-800"
  >
    Lihat Semua →
  </Link>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-slate-50">

                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                      Tanggal
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                      Jenis
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                      Kategori
                    </th>

                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                      Jumlah
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {transactions.length === 0 ? (

                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-sm text-slate-500"
                      >
                        Belum ada transaksi.
                      </td>
                    </tr>

                  ) : (

                    transactions.slice(0, 10).map((transaction) => (

                      <tr
                        key={transaction.type + transaction.id}
                        className="border-t border-slate-100"
                      >

                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                          {formatDate(transaction.transaction_date)}
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={
                              transaction.type === 'income'
                                ? 'inline-flex px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium'
                                : 'inline-flex px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium'
                            }
                          >
                            {transaction.type === 'income'
                              ? 'Pendapatan'
                              : 'Belanja'}
                          </span>

                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {transaction.category_name || '-'}
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-right whitespace-nowrap">

                          <span
                            className={
                              transaction.type === 'income'
                                ? 'text-emerald-600'
                                : 'text-red-600'
                            }
                          >
                            {transaction.type === 'income'
                              ? '+ '
                              : '- '}

                            {formatRupiah(transaction.amount)}
                          </span>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>


        {/* PROFILE */}
        <section
          id="profil"
          className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div>

              <p className="text-sm font-medium text-violet-600">
                TENTANG DESA
              </p>

              <h3 className="text-2xl font-bold mt-1">
                {profile?.name || 'Profil Desa'}
              </h3>

              <p className="text-slate-500 mt-4 leading-relaxed">
                Portal ini menyediakan informasi keuangan desa
                secara terbuka sebagai bentuk transparansi dan
                akuntabilitas kepada masyarakat.
              </p>

            </div>


            <div className="space-y-4">

              <div>
                <p className="text-xs uppercase font-semibold text-slate-400">
                  Kode Desa
                </p>

                <p className="text-sm font-medium text-slate-800 mt-1">
                  {profile?.code || '-'}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase font-semibold text-slate-400">
                  Kepala Desa
                </p>

                <p className="text-sm font-medium text-slate-800 mt-1">
                  {profile?.village_head || '-'}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase font-semibold text-slate-400">
                  Alamat
                </p>

                <p className="text-sm font-medium text-slate-800 mt-1">
                  {profile?.address || '-'}
                </p>
              </div>

            </div>

          </div>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 mt-10">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div>

              <h3 className="text-lg font-bold text-white">
                {profile?.name || 'DesaFinance'}
              </h3>

              <p className="text-sm text-slate-400 mt-2 max-w-md">
                Portal transparansi keuangan desa untuk memberikan
                akses informasi yang mudah dan terbuka bagi masyarakat.
              </p>

            </div>


            <div className="md:text-right">

              <p className="text-sm font-medium text-white">
                Informasi Desa
              </p>

              <p className="text-sm text-slate-400 mt-2">
                {profile?.address || '-'}
              </p>

              <p className="text-sm text-slate-400 mt-1">
                {profile?.phone || '-'}
              </p>

              <p className="text-sm text-slate-400 mt-1">
                {profile?.email || '-'}
              </p>

            </div>

          </div>

          <div className="border-t border-slate-800 mt-8 pt-6">

            <p className="text-xs text-slate-500 text-center">
              © {new Date().getFullYear()} {profile?.name || 'DesaFinance'}.
              Portal Transparansi Keuangan Desa.
            </p>

          </div>

        </div>

      </footer>

    </div>
  )
}

export default PublicDashboard