import Badge from './Badge';
import ProgressBar from './ProgressBar';

// TopicProgressRow — one row in "Topic progress". Previously each row had a
// hardcoded inline `width:80%` — now `percent` is calculated from real solved/total
// counts, so this component is the actual place your roadmap engine's numbers land.
export default function TopicProgressRow({ name, solved, total, statusLabel, statusType, barColor }) {
  const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div className="topic-prog-row">
      <span className="tname">{name}</span>
      <div style={{ flex: 1 }}>
        <ProgressBar percent={percent} color={barColor} />
      </div>
      <span className="tcount">{solved}/{total}</span>
      <Badge type={statusType}>{statusLabel}</Badge>
    </div>
  );
}
