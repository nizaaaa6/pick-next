import { Link } from 'react-router-dom'

function money(value) {
  const num = Number(value || 0)
  return `₹${Number.isFinite(num) ? num.toLocaleString('en-IN') : '0'}`
}

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.image_url || '/assets/shoes.jpg'}
          alt={product.name}
          className="product-image"
        />
      </div>

      <div className="product-body">
        <div className="product-meta">
          <span className="pill">{product.category || 'Curated'}</span>
          {product.video_url ? <span className="pill pill-soft">Video</span> : null}
        </div>

        <h3>{product.name}</h3>
        <p>{product.video_title || 'Elegant product ready for your store.'}</p>

        <div className="product-bottom">
          <strong>{money(product.price)}</strong>
          <Link className="btn btn-primary" to={`/product/${product.id}`}>
            View details
          </Link>
        </div>
      </div>
    </article>
  )
}
