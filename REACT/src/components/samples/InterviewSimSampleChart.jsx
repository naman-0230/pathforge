// InterviewSimSampleChart — visual tease of the interview simulation
// benefit for Free users. Shows "sim volume over 4 weeks" as a bar chart:
// Free user does 1/week (flat 1), Basic user does 3-4/week (rising bars).
// The visual instantly communicates "you're capped, they aren't."

export default function InterviewSimSampleChart() {
  const width = 240;
  const height = 60;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 44, padding: '4px 8px' }}>
      {/* Free tier bars — always 1 */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
        {[1, 1, 1, 1].map((h, i) => (
          <div
            key={`free-${i}`}
            style={{
              width: 8,
              height: h * 10,
              background: 'var(--text-low)',
              opacity: 0.4,
              borderRadius: '2px 2px 0 0',
            }}
            title="Free: 1 sim / week"
          />
        ))}
      </div>
      <div style={{ fontSize: 9, color: 'var(--text-low)', alignSelf: 'center' }}>vs</div>
      {/* Basic tier bars — 3, 4, 5, 4 (varied to look real) */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
        {[3, 4, 5, 4].map((h, i) => (
          <div
            key={`basic-${i}`}
            style={{
              width: 8,
              height: h * 8,
              background: 'var(--accent, #e8732d)',
              opacity: 0.85,
              borderRadius: '2px 2px 0 0',
            }}
            title="Basic: unlimited"
          />
        ))}
      </div>
      <div style={{ fontSize: 9, color: 'var(--text-low)', textAlign: 'center', width: '100%', position: 'absolute', bottom: 0, left: 0 }}>
        <span style={{ display: 'inline-block', marginRight: 40 }}>Free (1/wk)</span>
        <span style={{ color: 'var(--accent-mid, #e8732d)' }}>Basic (unlimited)</span>
      </div>
    </div>
  );
}