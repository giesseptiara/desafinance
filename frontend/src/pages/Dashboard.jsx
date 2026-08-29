import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [budgets, setBudgets] = useState([])
  const [selectedYear, setSelectedYear] = useState('')

  useEffect(() => {
    apiRequest('/budgets')
      .then((response) => {
        setBudgets(response.data)
      })
      .catch((error) => {
        console.error('BUDGET YEAR ERROR:', error)
      })
  }, [])

  useEffect(() => {
    setLoading(true)
    setError('')

    const endpoint = selectedYear
      ? `/dashboard?year=${selectedYear}`
      : '/dashboard'

    apiRequest(endpoint)
      .then((response) => {
        console.log('DASHBOARD API:', response)
        setData(response.data)
      })
      .catch((error) => {
        console.error('DASHBOARD ERROR:', error)
        setError(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [selectedYear])

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value))
  }

  const formatDate = (value) => {
    if (!value) return '-'

    return new Date(value).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const years = [...new Set(budgets.map((budget) => budget.year))]

  const budgetPercentage =
    data && data.totalBudget > 0
      ? Math.min(
          (data.totalExpense / data.totalBudget) * 100,
          100
        )
      : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">
          Memuat dashboard...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <p className="font-medium text-red-700">
          Gagal memuat dashboard
        </p>

        <p className="text-sm text-red-600 mt-1">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h2>

          <p className="text-slate-500 mt-1">
            Ringkasan kondisi keuangan desa
          </p>
        </div>

        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Periode Tahun
          </label>

          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">
              Semua Tahun
            </option>

            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">

        {/* Total Anggaran */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500">
            Total Anggaran
          </p>

          <p className="text-xl font-bold text-slate-900 mt-2 break-words">
            {formatRupiah(data.totalBudget)}
          </p>
        </div>

        {/* Pendapatan */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500">
            Total Pendapatan
          </p>

          <p className="text-xl font-bold text-emerald-600 mt-2 break-words">
            {formatRupiah(data.totalIncome)}
          </p>

          <p className="text-xs text-slate-500 mt-2">
            {data.totalIncomeTransactions} transaksi
          </p>
        </div>

        {/* Belanja */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500">
            Total Belanja
          </p>

          <p className="text-xl font-bold text-red-600 mt-2 break-words">
            {formatRupiah(data.totalExpense)}
          </p>

          <p className="text-xs text-slate-500 mt-2">
            {data.totalExpenseTransactions} transaksi
          </p>
        </div>

        {/* Saldo */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500">
            Saldo
          </p>

          <p className="text-xl font-bold text-blue-600 mt-2 break-words">
            {formatRupiah(data.balance)}
          </p>
        </div>

        {/* Sisa Anggaran */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500">
            Sisa Anggaran
          </p>

          <p className="text-xl font-bold text-violet-600 mt-2 break-words">
            {formatRupiah(data.remainingBudget)}
          </p>
        </div>

      </div>

      {/* Budget Realization */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Realisasi Anggaran
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Persentase anggaran yang telah digunakan untuk belanja
            </p>
          </div>

          <p className="text-xl font-bold text-slate-900">
            {budgetPercentage.toFixed(1)}%
          </p>

        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-600 rounded-full transition-all duration-500"
            style={{
              width: `${budgetPercentage}%`,
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-3 text-sm">

          <span className="text-slate-500">
            Terpakai: {formatRupiah(data.totalExpense)}
          </span>

          <span className="text-slate-500">
            Anggaran: {formatRupiah(data.totalBudget)}
          </span>

        </div>

      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            Transaksi Terbaru
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Lima transaksi keuangan terakhir
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Tanggal
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Jenis
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Kategori
                </th>

                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                  Jumlah
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Keterangan
                </th>

              </tr>
            </thead>

            <tbody>

              {!data.recentTransactions ||
              data.recentTransactions.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Belum ada transaksi.
                  </td>
                </tr>

              ) : (

                data.recentTransactions.map((transaction) => (

                  <tr
                    key={`${transaction.type}-${transaction.id}`}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >

                    <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                      {formatDate(transaction.transaction_date)}
                    </td>

                    <td className="px-6 py-4 text-sm whitespace-nowrap">

                      <span
                        className={
                          transaction.type === 'income'
                            ? 'inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium'
                            : 'inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-medium'
                        }
                      >
                        {transaction.type === 'income'
                          ? 'Pendapatan'
                          : 'Belanja'}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
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

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {transaction.description || '-'}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default Dashboard