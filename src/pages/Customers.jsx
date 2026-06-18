import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import AdminSidebar from '../components/AdminSidebar'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError('')
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (ignore) return
      if (error) setError(error.message)
      else setCustomers(data || [])
      setLoading(false)
    }

    load()
    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <section className="admin-content">
        <div className="section-head">
          <h1>Customer ledger</h1>
          <p>Checkout records created by the product detail page.</p>
        </div>

        {error ? <div className="notice notice-error">{error}</div> : null}

        <div className="panel table-panel">
          {loading ? (
            <div className="empty-state">Loading customers…</div>
          ) : customers.length === 0 ? (
            <div className="empty-state">No customers found.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Client name</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name || 'N/A'}</td>
                      <td>{customer.phone || 'N/A'}</td>
                      <td className="truncate">{customer.address || 'N/A'}</td>
                      <td>{customer.created_at ? new Date(customer.created_at).toLocaleString() : '-'}</td>
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
