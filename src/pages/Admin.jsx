import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import AdminSidebar from '../components/AdminSidebar'
import StatCard from '../components/StatCard'

const emptyForm = {
  name: '',
  price: '',
  category: '',
  video_title: '',
}

async function uploadFile(bucket, file) {
  const safeName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
  const { error } = await supabase.storage.from(bucket).upload(safeName, file)
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(safeName)
  return data.publicUrl
}

export default function Admin() {
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [message, setMessage] = useState('')

  async function loadAll() {
    setLoading(true)

    const [productsResult, customersResult, ordersResult] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('customers').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
    ])

    if (productsResult.error) setMessage(productsResult.error.message)
    else setProducts(productsResult.data || [])

    setStats({
      products: productsResult.data?.length || 0,
      customers: customersResult.count || 0,
      orders: ordersResult.count || 0,
    })

    setLoading(false)
  }

  useEffect(() => {
    loadAll()
  }, [])

  const title = useMemo(() => (editId ? 'Edit product' : 'Add product'), [editId])

  function resetForm() {
    setForm(emptyForm)
    setImageFile(null)
    setVideoFile(null)
    setEditId(null)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      if (!form.name.trim() || !form.price || !form.category.trim()) {
        throw new Error('Name, price, and category are required.')
      }

      let imageUrl = null
      let videoUrl = null

      if (imageFile) imageUrl = await uploadFile('product-images', imageFile)
      if (videoFile) videoUrl = await uploadFile('product-videos', videoFile)

      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        video_title: form.video_title.trim() || null,
      }

      if (imageUrl) payload.image_url = imageUrl
      if (videoUrl) payload.video_url = videoUrl
      if (!editId) {
        payload.image_url ??= null
        payload.video_url ??= null
      }

      const result = editId
        ? await supabase.from('products').update(payload).eq('id', editId)
        : await supabase.from('products').insert([payload])

      if (result.error) throw result.error

      alert(editId ? 'Product updated successfully.' : 'Product added successfully.')
      resetForm()
      loadAll()
    } catch (err) {
      setMessage(err.message || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(product) {
    setEditId(product.id)
    setForm({
      name: product.name || '',
      price: product.price ?? '',
      category: product.category || '',
      video_title: product.video_title || '',
    })
    setImageFile(null)
    setVideoFile(null)
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function removeProduct(id) {
    if (!confirm('Delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      setMessage(error.message)
      return
    }
    loadAll()
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <section className="admin-content">
        <div className="section-head">
          <h1>Dashboard</h1>
          <p>Manage the full product catalog directly from React.</p>
        </div>

        <div className="stats-grid">
          <StatCard label="Products" value={stats.products} />
          <StatCard label="Orders" value={stats.orders} tone="violet" />
          <StatCard label="Customers" value={stats.customers} tone="mint" />
        </div>

        <form className="panel form-panel" onSubmit={handleSave}>
          <div className="panel-title">
            <h2>{title}</h2>
            {editId ? <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel edit</button> : null}
          </div>

          <div className="form-grid">
            <label>
              Product name
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Product name"
              />
            </label>

            <label>
              Price
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                placeholder="0"
              />
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              >
                <option value="">Select category</option>
                <option value="Ring">Ring</option>
                <option value="Necklace">Necklace</option>
                <option value="Keychain">Keychain</option>
              </select>
            </label>

            <label>
              Showcase title
              <input
                value={form.video_title}
                onChange={(e) => setForm((p) => ({ ...p, video_title: e.target.value }))}
                placeholder="Optional video title"
              />
            </label>
          </div>

          <div className="form-grid">
            <label>
              Product image
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </label>

            <label>
              Product video
              <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          {message ? <div className="notice notice-error">{message}</div> : null}

          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save product'}
          </button>
        </form>

        <div className="panel table-panel">
          <div className="panel-title">
            <h2>Current inventory</h2>
          </div>

          {loading ? (
            <div className="empty-state">Loading inventory…</div>
          ) : products.length === 0 ? (
            <div className="empty-state">No products found.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Video title</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.image_url || '/assets/shoes.jpg'}
                          alt={product.name}
                          className="table-thumb"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category || 'N/A'}</td>
                      <td>₹{Number(product.price || 0).toLocaleString('en-IN')}</td>
                      <td>{product.video_title || 'None'}</td>
                      <td>
                        <div className="row-actions">
                          <button className="btn btn-secondary" type="button" onClick={() => startEdit(product)}>
                            Edit
                          </button>
                          <button className="btn btn-danger" type="button" onClick={() => removeProduct(product.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
