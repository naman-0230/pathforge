import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import HintItem from '../components/HintItem';
import ConfidenceButton from '../components/ConfidenceButton';
import '../styles/app.css';
import '../styles/problem.css';

// ProblemPage — converted from problem.html. This is the most state-heavy page,
// since almost everything here was manual DOM manipulation in the original script tag.
// Every piece of that old script has a direct state equivalent below — see comments
// at each spot. This version is hardcoded to the "Two Sum" example problem;
// once the backend exists, `problemData` and `hints` below get replaced by a
// fetch based on the :id route param (useParams()).

const hints = [
  { number: 1, unlockedByDefault: true, text: 'Can you iterate through the array and for each element, look for its complement (target − element)?' },
  { number: 2, text: 'Use a data structure that gives O(1) lookup. What data structure maps a value to its index?' },
  { number: 3, text: 'A hash map lets you check if complement exists in O(1). Store each number as you pass it.' },
  { number: 4, label: 'Hint 4 — approach', text: 'Loop once. For nums[i], compute complement = target - nums[i]. If complement is already in the map, you found your answer. Otherwise add nums[i] to the map.' },
];

const confidenceOptions = [
  { value: 1, label: '😵 Clueless' },
  { value: 2, label: '🤔 Needed hints' },
  { value: 3, label: '😊 Got it' },
  { value: 4, label: '🚀 Easy' },
];

