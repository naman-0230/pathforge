import { useState, useEffect } from 'react';

// useScrollDirection — tracks whether the user is scrolling up or down.
// Returns 'up' | 'down' | null (null means at top / no scroll yet).
//
// USAGE:
//   const scrollDir = useScrollDirection();
//   <div className={scrollDir === 'down' ? 'hidden' : ''}>...</div>
//
// Uses a threshold to prevent jitter — small scroll movements don't flip
// direction. Also always returns null when at the very top of the page,
// so elements can show unconditionally on initial load.
export function useScrollDirection(threshold = 10) {
  const [scrollDir, setScrollDir] = useState(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateScrollDir() {
      const scrollY = window.scrollY;

      // At very top — no direction, show everything
      if (scrollY < 20) {
        setScrollDir(null);
        lastScrollY = scrollY;
        ticking = false;
        return;
      }

      // Ignore tiny movements to prevent flicker
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      setScrollDir(scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    }

    function onScroll() {
      // Use rAF to throttle — fires at most once per frame
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrollDir;
}