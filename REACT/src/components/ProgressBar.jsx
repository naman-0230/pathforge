// ProgressBar — wraps .progress-bar / .progress-fill from global.css.
// `percent` (0-100) drives the fill width directly, replacing manual inline styles.
// Usage: <ProgressBar percent={34} />
export default function ProgressBar({ percent = 0, height, color }) {
  const barStyle = height ? { height } : undefined;
  const fillStyle = {
    width: `${Math.max(0, Math.min(100, percent))}%`,
    ...(color ? { background: color } : {}),
  };
  return (
    <div className="progress-bar" style={barStyle}>
      <div className="progress-fill" style={fillStyle}></div>
    </div>
  );
}
