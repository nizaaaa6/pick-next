import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import VideoCard from '../components/VideoCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError('')
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (ignore) return
      if (error) setError(error.message)
      else setProducts(data || [])
      setLoading(false)
    }

    load()
    return () => {
      ignore = true
    }
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return products
    return products.filter((product) =>
      [product.name, product.category, product.video_title]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term)),
    )
  }, [products, query])

  const featuredVideos = filtered.filter((product) => product.video_url)

  return (
    <div className="stack">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">React + Vite migration</span>
          <h1>Discover your next favorite product in a cleaner, faster storefront.</h1>
          <p>
            The old static pages are now rebuilt as a routed React experience with the same
            Supabase-backed catalog, checkout flow, admin controls, and customer table.
          </p>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#catalog">Browse catalog</a>
            <Link className="btn btn-secondary" to="/admin">Open admin</Link>
          </div>
        </div>

        <div className="hero-panel">
          <img src="/assets/shose1.webp" alt="Featured product" className="hero-image" />
          <div className="hero-overlay">
            <strong>Luxury catalog</strong>
            <span>Products • videos • orders</span>
          </div>
        </div>
      </section>

      <section className="toolbar" id="catalog">
        <div>
          <h2>Featured catalog</h2>
          <p>Search through the live product inventory pulled from Supabase.</p>
        </div>

        <label className="search">
          <span>Search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, category, or video title"
          />
        </label>
      </section>

      {error ? <div className="notice notice-error">Database load error: {error}</div> : null}

      {loading ? (
        <div className="empty-state">Loading products…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No products found.</div>
      ) : (
        <section className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}

      <section className="section-head">
        <h2>Showcase videos</h2>
        <p>Any product with a public video URL will appear here automatically.</p>
      </section>

      {featuredVideos.length === 0 ? (
        <div className="empty-state">No video showreels attached yet.</div>
      ) : (
        <section className="video-grid">
          {featuredVideos.map((product) => (
            <VideoCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </div>
  )
}
