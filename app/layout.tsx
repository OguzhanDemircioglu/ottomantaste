import type { Metadata } from 'next';
import './globals.css';

/**
 * Verdana her yerde. Tüm yazı yüzeylerini Verdana stack'ine bağlıyoruz —
 * gövde, başlıklar, italikler, monospace eyebrow'lar. Stack: Verdana →
 * Geneva (macOS) → DejaVu Sans (Linux fallback) → sans-serif (final).
 */
const VERDANA = 'Verdana, Geneva, "DejaVu Sans", Tahoma, sans-serif';

export const metadata: Metadata = {
  // `template` lets recipe pages set their own title via `generateMetadata`
  // while keeping the consistent " — OttomanTaste" suffix; the root tab
  // (and everything that doesn't override) stays the bare brand.
  title: {
    default: 'OttomanTaste',
    template: '%s — OttomanTaste',
  },
  description:
    'OttomanTaste — saraydan halka uzanan mutfak külliyatı; 427 tarif, yedi yüzyıl.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      style={
        {
          // CSS custom properties consumed by inline `style={{ fontFamily: 'var(--font-...)' }}`
          // across the component tree. Bind all three to Verdana so every legacy
          // call site updates without a rewrite.
          ['--font-display' as string]: VERDANA,
          ['--font-italic'  as string]: VERDANA,
          ['--font-sans'    as string]: VERDANA,
        } as React.CSSProperties
      }
    >
      <body
        style={{
          fontFamily: VERDANA,
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-foreground)',
        }}
      >
        {/* Aged parchment grain — single SVG noise overlay across whole site */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 opacity-[0.06] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          }}
        />
        {children}
      </body>
    </html>
  );
}
