import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

function PublicDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [budgets, setBudgets] = useState([])
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
  Promise.all([
    apiRequest('/public/summary'),
    apiRequest('/public/budgets'),
    apiRequest('/public/transactions'),
  ])
    .then(([summaryResponse, budgetsResponse, transactionsResponse]) => {
      console.log('PUBLIC SUMMARY API:', summaryResponse)
      console.log('PUBLIC BUDGETS API:', budgetsResponse)
      console.log('PUBLIC TRANSACTIONS API:', transactionsResponse)

      setData(summaryResponse.data)
      setBudgets(budgetsResponse.data)
      setTransactions(transactionsResponse.data)
    })
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">
          Memuat data transparansi...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="text-red-600">
            Error: {error}
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
    <div className="min-h-screen bg-slate-50">

      <header className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold">
            DesaFinance
          </h1>

          <p className="text-slate-300 mt-1">
            Transparansi Keuangan Desa
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Transparansi Keuangan
          </h2>

          <p className="text-slate-500 mt-2">
            Informasi keuangan desa yang dapat diakses oleh masyarakat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">
              Total Anggaran
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              {formatRupiah(data.totalBudget)}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">
              Total Pendapatan
            </p>

            <p className="text-2xl font-bold text-emerald-600 mt-2">
              {formatRupiah(data.totalIncome)}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">
              Total Belanja
            </p>

            <p className="text-2xl font-bold text-red-600 mt-2">
              {formatRupiah(data.totalExpense)}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">
              Sisa Anggaran
            </p>

            <p className="text-2xl font-bold text-violet-600 mt-2">
              {formatRupiah(data.remainingBudget)}
            </p>
          </div>

        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 mt-6">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Realisasi Anggaran
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Persentase anggaran yang telah digunakan untuk belanja.
              </p>
            </div>

            <span className="text-lg font-bold text-slate-900">
              {percentage.toFixed(1)}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex justify-between mt-3 text-sm text-slate-500">
            <span>
              Terpakai: {formatRupiah(data.totalExpense)}
            </span>

            <span>
              Anggaran: {formatRupiah(data.totalBudget)}
            </span>
          </div>

        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mt-6">

          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Anggaran Desa
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Daftar anggaran yang tersedia.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    Tahun
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    Nama Anggaran
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                    Total
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    Keterangan
                  </th>

                </tr>
              </thead>

              <tbody>
                {budgets.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      Belum ada data anggaran.
                    </td>
                  </tr>
                ) : (
                  budgets.map((budget) => (
                    <tr
                      key={budget.id}
                      className="border-b border-slate-100 last:border-0"
                    >

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {budget.year}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {budget.name}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">
                        {formatRupiah(budget.total_amount)}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {budget.description || '-'}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mt-6">

          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Transaksi Keuangan
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Riwayat pendapatan dan belanja desa.
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
                {transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      Belum ada transaksi.
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr
                      key={transaction.type + transaction.id}
                      className="border-b border-slate-100 last:border-0"
                    >

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {new Date(transaction.transaction_date).toLocaleDateString(
                          'id-ID'
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <span
                          className={
                            transaction.type === 'income'
                              ? 'text-emerald-600 font-medium'
                              : 'text-red-600 font-medium'
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

                      <td className="px-6 py-4 text-sm font-semibold text-right">
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

      </main>
    </div>
  )
}

export default PublicDashboard