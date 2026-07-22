// CodeEditor/index.jsx — abstraction wrapper for the code editor.
//
// This is the ONLY file the rest of the app imports for code editing.
// Everything about which library (CodeMirror 6 today, Monaco tomorrow)
// is hidden behind this interface.
//
// PUBLIC API — all callers use this shape:
//   <CodeEditor
//     value={string}              current code
//     onChange={(v) => void}      called with new code on every edit
//     language="cpp"|"java"|"python"
//     readOnly={boolean}          optional, defaults to false
//     autoFocus={boolean}         optional
//   />
//
// SWAP MECHANISM:
//   Change IMPL below to switch implementations. Everything else stays
//   identical. To swap:
//     1. Import the new impl at top
//     2. Change IMPL constant
//     3. Verify props match the shape above (adapt in the impl if not)

import CodeMirrorImpl from './CodeMirrorImpl';

// Change to 'monaco' when you install @monaco-editor/react + write MonacoImpl.
const IMPL = 'codemirror';

const IMPLS = {
  codemirror: CodeMirrorImpl,
  // monaco: MonacoImpl,  // add here when needed
};

export default function CodeEditor(props) {
  const Impl = IMPLS[IMPL];
  if (!Impl) {
    console.error(`[CodeEditor] Unknown implementation: ${IMPL}`);
    return <div style={{ padding: 20, color: 'var(--red)' }}>Editor not configured</div>;
  }
  return <Impl {...props} />;
}