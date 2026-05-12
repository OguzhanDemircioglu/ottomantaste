import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * GET /api/telegram-init
 *
 * Dev helper to discover chat_ids the bot can write to. Calls Telegram's
 * `getUpdates` and summarizes recent chats. Use this once after sending the
 * bot a message from your personal Telegram account, then paste the chat_id
 * into `.env.local` as TELEGRAM_CHAT_ID.
 *
 * Disabled in production to avoid leaking chat metadata.
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: false, error: 'disabled_in_production' }, { status: 403 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: 'TELEGRAM_BOT_TOKEN missing in .env.local' },
      { status: 500 },
    );
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    return NextResponse.json(
      { ok: false, error: `telegram ${res.status}`, detail: errText.slice(0, 300) },
      { status: 502 },
    );
  }

  const data = (await res.json()) as {
    ok: boolean;
    result?: Array<{
      message?: {
        chat?: { id: number; type: string; first_name?: string; last_name?: string; username?: string; title?: string };
        from?: { username?: string; first_name?: string };
        text?: string;
        date?: number;
      };
    }>;
  };

  // Summarize unique chats seen
  const chats = new Map<number, {
    chat_id: number;
    type: string;
    name: string;
    last_text?: string;
    last_seen?: string;
  }>();
  for (const upd of data.result ?? []) {
    const chat = upd.message?.chat;
    if (!chat) continue;
    const name =
      chat.title ??
      [chat.first_name, chat.last_name].filter(Boolean).join(' ') ??
      chat.username ??
      String(chat.id);
    const existing = chats.get(chat.id);
    chats.set(chat.id, {
      chat_id: chat.id,
      type: chat.type,
      name: name || existing?.name || String(chat.id),
      last_text: upd.message?.text ?? existing?.last_text,
      last_seen: upd.message?.date
        ? new Date(upd.message.date * 1000).toISOString()
        : existing?.last_seen,
    });
  }

  return NextResponse.json({
    ok: true,
    instructions:
      'Send any message to @DriverMesh_bot from your Telegram account, then refresh this URL. Copy your chat_id below into .env.local as TELEGRAM_CHAT_ID and restart the dev server.',
    chats: Array.from(chats.values()),
    raw_count: data.result?.length ?? 0,
  });
}
