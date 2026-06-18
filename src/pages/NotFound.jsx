import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="empty-state">
      <h1>Page not found</h1>
      <p>The route you opened does not exist.</p>
      <Link className="btn btn-primary" to="/">Go home</Link>
    </div>
  )
}
