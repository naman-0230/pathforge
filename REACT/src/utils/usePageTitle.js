import { useEffect } from 'react';

// usePageTitle — sets document.title for the current page.
// Falls back to "PathForge" if no title passed.
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | PathForge` : 'PathForge';
    return () => {
      document.title = 'PathForge';
    };
  }, [title]);
}