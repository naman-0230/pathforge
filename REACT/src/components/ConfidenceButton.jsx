// ConfidenceButton — one of the 4 confidence rating options.
// `value` is 1-4, matching your confidence self-rating feature spec directly —
// this is the exact value that will feed the weak point detection engine later.
export default function ConfidenceButton({ value, label, selected, onClick }) {
  return (
    <button
      type="button"
      className={`conf-btn ${selected ? 'selected' : ''}`}
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );
}
