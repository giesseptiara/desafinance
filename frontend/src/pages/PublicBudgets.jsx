
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api'

function PublicBudgets() {
  const [budgets, setBudgets] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  const limit = 10

  useEffect(() => {
    setLoading(true)
    setError('')

    apiRequest(`/public/budgets?page=${page}&limit=${limit}`)
      .then((response) => {
        setBudgets(response.data)
        setPagination(response.pagination)
      })
      .catch((error) => {
        console.error('PUBLIC BUDGETS ERROR:', error)
        setError(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page])

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value))
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-6">

          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold">
              DesaFinance
            </h1>

            <p className="text-slate-300 mt-1">
              Transparansi Keuangan Desa
            </p>
          </Link>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        <div className="mb-6">
          <Link
            to="/"
            className="text-sm text-violet-600 hover:text-violet-800"
          >
            ← Kembali ke Transparansi
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Anggaran Desa
          </h2>

          <p className="text-slate-500 mt-2">
            Daftar anggaran keuangan desa yang dapat dilihat masyarakat.
          </p>
        </div>

        {loading && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-slate-500">
              Memuat data anggaran...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="text-red-600">
              Error: {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

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
                          className="px-6 py-10 text-center text-slate-500"
                        >
                          Belum ada data anggaran.
                        </td>
                      </tr>
                    ) : (
                      budgets.map((budget) => (
                        <tr
                          key={budget.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
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

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">

                <p className="text-sm text-slate-500">
                  Halaman {pagination.page} dari {pagination.totalPages}
                </p>

                <div className="flex gap-2">

                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((current) => current - 1)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                  >
                    ← Sebelumnya
                  </button>

                  <button
                    type="button"
                    disabled={page === pagination.totalPages}
                    onClick={() => setPage((current) => current + 1)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                  >
                    Berikutnya →
                  </button>

                </div>

              </div>
            )}

          </>
        )}

      </main>
    </div>
  )
}

export default PublicBudgets

