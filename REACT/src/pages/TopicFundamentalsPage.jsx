import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Sidebar from '../components/Sidebar';
import { getTopicFundamentals } from '../data/fundamentals.js';
import { slugify } from '../utils/slug.js';
import {
  getSectionReadDate,
  getTopicFundamentalsReadCount,
  markSectionFundamentalsRead,
} from '../utils/fundamentalsRead.js';
import '../styles/app.css';
import '../styles/fundamentals.css';

// TopicFundamentalsPage — one topic's full theory page: every section from
// topics.js, in curriculum order, each independently deep-linkable via
// #section-slug (see utils/slug.js — same slugify() used both here for each
// section's id and in the table-of-contents links, so they can't disagree).
//
// DEEP-LINK SUPPORT: this is what a future Dashboard prompt ("go through the
// fundamentals of X before starting?") will link to directly — e.g.
// /fundamentals/strings#sliding-window — landing the person on exactly the
// relevant section instead of the top of a long page. React Router doesn't
// auto-scroll to a hash on route change the way a plain <a href="#foo"> does
// (content here renders client-side, so the target element may not exist
// yet on the very first paint) — the effect below handles that manually.
export default function TopicFundamentalsPage() {
  const { topicKey } = useParams();
  const location = useLocation();
  const topicData = getTopicFundamentals(topicKey);

  const [, forceRefresh] = useState(0);

  const readCount = topicData
    ? getTopicFundamentalsReadCount(topicKey, topicData.sections.map((s) => s.name))
    : 0;

  function handleMarkRead(sectionName) {
    markSectionFundamentalsRead(topicKey, sectionName);
    forceRefresh((n) => n + 1);
  }

  useEffect(() => {
    if (!location.hash) return;
    const targetId = decodeURIComponent(location.hash.slice(1));
    // Small delay so the section content has actually painted before we try
    // to scroll to it — without this, a fast navigation can miss the target.
    const timeoutId = setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [location.hash, topicKey]);

  if (!topicData) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <p style={{ color: 'var(--text-mid)' }}>
            Couldn't find fundamentals for "{topicKey}".{' '}
            <Link to="/fundamentals" style={{ color: 'var(--accent-mid)' }}>Back to Fundamentals</Link>
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="fundamentals-layout">
        {/* TABLE OF CONTENTS */}
        <aside className="fundamentals-toc">
          <Link to="/fundamentals" className="fundamentals-toc-back">← All topics</Link>
          <div className="fundamentals-toc-title">{topicData.icon} {topicData.label}</div>
          <nav className="fundamentals-toc-list">
            {topicData.sections.map((s) => (
              <a key={s.name} href={`#${slugify(s.name)}`} className="fundamentals-toc-link">
                {s.name}
                {getSectionReadDate(topicKey, s.name) && <span style={{ color: 'var(--green, #3fae63)' }}> ✓</span>}
                {s.isPlaceholder && <span className="fundamentals-toc-unwritten"> ·</span>}
              </a>
            ))}
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="fundamentals-main">
          <div className="breadcrumb">
            <Link to="/fundamentals">Fundamentals</Link> <span>›</span>
            <span className="bc-current">{topicData.label}</span>
          </div>

          <div className="page-header" style={{ marginBottom: 8 }}>
            <div>
              <h1>{topicData.icon} {topicData.label} — Fundamentals</h1>
              <p className="page-sub">
                Read this before starting {topicData.label} problems. {readCount} / {topicData.sections.length} sections read.
              </p>
            </div>
          </div>

          {topicData.sections.map((s) => (
            <section key={s.name} id={slugify(s.name)} className="fundamentals-section">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <h2 className="fundamentals-section-title" style={{ marginBottom: 0 }}>
                  {s.name}
                </h2>
                {getSectionReadDate(topicKey, s.name) ? (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--green, #3fae63)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ✓ Read on {getSectionReadDate(topicKey, s.name)}
                  </span>
                ) : (
                  <button className="btn btn-sm" onClick={() => handleMarkRead(s.name)}>
                    Mark as read
                  </button>
                )}
              </div>
              {s.blurb && <p className="fundamentals-section-blurb">{s.blurb}</p>}
              <div className="fundamentals-content markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{s.content}</ReactMarkdown>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}