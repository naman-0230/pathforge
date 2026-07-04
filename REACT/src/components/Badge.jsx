// Badge — used for difficulty tags (Easy/Medium/Hard), status labels, topic pills.
// `type` maps directly to the badge-* classes already in global.css — no new CSS needed.
// Usage: <Badge type="green">Easy</Badge>
export default function Badge({ type = 'gray', pill = false, children }) {
  const classes = ['badge', `badge-${type}`, pill ? 'badge-pill' : ''].join(' ').trim();
  return <span className={classes}>{children}</span>;
}
