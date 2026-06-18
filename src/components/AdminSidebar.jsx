import { NavLink } from 'react-router-dom'

export default function AdminSidebar() {
  return (
    <aside className="sidebar">
      <div>
        <h2>Pick Next Admin</h2>
        <p>Manage products, customers, and orders.</p>
      </div>

      <nav className="sidebar-links">
        <NavLink to="/admin" end>Dashboard / Products</NavLink>
        <NavLink to="/customers">Customers</NavLink>
      </nav>
    </aside>
  )
}
