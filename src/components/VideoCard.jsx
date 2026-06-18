export default function VideoCard({ product }) {
  return (
    <article className="video-card">
      <video
        src={product.video_url}
        controls
        className="video-element"
        poster={product.image_url || '/assets/shoes.jpg'}
      />
      <div className="video-caption">
        <strong>{product.video_title || product.name}</strong>
        <span>{product.category || 'Showcase'}</span>
      </div>
    </article>
  )
}
