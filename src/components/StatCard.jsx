export default function StatCard({ label, value, tone = 'pink' }) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}
