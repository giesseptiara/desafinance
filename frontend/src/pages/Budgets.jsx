import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

function Budgets() {
const [budgets, setBudgets] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [showForm, setShowForm] = useState(false)
const [editingId, setEditingId] = useState(null)

const [year, setYear] = useState('')
const [name, setName] = useState('')
const [totalAmount, setTotalAmount] = useState('')
const [description, setDescription] = useState('')

const loadBudgets = async () => {
try {
setLoading(true)
setError('')


  const response = await apiRequest('/budgets')

  setBudgets(response.data)
} catch (error) {
  console.error('BUDGET ERROR:', error)
  setError(error.message)
} finally {
  setLoading(false)
}


}

useEffect(() => {
loadBudgets()
}, [])

const resetForm = () => {
setYear('')
setName('')
setTotalAmount('')
setDescription('')
setEditingId(null)
setShowForm(false)
}

const handleSubmit = async (e) => {
e.preventDefault()


try {
  setError('')

  const body = {
    year: Number(year),
    name,
    total_amount: Number(totalAmount),
    description,
  }

  if (editingId) {
    await apiRequest('/budgets/' + editingId, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  } else {
    await apiRequest('/budgets', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  resetForm()
  await loadBudgets()
} catch (error) {
  console.error('SAVE BUDGET ERROR:', error)
  setError(error.message)
}


}

const handleEdit = (budget) => {
setEditingId(budget.id)
setYear(budget.year)
setName(budget.name)
setTotalAmount(budget.total_amount)
setDescription(budget.description || '')
setShowForm(true)
}

const handleDelete = async (budget) => {
const confirmed = window.confirm(
'Apakah Anda yakin ingin menghapus anggaran "' +
budget.name +
'"?'
)

if (!confirmed) {
return
}

try {
setError('')


await apiRequest('/budgets/' + budget.id, {
  method: 'DELETE',
})

await loadBudgets()


} catch (error) {
console.error('DELETE BUDGET ERROR:', error)


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
Memuat data anggaran... </p> </div>
)
}

return ( <div> <div className="flex items-center justify-between mb-6"> <div> <h2 className="text-2xl font-bold text-slate-900">
Anggaran </h2>


      <p className="text-slate-500 mt-1">
        Kelola anggaran keuangan desa
      </p>
    </div>

    <button
      type="button"
      onClick={() => {
        if (showForm) {
          resetForm()
        } else {
          setShowForm(true)
        }
      }}
      className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
    >
      {showForm ? 'Tutup Form' : '+ Tambah Anggaran'}
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
        {editingId ? 'Edit Anggaran' : 'Tambah Anggaran'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tahun
            </label>

            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="2000"
              max="2100"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nama Anggaran
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Total Anggaran
          </label>

          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            min="0"
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Deskripsi
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
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
            className="px-5 py-3 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
          >
            {editingId ? 'Update Anggaran' : 'Simpan Anggaran'}
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
              Tahun
            </th>

            <th className="text-left px-5 py-4 text-sm font-semibold text-slate-700">
              Nama Anggaran
            </th>

            <th className="text-right px-5 py-4 text-sm font-semibold text-slate-700">
              Total Anggaran
            </th>

            <th className="text-left px-5 py-4 text-sm font-semibold text-slate-700">
              Deskripsi
            </th>

            <th className="text-right px-5 py-4 text-sm font-semibold text-slate-700">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody>
          {budgets.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="px-5 py-8 text-center text-slate-500"
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
                <td className="px-5 py-4 text-sm text-slate-700">
                  {budget.year}
                </td>

                <td className="px-5 py-4 text-sm font-medium text-slate-900">
                  {budget.name}
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-slate-900 text-right">
                  {formatRupiah(budget.total_amount)}
                </td>

                <td className="px-5 py-4 text-sm text-slate-500">
                  {budget.description || '-'}
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-3">
  <button
    type="button"
    onClick={() => handleEdit(budget)}
    className="text-sm font-medium text-blue-600 hover:text-blue-800"
  >
    Edit
  </button>

            <button
            type="button"
            onClick={() => handleDelete(budget)}
            className="text-sm font-medium text-red-600 hover:text-red-800"

            >


            Hapus


            </button>
            </div>

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

export default Budgets
