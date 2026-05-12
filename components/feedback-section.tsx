'use client';

import * as React from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { t, type Lang } from '@/lib/i18n';

type Status = 'idle' | 'sending' | 'success' | 'error';

type Props = { lang: Lang };

/**
 * "Write to us" feedback section. Posts {email, message, lang} to /api/feedback.
 * On success the form clears and a confirmation panel slides in. On error a
 * red bar surfaces under the submit button.
 */
export function FeedbackSection({ lang }: Props) {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [status, setStatus] = React.useState<Status>('idle');
  const [errorKey, setErrorKey] = React.useState<'fb_err_email' | 'fb_err_msg' | 'fb_err_server' | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorKey(null);

    // Quick client-side validation; server validates again
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      setErrorKey('fb_err_email');
      setStatus('error');
      return;
    }
    if (message.trim().length < 3) {
      setErrorKey('fb_err_msg');
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message, lang }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.error === 'invalid_email') setErrorKey('fb_err_email');
        else if (data?.error === 'invalid_message') setErrorKey('fb_err_msg');
        else setErrorKey('fb_err_server');
        setStatus('error');
        return;
      }
      setEmail('');
      setMessage('');
      setStatus('success');
    } catch {
      setErrorKey('fb_err_server');
      setStatus('error');
    }
  };

  return (
    <section
      id="feedback"
      aria-labelledby="feedback-heading"
      className="border-y-[2px] border-double border-[#2a1810]/30 py-20 sm:py-28"
      style={{
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-magenta) 10%, var(--color-paper)) 0%, var(--color-paper) 100%)',
      }}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:gap-16">
        {/* Left column — eyebrow + heading + lede */}
        <div className="lg:col-span-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-magenta-deep)]">
            {t('fb_eyebrow', lang)}
          </p>
          <h2
            id="feedback-heading"
            className="mt-4 leading-[1] tracking-[-0.015em] text-[#2a1810]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
            }}
          >
            {t('fb_title', lang)}
          </h2>
          <p
            className="mt-5 max-w-prose text-base leading-relaxed text-[#2a1810]/75 sm:text-lg"
            style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}
          >
            {t('fb_lede', lang)}
          </p>
        </div>

        {/* Right column — form OR success panel */}
        <div className="lg:col-span-7">
          {status === 'success' ? (
            <SuccessPanel
              lang={lang}
              onReset={() => {
                setStatus('idle');
                setErrorKey(null);
              }}
            />
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              className="space-y-5 rounded-md border border-[#2a1810]/15 bg-[var(--color-paper)] p-6 shadow-[0_18px_30px_-22px_rgba(42,24,16,0.18)] sm:p-8"
            >
              <Field
                id="feedback-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                label={t('fb_email_label', lang)}
                placeholder={t('fb_email_ph', lang)}
                value={email}
                onChange={setEmail}
                required
              />
              <Field
                id="feedback-message"
                multiline
                label={t('fb_message_label', lang)}
                placeholder={t('fb_message_ph', lang)}
                value={message}
                onChange={setMessage}
                required
                minLength={3}
                maxLength={4000}
              />

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#2a1810] px-7 py-3.5 text-sm font-semibold text-[var(--color-paper)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-magenta-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)]"
                  style={{
                    transition: 'transform 320ms cubic-bezier(0.16,1,0.3,1), background-color 320ms cubic-bezier(0.16,1,0.3,1)',
                  }}
                  onMouseDown={(e) => {
                    if (status !== 'sending') e.currentTarget.style.transform = 'scale(0.97)';
                  }}
                  onMouseUp={(e) => (e.currentTarget.style.transform = '')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
                >
                  {status === 'sending' ? t('fb_sending', lang) : t('fb_send', lang)}
                  <Send
                    className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </button>

                {status === 'error' && errorKey && (
                  <p
                    role="alert"
                    className="inline-flex items-center gap-2 text-sm text-[#7B1E2D]"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                    {t(errorKey, lang)}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────

function Field({
  id,
  type = 'text',
  multiline,
  label,
  placeholder,
  value,
  onChange,
  required,
  inputMode,
  autoComplete,
  minLength,
  maxLength,
}: {
  id: string;
  type?: string;
  multiline?: boolean;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  inputMode?: 'email' | 'text';
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
}) {
  const common =
    'block w-full rounded-md border border-[#2a1810]/20 bg-transparent px-3.5 py-3 text-[15px] text-[#2a1810] placeholder:text-[#2a1810]/35 focus:border-[var(--color-magenta-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--color-magenta)]/30';
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2a1810]/65">
        {label}
        {required && <span aria-hidden className="ml-1 text-[var(--color-magenta-deep)]">·</span>}
      </span>
      {multiline ? (
        <textarea
          id={id}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          rows={5}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${common} resize-y leading-relaxed`}
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={common}
        />
      )}
    </label>
  );
}

function SuccessPanel({ lang, onReset }: { lang: Lang; onReset: () => void }) {
  return (
    <div
      className="relative overflow-hidden rounded-md border border-[var(--color-magenta-deep)]/40 bg-[var(--color-paper)] p-8 shadow-[0_18px_30px_-22px_rgba(42,24,16,0.22)]"
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: 'var(--color-magenta-deep)' }}
      />
      <div className="flex items-start gap-4">
        <CheckCircle2
          className="mt-1 h-6 w-6 shrink-0 text-[var(--color-magenta-deep)]"
          aria-hidden
        />
        <div>
          <p
            className="text-2xl leading-snug text-[#2a1810] sm:text-3xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('fb_success', lang)}
          </p>
          <button
            type="button"
            onClick={onReset}
            className="mt-4 cursor-pointer text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-magenta-deep)] underline-offset-4 hover:underline"
          >
            {lang === 'en' ? 'Send another' : 'Bir tane daha'}
          </button>
        </div>
      </div>
    </div>
  );
}
