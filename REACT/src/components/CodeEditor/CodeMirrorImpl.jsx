// CodeEditor/CodeMirrorImpl.jsx — CodeMirror 6 implementation.
//
// Uses @uiw/react-codemirror as the React wrapper around CodeMirror 6.
// Features enabled:
//   - Syntax highlighting for C++, Java, Python
//   - Bracket matching + auto-close brackets
//   - Auto-indentation (following language conventions)
//   - Line numbers
//   - Active line highlight
//   - Selection highlighting (matches on Ctrl+D-style multi-cursor later)
//   - oneDark theme (matches your fundamentals code blocks)
//
// FEATURES DELIBERATELY OFF:
//   - Vim/emacs modes (users can toggle in Settings v2 if requested)
//   - Autocomplete (needs language servers, too heavy for browser)
//   - Minimap (visual clutter for small editor)
//   - Word wrap (off by default; long lines scroll horizontally like a real IDE)
//
// PERFORMANCE:
//   CodeMirror 6 is virtualized — huge files don't slow it down. Bracket
//   matching is O(log n). Safe to leave running as long as user's on page.

import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';

// Language extensions cached at module load — no need to recompute per render
const LANGUAGE_EXTENSIONS = {
  cpp: cpp(),
  java: java(),
  python: python(),
};

// EditorView customizations — theme overrides + minor UX tweaks.
// Font size, line height, padding all matched to app's monospace conventions.
const editorTheme = EditorView.theme({
  '&': {
    fontSize: '13.5px',
    height: '100%',
  },
  '.cm-scroller': {
    fontFamily: 'var(--font-mono, "JetBrains Mono", "Fira Code", monospace)',
    lineHeight: '1.55',
  },
  '.cm-content': {
    padding: '12px 0',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--bg-base, #111)',
    borderRight: '1px solid var(--border)',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(232, 115, 45, 0.08)',
    color: 'var(--accent, #e8732d)',
  },
  '.cm-selectionMatch': {
    backgroundColor: 'rgba(232, 115, 45, 0.15)',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-cursor': {
    borderLeftColor: 'var(--accent, #e8732d)',
    borderLeftWidth: '2px',
  },
});

export default function CodeMirrorImpl({
  value,
  onChange,
  language = 'cpp',
  readOnly = false,
  autoFocus = false,
}) {
  const extensions = useMemo(() => {
    const langExt = LANGUAGE_EXTENSIONS[language];
    const base = [editorTheme];
    if (langExt) base.push(langExt);
    return base;
  }, [language]);

  return (
    <div className="cm-wrapper">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme={oneDark}
        editable={!readOnly}
        autoFocus={autoFocus}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,       // deliberate — see file comment
          foldGutter: false,            // clutters small editors
          indentOnInput: true,
          syntaxHighlighting: true,
          searchKeymap: true,           // Ctrl+F to search
          historyKeymap: true,          // Ctrl+Z / Ctrl+Shift+Z
          defaultKeymap: true,
        }}
        style={{
          height: '100%',
          minHeight: '300px',
        }}
      />
    </div>
  );
}