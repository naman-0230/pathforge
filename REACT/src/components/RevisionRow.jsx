import Button from './Button';

// RevisionRow — one row in "Revision due". `dueNow` controls whether the button
// is a real, clickable "Revise →" or the dimmed "In X days" state.
export default function RevisionRow({ topic, meta, dueNow, label, onRevise }) {
  return (
    <div className="revision-row">
      <div>
        <div className="prob-name">{topic}</div>
        <div className="prob-meta">{meta}</div>
      </div>
      <Button size="sm" style={!dueNow ? { opacity: 0.5 } : undefined} onClick={dueNow ? onRevise : undefined}>
        {label}
      </Button>
    </div>
  );
}
