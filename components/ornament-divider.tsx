type Variant = 'palmette' | 'rosette' | 'tugra' | 'wave';

type Props = {
  variant?: Variant;
  /** Hex / oklch / var() — accent color, default ink soft. */
  color?: string;
};

/**
 * Ottoman ornamental divider — drawn as inline SVG at low fidelity. Picks
 * vary so the page never feels mechanically uniform: palmette (bahçe),
 * rosette (rozet), tuğra (sultan signature stylization), wave (su).
 */
export function OrnamentDivider({ variant = 'palmette', color = 'var(--ink-soft)' }: Props) {
  return (
    <div
      role="presentation"
      aria-hidden
      className="my-12 flex items-center justify-center gap-4 sm:my-16"
    >
      <span
        className="h-px flex-1 max-w-[18rem]"
        style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
      />
      <svg viewBox="0 0 80 24" className="h-5 w-20" style={{ color }}>
        {variant === 'palmette' && (
          <g fill="currentColor" stroke="currentColor" strokeWidth="0.4">
            <path
              d="M40 4 Q 32 8 30 14 Q 36 12 40 18 Q 44 12 50 14 Q 48 8 40 4 Z"
              opacity="0.85"
            />
            <circle cx="40" cy="14" r="1.5" />
            <path d="M2 12 L26 12 M54 12 L78 12" strokeWidth="0.5" />
            <circle cx="2" cy="12" r="1" />
            <circle cx="78" cy="12" r="1" />
          </g>
        )}
        {variant === 'rosette' && (
          <g fill="currentColor" stroke="currentColor" strokeWidth="0.4">
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <ellipse
                key={deg}
                cx="40"
                cy="12"
                rx="6"
                ry="2"
                opacity="0.75"
                transform={`rotate(${deg} 40 12)`}
              />
            ))}
            <circle cx="40" cy="12" r="1.8" fill="currentColor" />
            <path d="M2 12 L26 12 M54 12 L78 12" strokeWidth="0.5" />
          </g>
        )}
        {variant === 'tugra' && (
          <g fill="none" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round">
            <path d="M2 12 L20 12" />
            <path d="M22 4 Q 28 14 22 20 M30 4 Q 36 14 30 20 M38 4 Q 44 14 38 20" />
            <path d="M48 6 Q 56 12 48 18" />
            <path d="M60 12 L78 12" />
            <circle cx="2" cy="12" r="0.8" fill="currentColor" />
            <circle cx="78" cy="12" r="0.8" fill="currentColor" />
          </g>
        )}
        {variant === 'wave' && (
          <g fill="none" stroke="currentColor" strokeWidth="0.6">
            <path d="M2 12 Q 8 6 14 12 T 26 12 T 38 12 T 50 12 T 62 12 T 74 12" />
            <circle cx="38" cy="12" r="1.2" fill="currentColor" />
          </g>
        )}
      </svg>
      <span
        className="h-px flex-1 max-w-[18rem]"
        style={{ background: `linear-gradient(to left, transparent, ${color}, transparent)` }}
      />
    </div>
  );
}
