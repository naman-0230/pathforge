import { getHeatmapCells } from '../utils/activity.js';

// ActivityHeatmap — uses the .heatmap / .hcell / .h0-.h4 classes that were
// already defined in global.css but never actually used anywhere yet. Each
// cell is one day; color intensity = how many problems were solved that day.
export default function ActivityHeatmap({ numDays = 119 }) {
  const cells = getHeatmapCells(numDays);

  return (
    <div>
      <div className="heatmap">
        {cells.map((cell) => (
          <div
            key={cell.date}
            className={`hcell h${cell.level}`}
            title={`${cell.date}: ${cell.count} problem${cell.count === 1 ? '' : 's'} solved`}
          />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 11, color: 'var(--text-low)' }}>
        <span>Less</span>
        <div className="hcell h0" />
        <div className="hcell h1" />
        <div className="hcell h2" />
        <div className="hcell h3" />
        <div className="hcell h4" />
        <span>More</span>
      </div>
    </div>
  );
}