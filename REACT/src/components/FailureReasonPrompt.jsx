// FailureReasonPrompt — modal shown before a user views the solution,
// capturing WHY they gave up. One tap = save + continue (no confirm
// button, no submit friction). Skip is available but discouraged
// visually (small text link vs. prominent buttons).
//
// PROPS:
//   onSelect(reason) — called when user picks a reason. Reason is one of
//                      the REASON_KEYS values. Parent should record it
//                      to the current attempt and proceed to show solution.
//   onSkip()         — called when user clicks Skip. Peek still gets
//                      recorded (that's tracked elsewhere), just without
//                      a reason attached. Parent should proceed to solution.
//
// The five categories are deliberately chosen to be actionable:
//   'pattern'        → do more pattern training
//   'implementation' → practice coding execution / re-solve problem
//   'edge-case'      → note the missed edge case, revisit later
//   'time'           → try again on a fresh sitting
//   'compare'        → benign, wanted to see alternate approaches
// "Other" is deliberately NOT an option — forcing users into one of these
// five is the WHOLE point. "Other" would defeat the categorical analytics.

export const REASONS = [
  {
    key: 'pattern',
    emoji: '🧭',
    label: "Didn't recognize the pattern",
    description: "I wasn't sure which technique applied",
  },
  {
    key: 'implementation',
    emoji: '⚙️',
    label: 'Knew pattern, wrong implementation',
    description: "I had the right idea but couldn't code it",
  },
  {
    key: 'edge-case',
    emoji: '🎯',
    label: 'Missed an edge case',
    description: 'My solution failed on a specific input',
  },
  {
    key: 'time',
    emoji: '⏱️',
    label: 'Ran out of time',
    description: 'I could have solved it with more time',
  },
  {
    key: 'compare',
    emoji: '👀',
    label: 'Wanted to compare approaches',
    description: 'I solved it but curious about other ways',
  },
];

export default function FailureReasonPrompt({ onSelect, onSkip }) {
  return (
    <div
      className="failure-prompt-overlay"
      onClick={(e) => {
        // Click on backdrop = skip (same as explicit skip button)
        if (e.target === e.currentTarget) onSkip();
      }}
    >
      <div className="failure-prompt-modal">
        <div className="failure-prompt-header">
          <div className="failure-prompt-title">
            What made you open the solution?
          </div>
          <div className="failure-prompt-subtitle">
            One tap. Helps you see where your time is best spent.
          </div>
        </div>

        <div className="failure-prompt-options">
          {REASONS.map((r) => (
            <button
              key={r.key}
              className="failure-prompt-option"
              onClick={() => onSelect(r.key)}
              type="button"
            >
              <span className="failure-prompt-option-emoji">{r.emoji}</span>
              <div className="failure-prompt-option-body">
                <div className="failure-prompt-option-label">{r.label}</div>
                <div className="failure-prompt-option-description">{r.description}</div>
              </div>
            </button>
          ))}
        </div>

        <button
          className="failure-prompt-skip"
          onClick={onSkip}
          type="button"
        >
          Skip — just show me the solution
        </button>
      </div>
    </div>
  );
}