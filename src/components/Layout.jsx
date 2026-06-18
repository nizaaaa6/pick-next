import { Outlet, Link, NavLink } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">✦</span>
          <span>
            <strong>Pick Next</strong>
            <small>Luxury storefront</small>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          <NavLink to="/customers">Customers</NavLink>
        </nav>
      </header>

      <main className="page">
        <Outlet />
      </main>

      <footer className="footer">
        <div>
          <strong>Pick Next</strong>
          <p>React + Vite migration of the original storefront.</p>
        </div>
        <p>Built for products, showcase videos, orders, and customer records.</p>
      </footer>
    </div>
  )
}
