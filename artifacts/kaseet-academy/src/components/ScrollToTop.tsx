import { useEffect } from 'react';
import { useLocation } from 'wouter';

/** Scrolls to top instantly on every route change — mount once inside <Router> */
export default function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location]);
  return null;
}
