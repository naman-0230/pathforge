import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ScrollToTop — scrolls the window to top on every route change.
// React Router doesn't do this automatically (unlike traditional
// page navigations where the browser resets scroll position).
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}