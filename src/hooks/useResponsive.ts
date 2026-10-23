import { useEffect, useState } from 'react';

/**
 * Shared responsive breakpoints for StrokeSense.
 * - mobile:  <= 640px  (phones portrait, Galaxy Fold closed at 280px included)
 * - tablet:  <= 1024px (iPad portrait 768-834px, iPad landscape 1024-1180px is `isTabletDown` via 1180)
 * - small:   <= 400px  (iPhone SE / small Android)
 * CSS mirror lives in index.css (same thresholds) for class-based elements.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export interface ResponsiveState {
  /** <= 400px: small phones */
  isSmallPhone: boolean;
  /** <= 640px: all phones portrait */
  isMobile: boolean;
  /** <= 900px: large phones landscape / small tablets portrait */
  isTabletPortrait: boolean;
  /** <= 1180px: iPad portrait + landscape */
  isTablet: boolean;
  /** > 1180px: desktop */
  isDesktop: boolean;
  /** true when viewport height is short (phone landscape, split view) */
  isShortScreen: boolean;
}

export function useResponsive(): ResponsiveState {
  const isSmallPhone = useMediaQuery('(max-width: 400px)');
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTabletPortrait = useMediaQuery('(max-width: 900px)');
  const isTablet = useMediaQuery('(max-width: 1180px)');
  const isShortScreen = useMediaQuery('(max-height: 500px)');
  return {
    isSmallPhone,
    isMobile,
    isTabletPortrait,
    isTablet,
    isDesktop: !isTablet,
    isShortScreen,
  };
}
