import type { Metadata } from 'next';
import { Cormorant_SC, Cormorant, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const cormorantSc = Cormorant_SC({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
});

const cormorant = Cormorant({
  variable: '--font-italic',
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['italic', 'normal'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OttomanTaste — Seven centuries, one table',
  description:
    'OttomanTaste — saraydan halka uzanan mutfak külliyatı; 427 tarif, yedi yüzyıl.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${cormorantSc.variable} ${cormorant.variable} ${jakarta.variable}`}>
      <body
        style={{
          fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
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
