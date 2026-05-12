import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * POST /api/feedback
 *
 * Body: { email: string, message: string, lang?: 'tr' | 'en' }
 * Sends the feedback as a Telegram message via the support bot. The message
 * always begins with the literal "OttomanTaste" header per spec.
 *
 * Reads TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID from environment. Both required.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const { email, message, lang } = (body ?? {}) as {
    email?: unknown;
    message?: unknown;
    lang?: unknown;
  };

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  if (typeof message !== 'string' || message.trim().length < 3 || message.length > 4000) {
    return NextResponse.json({ ok: false, error: 'invalid_message' }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('[feedback] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars');
    return NextResponse.json(
      { ok: false, error: 'server_not_configured' },
      { status: 500 },
    );
  }

  const langLabel = lang === 'en' ? 'EN' : 'TR';
  const tsIso = new Date().toISOString();

  // Telegram MarkdownV2 escaping is fussy; we use plain text mode for safety.
  const text = [
    'OttomanTaste',
    '────────────',
    '',
    `📧  ${email}`,
    `🌐  ${langLabel}  ·  ${tsIso}`,
    '',
    '💬  Mesaj:',
    message.trim(),
  ].join('\n');

  const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!tgRes.ok) {
    const errText = await tgRes.text().catch(() => '');
    console.error('[feedback] Telegram API error', tgRes.status, errText);
    return NextResponse.json(
      { ok: false, error: 'telegram_error', detail: errText.slice(0, 200) },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
