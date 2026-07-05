import Badge from './Badge';
import ProgressBar from './ProgressBar';

const STATUS_BAR_COLORS = {
  green: 'var(--green)',
  amber: 'var(--amber)',
   done: 'var(--green-bright, var(--green))',
  red: 'var(--red)',
  gray: 'var(--text-low)',
};

export default function TopicProgressRow({ name, solved, total, statusLabel, statusType }) {
  const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
  const barColor = STATUS_BAR_COLORS[statusType] || 'var(--orange)';

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