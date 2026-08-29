import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api'

function PublicTransactions() {
  const [transactions, setTransactions] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [page, setPage] = useState(1)
  const [year, setYear] = useState('')
  const [type, setType] = useState('')
  const [years, setYears] = useState([])

  const limit = 10

  useEffect(() => {
  apiRequest('/public/transaction-years')
    .then((response) => {
      setYears(response.data)
    })
    .catch((error) => {
      console.error('PUBLIC TRANSACTION YEARS ERROR:', error)
    })
}, [])

  useEffect(() => {
    setLoading(true)
    setError('')

    const params = new URLSearchParams()

    params.set('page', page)
    params.set('limit', limit)

    if (year) {
      params.set('year', year)
    }

    if (type) {
      params.set('type', type)
    }

    apiRequest(`/public/transactions?${params.toString()}`)
      .then((response) => {
        console.log('PUBLIC TRANSACTIONS API:', response)

        setTransactions(response.data)
        setPagination(response.pagination)
      })
      .catch((error) => {
        console.error('PUBLIC TRANSACTIONS ERROR:', error)
        setError(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, year, type])

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value))
  }

  const formatDate = (value) => {
    return new Date(value).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleYearChange = (event) => {
    setYear(event.target.value)
    setPage(1)
  }

  const handleTypeChange = (event) => {
    setType(event.target.value)
    setPage(1)
  }

  const resetFilter = () => {
    setYear('')
    setType('')
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
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

        {/* Back */}
        <div className="mb-6">
          <Link
            to="/"
            className="text-sm text-violet-600 hover:text-violet-800"
          >
            ← Kembali ke Transparansi
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Transaksi Keuangan
          </h2>

          <p className="text-slate-500 mt-2">
            Riwayat pendapatan dan belanja desa yang dapat diakses masyarakat.
          </p>
        </div>

        {/* Filter */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">

          <div className="flex flex-col md:flex-row md:items-end gap-4">

            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tahun
              </label>

              <select
                value={year}
                onChange={handleYearChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">
                  Semua Tahun
                </option>

                {years.map((item) => (
  <option key={item} value={item}>
    {item}
  </option>
))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Jenis Transaksi
              </label>

              <select
                value={type}
                onChange={handleTypeChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">
                  Semua Transaksi
                </option>

                <option value="income">
                  Pendapatan
                </option>

                <option value="expense">
                  Belanja
                </option>
              </select>
            </div>

            <button
              type="button"
              onClick={resetFilter}
              className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Reset Filter
            </button>

          </div>

        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <p className="text-slate-500">
              Memuat transaksi...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="text-red-600">
              Error: {error}
            </p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

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
                          className="px-6 py-12 text-center text-slate-500"
                        >
                          Tidak ada transaksi yang sesuai dengan filter.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((transaction) => (
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

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">

                <p className="text-sm text-slate-500">
                  Menampilkan halaman {pagination.page} dari{' '}
                  {pagination.totalPages}
                  {' '}({pagination.total} transaksi)
                </p>

                <div className="flex gap-2">

                  <button
                    type="button"
                    disabled={pagination.page === 1}
                    onClick={() => setPage((current) => current - 1)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                  >
                    ← Sebelumnya
                  </button>

                  <button
                    type="button"
                    disabled={
                      pagination.page === pagination.totalPages
                    }
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

export default PublicTransactions