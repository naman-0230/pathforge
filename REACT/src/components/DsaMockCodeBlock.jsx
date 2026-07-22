import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// DsaMockCodeBlock — reusable syntax-highlighted code snippet for
// question code blocks. Uses the same oneDark theme as
// TopicFundamentalsPage for visual consistency.
//
// Language accepts: 'cpp', 'java', 'python', 'javascript', 'text'
// (defaults to 'cpp' if omitted). "text" disables highlighting for
// pseudocode / non-language snippets.

export default function DsaMockCodeBlock({ code, language = 'cpp' }) {
  if (!code) return null;

  return (
    <div className="dsa-code-block">
      <div className="dsa-code-block-header">
        <span className="dsa-code-block-lang">{language.toUpperCase()}</span>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        customStyle={{
          borderRadius: '0 0 8px 8px',
          fontSize: '13px',
          margin: 0,
          padding: '14px 16px',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}