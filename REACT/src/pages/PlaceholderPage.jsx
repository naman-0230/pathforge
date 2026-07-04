// Temporary stand-in for pages we haven't converted yet (Dashboard, Roadmap, Onboarding,
// Problem, Landing). Each will be replaced with its real component as we go through
// the build order. This just keeps every route working in the meantime.
export default function PlaceholderPage({ title }) {
  return (
    <div style={{ padding: 48, color: 'var(--text-mid)' }}>
      <h1 style={{ color: 'var(--text-high)', marginBottom: 8 }}>{title}</h1>
      <p>This page hasn't been converted to React yet — coming up next in the build order.</p>
    </div>
  );
}
