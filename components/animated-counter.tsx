'use client';

import * as React from 'react';

type Props = {
  to: number;
  /** Total animation duration in ms. Default 1400. */
  durationMs?: number;
};

/**
 * Tasteful count-up — runs once on mount with a soft-easing curve. Respects
 * prefers-reduced-motion and skips straight to the target value.
 */
export function AnimatedCounter({ to, durationMs = 1400 }: Props) {
  const [n, setN] = React.useState(0);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(to);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // ease-out-expo
      const eased = 1 - Math.pow(2, -10 * t);
      setN(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, durationMs]);

  return <span className="tabular-nums">{n}</span>;
}
