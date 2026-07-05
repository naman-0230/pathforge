// TopicChip — one selectable topic in onboarding step 1.
// OLD: onclick="toggleTopic(this)" toggled a class directly on the clicked element.
// NEW: `selected` is read from the parent's selectedTopics array/state.
export default function TopicChip({ icon, label, selected, onClick }) {
  return (
    <div className={`topic-chip ${selected ? 'selected' : ''}`} onClick={onClick}>
      <span className="topic-icon">{icon}</span> {label}
      <span className="topic-check">✓</span>
    </div>
  );
}
