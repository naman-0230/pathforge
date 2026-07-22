import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { useApp } from '../context/AppContext.jsx';
import { canAccessAptitude } from '../utils/tierGate.js';
import {
  CATEGORIES,
  SUBCATEGORIES,
  getSubcategoryLabel,
} from '../data/aptitude/questions.js';
import { getContent, hasContent } from '../utils/aptitudeFundamentals.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/aptitude.css';

// AptitudeFundamentalReader — reads a single fundamentals .md article.
// URL: /aptitude/fundamentals/:category/:subcategory
//
// Uses react-markdown for rendering. Redirects to the hub if the article
// is missing or still a stub. Provides prev/next navigation across
// subcategories and a "Practice this topic" shortcut that preselects
// the topic on AptitudeCategoryPage via router state.

export default function AptitudeFundamentalReader() {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const { user, tierLoaded } = useApp();
  const hasAccess = canAccessAptitude(user);

  const categoryInfo = CATEGORIES[category];
  const subcategoryLabel = getSubcategoryLabel(category, subcategory);
  const content = getContent(category, subcategory);

  usePageTitle(subcategoryLabel ? `${subcategoryLabel} — Fundamentals` : 'Fundamentals');

  const subs = SUBCATEGORIES[category] || [];
  const currentIdx = subs.findIndex((s) => s.slug === subcategory);
  const prevSub = currentIdx > 0 ? subs[currentIdx - 1] : null;
  const nextSub = currentIdx >= 0 && currentIdx < subs.length - 1 ? subs[currentIdx + 1] : null;

  useEffect(() => {
    if (!tierLoaded) return;
    if (!hasAccess) { navigate('/aptitude'); return; }
    if (!categoryInfo || !content) {
      navigate('/aptitude/fundamentals');
    }
  }, [tierLoaded, hasAccess, categoryInfo, content, navigate]);

  if (!tierLoaded || !categoryInfo || !content) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content" />
      </div>
    );
  }

  function handlePractice() {
    navigate(`/aptitude/${category}`, { state: { preselect: subcategory } });
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="aptitude-fund-reader-container">
          {/* Breadcrumb */}
          <nav className="aptitude-picker-breadcrumb">
            <Link to="/aptitude">Aptitude</Link>
            <span className="aptitude-picker-crumb-sep">›</span>
            <Link to="/aptitude/fundamentals">Fundamentals</Link>
            <span className="aptitude-picker-crumb-sep">›</span>
            <Link to={`/aptitude/${category}`}>{categoryInfo.shortLabel}</Link>
            <span className="aptitude-picker-crumb-sep">›</span>
            <span>{subcategoryLabel}</span>
          </nav>

          {/* Article header */}
          <div className="aptitude-fund-reader-header">
            <div>
              <div className="aptitude-fund-reader-badge">
                {categoryInfo.icon} {categoryInfo.shortLabel}
              </div>
              <h1 className="aptitude-fund-reader-title">{subcategoryLabel}</h1>
            </div>
            <Button variant="primary" onClick={handlePractice}>
              Practice this topic →
            </Button>
          </div>

          {/* Article body */}
          <article className="aptitude-fund-article">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>

          {/* Prev / Next nav */}
          <div className="aptitude-fund-reader-nav">
            {prevSub && hasContent(category, prevSub.slug) ? (
              <Link
                to={`/aptitude/fundamentals/${category}/${prevSub.slug}`}
                className="aptitude-fund-nav-link"
              >
                ← {prevSub.label}
              </Link>
            ) : <span />}

            {nextSub && hasContent(category, nextSub.slug) ? (
              <Link
                to={`/aptitude/fundamentals/${category}/${nextSub.slug}`}
                className="aptitude-fund-nav-link"
              >
                {nextSub.label} →
              </Link>
            ) : <span />}
          </div>

          <div className="aptitude-fund-reader-footer">
            <Link to="/aptitude/fundamentals" className="aptitude-fund-back">
              ← All fundamentals
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}