import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { listFundamentalsTopics, getTopicFundamentals } from '../data/fundamentals.js';
import { getTopicFundamentalsReadCount } from '../utils/fundamentalsRead.js';
import '../styles/app.css';
import '../styles/fundamentals.css';
import { usePageTitle } from '../utils/usePageTitle.js';
// FundamentalsPage — the index/browse page. One card per topic (from
// topics.js, via listFundamentalsTopics()), showing how many of that topic's
// sections have real content written vs. still placeholder — a quick,
// honest "how filled-in is this" signal as you paste content in over time.
//
// This is also the eventual link target for the Dashboard prompt described
// in the request ("would you like to go through the fundamentals of X?") —
// that prompt will link straight to /fundamentals/:topicKey (optionally with
// a #section-slug hash), skipping this index page entirely. This page is for
// manual browsing.
export default function FundamentalsPage() {
  usePageTitle('Fundamentals');
  const topicList = listFundamentalsTopics().map((t) => {
    const sectionNames = getTopicFundamentals(t.key)?.sections.map((s) => s.name) || [];
    return {
      ...t,
      readCount: getTopicFundamentalsReadCount(t.key, sectionNames),
    };
  });

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Fundamentals</h1>
            <p className="page-sub">Core theory for every topic — read before diving into a new section's problems.</p>
          </div>
        </div>

        <div className="fundamentals-grid stagger-children">
          {topicList.map((t) => (
            <Link key={t.key} to={`/fundamentals/${t.key}`} className="fundamentals-card">
              <div className="fundamentals-card-icon">{t.icon}</div>
              <div className="fundamentals-card-label">{t.label}</div>
              <div className="fundamentals-card-count">
                {t.writtenCount} / {t.sectionCount} sections written
              </div>
              <div className="fundamentals-card-count">
                {t.readCount} / {t.sectionCount} sections read
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}