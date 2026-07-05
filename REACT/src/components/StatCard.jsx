// StatCard — one of the 4 top cards (Problems solved, Current streak, etc).
// `delta` is optional small text under the number, `deltaType` controls its color
// via the existing .stat-delta.positive / .neutral classes from dashboard.css.
export default function StatCard({ label, value, delta, deltaType = 'neutral' }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {delta && <div className={`stat-delta ${deltaType}`}>{delta}</div>}
    </div>
  );
}
