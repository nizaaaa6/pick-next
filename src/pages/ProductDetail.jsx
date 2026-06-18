import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (ignore) return

      if (error) setError(error.message)
      else setProduct(data)
      setLoading(false)
    }

    if (id) load()
    return () => {
      ignore = true
    }
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!product) return

    setSubmitting(true)
    setError('')

    try {
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert([form])
        .select()
        .single()

      if (customerError) throw customerError

      const { error: orderError } = await supabase.from('orders').insert([
        {
          product_id: product.id,
          customer_id: customer.id,
        },
      ])

      if (orderError) throw orderError

      alert('Order submitted successfully.')
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed to submit order.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="empty-state">Loading product…</div>
  }

  if (!product) {
    return (
      <div className="empty-state">
        <p>Product not found.</p>
        <Link className="btn btn-primary" to="/">Back to home</Link>
      </div>
    )
  }

  return (
    <div className="detail-layout">
      <section className="detail-media">
        <img
          src={product.image_url || '/assets/shoes.jpg'}
          alt={product.name}
          className="detail-image"
        />
        {product.video_url ? (
          <video src={product.video_url} controls className="detail-video" />
        ) : null}
      </section>

      <section className="detail-card">
        <Link className="back-link" to="/">← Return to gallery</Link>
        <span className="pill">{product.category || 'Curated'}</span>
        <h1>{product.name}</h1>
        <p className="price">₹{Number(product.price || 0).toLocaleString('en-IN')}</p>
        <p className="detail-copy">
          {product.video_title || 'A premium item designed for a modern storefront experience.'}
        </p>

        <form className="order-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Jane Doe"
            />
          </label>

          <label>
            Phone number
            <input
              required
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="9876543210"
            />
          </label>

          <label>
            Delivery address
            <textarea
              required
              rows={4}
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Street, city, postal code"
            />
          </label>

          {error ? <div className="notice notice-error">{error}</div> : null}

          <button className="btn btn-primary btn-full" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Confirm & submit order'}
          </button>
        </form>
      </section>
    </div>
  )
}
