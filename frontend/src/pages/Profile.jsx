import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

function Profile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    name: '',
    code: '',
    address: '',
    village_head: '',
    phone: '',
    email: '',
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await apiRequest('/profile')

      setForm({
        name: response.data.name || '',
        code: response.data.code || '',
        address: response.data.address || '',
        village_head: response.data.village_head || '',
        phone: response.data.phone || '',
        email: response.data.email || '',
      })
    } catch (error) {
      console.error('PROFILE ERROR:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      await apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(form),
      })

      setSuccess('Profil desa berhasil diperbarui.')
    } catch (error) {
      console.error('UPDATE PROFILE ERROR:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">
          Memuat profil desa...
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Profil Desa
        </h2>

        <p className="text-slate-500 mt-1">
          Kelola informasi dasar desa yang ditampilkan kepada masyarakat.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-emerald-600">
            {success}
          </p>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Desa
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kode Desa
              </label>

              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Alamat
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kepala Desa
              </label>

              <input
                type="text"
                name="village_head"
                value={form.village_head}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nomor Telepon
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Desa
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-3 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Profile