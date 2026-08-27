import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

function Incomes() {
const [incomes, setIncomes] = useState([])
const [budgets, setBudgets] = useState([])
const [categories, setCategories] = useState([])

const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [showForm, setShowForm] = useState(false)
const [saving, setSaving] = useState(false)

const [budgetId, setBudgetId] = useState('')
const [categoryId, setCategoryId] = useState('')
const [amount, setAmount] = useState('')
const [description, setDescription] = useState('')
const [transactionDate, setTransactionDate] = useState('')

const loadData = async () => {
try {
setLoading(true)
setError('')


  const [incomeResponse, budgetResponse, categoryResponse] =
    await Promise.all([
      apiRequest('/incomes'),
      apiRequest('/budgets'),
      apiRequest('/categories/income'),
    ])

  setIncomes(incomeResponse.data)
  setBudgets(budgetResponse.data)
  setCategories(categoryResponse.data)
} catch (error) {
  console.error('INCOME PAGE ERROR:', error)
  setError(error.message)
} finally {
  setLoading(false)
}


}

useEffect(() => {
loadData()
}, [])

const resetForm = () => {
setBudgetId('')
setCategoryId('')
setAmount('')
setDescription('')
setTransactionDate('')
setShowForm(false)
}

const handleSubmit = async (e) => {
e.preventDefault()


try {
  setSaving(true)
  setError('')

  await apiRequest('/incomes', {
    method: 'POST',
    body: JSON.stringify({
      budget_id: Number(budgetId),
      category_id: Number(categoryId),
      amount: Number(amount),
      description,
      transaction_date: transactionDate,
    }),
  })

  resetForm()
  await loadData()
} catch (error) {
  console.error('CREATE INCOME ERROR:', error)
  setError(error.message)
} finally {
  setSaving(false)
}


}

const handleDelete = async (income) => {
const confirmed = window.confirm(
'Apakah Anda yakin ingin menghapus pendapatan ini?'
)


if (!confirmed) {
  return
}

try {
  setError('')

  await apiRequest('/incomes/' + income.id, {
    method: 'DELETE',
  })

  await loadData()
} catch (error) {
  console.error('DELETE INCOME ERROR:', error)
  setError(error.message)
}


}

const formatRupiah = (value) => {
return new Intl.NumberFormat('id-ID', {
style: 'currency',
currency: 'IDR',
maximumFractionDigits: 0,
}).format(Number(value))
}

if (loading) {
return ( <div className="p-6"> <p className="text-slate-500">
Memuat data pendapatan... </p> </div>
)
}

return ( <div> <div className="flex items-center justify-between mb-6"> <div> <h2 className="text-2xl font-bold text-slate-900">
Pendapatan </h2>


      <p className="text-slate-500 mt-1">
        Kelola pendapatan keuangan desa
      </p>
    </div>

    <button
      type="button"
      onClick={() => setShowForm(!showForm)}
      className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
    >
      {showForm ? 'Tutup Form' : '+ Tambah Pendapatan'}
    </button>
  </div>

  {error && (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
      <p className="text-sm text-red-600">
        {error}
      </p>
    </div>
  )}

  {showForm && (
    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-5">
        Tambah Pendapatan
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Anggaran
            </label>

            <select
              value={budgetId}
              onChange={(e) => setBudgetId(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">
                Pilih anggaran
              </option>

              {budgets.map((budget) => (
                <option
                  key={budget.id}
                  value={budget.id}
                >
                  {budget.year} - {budget.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Kategori Pendapatan
            </label>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">
                Pilih kategori
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Jumlah
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              required
              placeholder="Contoh: 50000000"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tanggal Transaksi
            </label>

            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Keterangan
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Keterangan pendapatan..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-3 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-3 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Pendapatan'}
          </button>
        </div>
      </form>
    </div>
  )}

  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-5 py-4 text-sm font-semibold text-slate-700">
              Tanggal
            </th>

            <th className="text-left px-5 py-4 text-sm font-semibold text-slate-700">
              Anggaran
            </th>

            <th className="text-left px-5 py-4 text-sm font-semibold text-slate-700">
              Kategori
            </th>

            <th className="text-right px-5 py-4 text-sm font-semibold text-slate-700">
              Jumlah
            </th>

            <th className="text-left px-5 py-4 text-sm font-semibold text-slate-700">
              Keterangan
            </th>

            <th className="text-right px-5 py-4 text-sm font-semibold text-slate-700">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody>
          {incomes.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="px-5 py-8 text-center text-slate-500"
              >
                Belum ada data pendapatan.
              </td>
            </tr>
          ) : (
            incomes.map((income) => (
              <tr
                key={income.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-5 py-4 text-sm text-slate-700">
                  {income.transaction_date}
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  <div className="font-medium text-slate-900">
                    {income.budget_name}
                  </div>

                  <div className="text-xs text-slate-500">
                    Tahun {income.budget_year}
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  {income.category_name}
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-emerald-600 text-right">
                  {formatRupiah(income.amount)}
                </td>

                <td className="px-5 py-4 text-sm text-slate-500">
                  {income.description || '-'}
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(income)}
                    className="text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
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

export default Incomes
