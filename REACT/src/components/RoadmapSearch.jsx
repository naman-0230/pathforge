import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from './Badge';
import { getDifficultyType } from '../data/problems.js';
import { searchProblems } from '../utils/problemSearch.js';

// RoadmapSearch — search input with dropdown results, positioned in the
// roadmap page header. Searches the ENTIRE problem pool (not just the
// user's roadmap), with roadmap problems ranked first.
//
// KEYBOARD:
//   ↑ / ↓        — navigate results
//   Enter        — open highlighted result
//   Escape       — close dropdown, clear query
//   Ctrl/Cmd+K   — focus input from anywhere on the page
//
// CLICK BEHAVIOR:
//   Click a result → navigate to /problem/:id
//   Click outside dropdown → close (but preserve query in input)
//   Click X in input → clear query
//
// PROPS:
//   roadmapIds — Set of problem IDs currently in the user's roadmap.
//                Used by the search ranker to prioritize in-plan problems.

const DEBOUNCE_MS = 150;

export default function RoadmapSearch({ roadmapIds }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(0);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);
  const navigate = useNavigate();

  // Debounce query updates so search doesn't run on every keystroke
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  // Compute results from debounced query
  const results = useMemo(() => {
    return searchProblems(debouncedQuery, roadmapIds, 10);
  }, [debouncedQuery, roadmapIds]);

  // Reset highlight when results change
  useEffect(() => {
    setHighlightedIdx(0);
  }, [results]);

  // Click-outside handler — close dropdown but keep query in input
  useEffect(() => {
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Global Cmd/Ctrl+K to focus search
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function handleChange(e) {
    setQuery(e.target.value);
    setIsOpen(true);
  }

  function handleFocus() {
    if (query.trim().length > 0) setIsOpen(true);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      inputRef.current?.blur();
      return;
    }
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIdx((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIdx((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = results[highlightedIdx];
      if (chosen) selectResult(chosen);
    }
  }

  function selectResult(result) {
    setIsOpen(false);
    setQuery('');
    navigate(`/problem/${result.id}`);
  }

  function handleClear() {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  }

  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div className="roadmap-search" ref={containerRef}>
      <div className="roadmap-search-input-wrap">
        <span className="roadmap-search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="roadmap-search-input"
          placeholder="Search problems... (Ctrl+K)"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          aria-label="Search problems"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
        />
        {query && (
          <button
            className="roadmap-search-clear"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="roadmap-search-dropdown" role="listbox">
          {results.length === 0 ? (
            <div className="roadmap-search-empty">
              No problems match "{query}"
            </div>
          ) : (
            <>
              <div className="roadmap-search-header">
                {results.length} result{results.length === 1 ? '' : 's'}
                <span className="roadmap-search-hint">↑↓ Enter Esc</span>
              </div>
              {results.map((r, i) => (
                <ResultRow
                  key={r.id}
                  result={r}
                  highlighted={i === highlightedIdx}
                  onClick={() => selectResult(r)}
                  onMouseEnter={() => setHighlightedIdx(i)}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ResultRow({ result, highlighted, onClick, onMouseEnter }) {
  return (
    <button
      className={`roadmap-search-result ${highlighted ? 'highlighted' : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      type="button"
      role="option"
      aria-selected={highlighted}
    >
      <div className="roadmap-search-result-main">
        <div className="roadmap-search-result-name">
          {result.isSolved && <span className="roadmap-search-solved">✓</span>}
          <span>{result.name}</span>
          {result.leetcode && (
            <span className="roadmap-search-leetcode">#{result.leetcode}</span>
          )}
        </div>
        <div className="roadmap-search-result-meta">
          <Badge type={getDifficultyType(result.difficulty)}>{result.difficulty}</Badge>
          <span className="roadmap-search-topic">
            {result.topicIcon} {result.topicLabel}
          </span>
          {result.pattern && (
            <span className="roadmap-search-pattern">· {result.pattern}</span>
          )}
        </div>
      </div>
      <div className="roadmap-search-result-tag">
        {result.isInRoadmap ? (
          <span className="roadmap-search-tag-inplan">in your plan</span>
        ) : (
          <span className="roadmap-search-tag-notplan">not in plan</span>
        )}
      </div>
    </button>
  );
}