export default function ProblemPage() {
  // OLD: unlockHint(n) manually injected HTML into the DOM the first time a hint was clicked.
  // NEW: unlockedHints is a Set of hint numbers that have been revealed. Hint 1 starts unlocked
  // to match the original static markup.
  const [unlockedHints, setUnlockedHints] = useState(new Set([1]));
  // OLD: toggleHint(n) toggled the 'open' class directly on the DOM node.
  // NEW: openHints is a Set of which *unlocked* hints are currently expanded.
  const [openHints, setOpenHints] = useState(new Set([1]));

  // OLD: switchApproach() toggled 'active' class + display style on two hardcoded blocks.
  // NEW: one string state drives which approach renders.
  const [activeApproach, setActiveApproach] = useState('brute'); // 'brute' | 'optimal'

  // OLD: selectConf() toggled 'selected' class across sibling buttons.
  // NEW: one number (1-4) — this is the exact value your weak point engine will read.
  const [confidenceRating, setConfidenceRating] = useState(null);

  // OLD: checkGate() flipped `disabled` on the view-solution button based on checkbox state.
  // NEW: two booleans — attemptConfirmed (checkbox) gates viewSolution (button).
  const [attemptConfirmed, setAttemptConfirmed] = useState(false);
  const [solutionVisible, setSolutionVisible] = useState(false);

  // OLD: markDone() only changed the button's text/color — nothing was actually stored.
  // NEW: real boolean state. This is what would get saved to localStorage/backend later.
  const [isSolved, setIsSolved] = useState(false);

  function handleHintClick(hintNumber) {
    if (unlockedHints.has(hintNumber)) {
      // already unlocked — just toggle open/closed
      setOpenHints((prev) => {
        const next = new Set(prev);
        next.has(hintNumber) ? next.delete(hintNumber) : next.add(hintNumber);
        return next;
      });
    } else {
      // first time clicking this hint — unlock it and open it
      // (this is also the exact spot to increment a "hints opened" counter
      // for the weak point detection engine once that's wired up)
      setUnlockedHints((prev) => new Set(prev).add(hintNumber));
      setOpenHints((prev) => new Set(prev).add(hintNumber));
    }
  }

  function handleViewSolution() {
    setSolutionVisible(true);
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="problem-layout">
        {/* LEFT: problem content */}
        <div className="problem-left">
          <div className="breadcrumb">
            <Link to="/roadmap">Roadmap</Link> <span>›</span>
            <a href="#">Arrays</a> <span>›</span>
            <span className="bc-current">Two Sum</span>
          </div>

          <div className="prob-header">
            <h1 className="prob-title">Two Sum</h1>
            <div className="prob-tags">
              <Badge type="green">Easy</Badge>
              <Badge type="purple">Arrays</Badge>
              <Badge type="purple">Hash Map</Badge>
              <Badge type="amber">O(n) required</Badge>
            </div>
            <div className="prob-links">
              <a href="#" className="ext-link">↗ LeetCode #1</a>
              <a href="#" className="ext-link">↗ Striver's A2Z</a>
            </div>
          </div>

          <div className="prob-section">
            <div className="prob-section-title">Problem</div>
            <p className="prob-text">
              Given an array of integers <code>nums</code> and an integer <code>target</code>, return the indices of the two numbers that add up to <code>target</code>.
              You may assume that each input has exactly one solution, and you may not use the same element twice. You can return the answer in any order.
            </p>
          </div>

          <div className="prob-section">
            <div className="prob-section-title">Examples</div>
            <div className="example-block">
              <div className="example-label">Example 1</div>
              <pre><code>{`Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Reason: nums[0] + nums[1] = 2 + 7 = 9`}</code></pre>
            </div>
            <div className="example-block">
              <div className="example-label">Example 2</div>
              <pre><code>{`Input:  nums = [3, 2, 4], target = 6
Output: [1, 2]`}</code></pre>
            </div>
          </div>

          <div className="prob-section">
            <div className="prob-section-title">Constraints</div>
            <ul className="constraints-list">
              <li>2 ≤ nums.length ≤ 10<sup>4</sup></li>
              <li>−10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup></li>
              <li>−10<sup>9</sup> ≤ target ≤ 10<sup>9</sup></li>
              <li><strong>Required:</strong> O(n) time complexity · O(n) space</li>
            </ul>
          </div>

          {/* Solution — only rendered once solutionVisible is true, replacing the old
              style="display:none" + manual .scrollIntoView() call */}
          {solutionVisible && (
            <div className="prob-section" id="solution-section">
              <div className="prob-section-title">Solution</div>
              <div className="approach-tabs">
                <button
                  className={`approach-tab ${activeApproach === 'brute' ? 'active' : ''}`}
                  onClick={() => setActiveApproach('brute')}
                >
                  Brute Force — O(n²)
                </button>
                <button
                  className={`approach-tab ${activeApproach === 'optimal' ? 'active' : ''}`}
                  onClick={() => setActiveApproach('optimal')}
                >
                  Optimal — O(n)
                </button>
              </div>

              {activeApproach === 'brute' && (
                <div>
                  <p className="prob-text" style={{ marginBottom: 12 }}>
                    For every element, check all others to find if their sum equals target. Simple but slow.
                  </p>
                  <div className="code-block">
                    <pre><code>{`function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
}`}</code></pre>
                  </div>
                </div>
              )}

              {activeApproach === 'optimal' && (
                <div>
                  <p className="prob-text" style={{ marginBottom: 12 }}>
                    Use a hash map to store seen values. For each element, check if its complement already exists.
                  </p>
                  <div className="code-block">
                    <pre><code>{`function twoSum(nums, target) {
  const map = new Map();   // value → index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}`}</code></pre>
                  </div>
                  <div className="dryrun-box">
                    <div className="dryrun-title">Dry run — nums = [2, 7, 11], target = 9</div>
                    <table className="dryrun-table">
                      <thead>
                        <tr><th>i</th><th>nums[i]</th><th>complement</th><th>map</th><th>result</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>0</td><td>2</td><td>7</td><td>{'{2:0}'}</td><td>—</td></tr>
                        <tr><td>1</td><td>7</td><td>2</td><td className="highlight-cell">{'{2:0, 7:1}'}</td><td className="highlight-cell">✓ [0, 1]</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: hints + actions */}
        <div className="problem-right">
          {/* progress */}
          <div className="right-panel">
            <div className="prog-header">
              <span className="prog-label">Arrays</span>
              <span className="prog-count">1 / 30</span>
            </div>
            <ProgressBar percent={3} />
            <div className="prob-nav">
              <Button size="sm">← Prev</Button>
              <Button size="sm">Next →</Button>
            </div>
          </div>

          {/* hints */}
          <div className="right-panel">
            <div className="panel-title">💡 Hints</div>
            <div className="hint-list">
              {hints.map((h) => (
                <HintItem
                  key={h.number}
                  number={h.number}
                  label={h.label}
                  text={h.text}
                  unlocked={unlockedHints.has(h.number)}
                  isOpen={openHints.has(h.number)}
                  onClick={() => handleHintClick(h.number)}
                />
              ))}
            </div>
          </div>

          {/* mark + solution */}
          <div className="right-panel">
            <div className="panel-title">📋 Mark & solve</div>

            <div className="confidence-section">
              <div className="conf-label">How did it go?</div>
              <div className="conf-options">
                {confidenceOptions.map((opt) => (
                  <ConfidenceButton
                    key={opt.value}
                    value={opt.value}
                    label={opt.label}
                    selected={confidenceRating === opt.value}
                    onClick={setConfidenceRating}
                  />
                ))}
              </div>
            </div>

            <div className="mark-actions">
              <button
                className="btn mark-btn-done"
                onClick={() => setIsSolved(true)}
                style={isSolved ? { background: 'var(--state-success-bg)', color: 'var(--green)', borderColor: 'var(--green)' } : undefined}
              >
                {isSolved ? '✓ Solved!' : '✓ Mark solved'}
              </button>
              <button className="btn mark-btn-revisit">⚑ Revisit later</button>
            </div>

            <div className="solution-gate">
              <div className="gate-text">Confirm before viewing solution:</div>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={attemptConfirmed}
                  onChange={(e) => setAttemptConfirmed(e.target.checked)}
                />
                I attempted this problem genuinely
              </label>
              <button
                className="btn btn-sm"
                id="view-sol-btn"
                disabled={!attemptConfirmed}
                onClick={handleViewSolution}
              >
                View solution + dry run
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
