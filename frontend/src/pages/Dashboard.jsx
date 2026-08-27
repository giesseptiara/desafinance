import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/dashboard')
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
      <div className="p-6">
        <p className="text-slate-500">
          Memuat dashboard...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">
            Error: {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h2>

        <p className="text-slate-500 mt-1">
          Ringkasan keuangan desa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">
            Total Anggaran
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-2">
            {formatRupiah(data.totalBudget)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">
            Total Pendapatan
          </p>

          <p className="text-2xl font-bold text-emerald-600 mt-2">
            {formatRupiah(data.totalIncome)}
          </p>

          <p className="text-xs text-slate-500 mt-2">
            {data.totalIncomeTransactions} transaksi
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">
            Total Belanja
          </p>

          <p className="text-2xl font-bold text-red-600 mt-2">
            {formatRupiah(data.totalExpense)}
          </p>

          <p className="text-xs text-slate-500 mt-2">
            {data.totalExpenseTransactions} transaksi
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">
            Saldo
          </p>

          <p className="text-2xl font-bold text-blue-600 mt-2">
            {formatRupiah(data.balance)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
  <p className="text-sm text-slate-500">
    Sisa Anggaran
  </p>

  <p className="text-2xl font-bold text-violet-600 mt-2 break-words">
  {formatRupiah(data.remainingBudget)}
</p>
</div>

      </div>
    </div>
  )
}

export default Dashboard