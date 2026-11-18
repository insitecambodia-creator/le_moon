// Le Moon Worker. Runs only for /api/* and the removed event pages (see
// run_worker_first in wrangler.jsonc); every other request is a static file.
//
//   POST /api/booking  → checks origin, honeypot, Turnstile and fields, then
//                         forwards the request to the n8n webhook.
//   removed event pages → 410 Gone.
//
// Secrets: N8N_WEBHOOK_URL, N8N_WEBHOOK_TOKEN, TURNSTILE_SECRET.
// Optional var: ALLOWED_ORIGINS (comma-separated extra origins, e.g. a preview URL).

import { gone } from '../redirects.mjs';

interface Env {
  ASSETS: { fetch: (req: Request | string) => Promise<Response> };
  N8N_WEBHOOK_URL?: string;
  N8N_WEBHOOK_TOKEN?: string;
  TURNSTILE_SECRET?: string;
  ALLOWED_ORIGINS?: string;
}

type FormType = 'table' | 'birthday' | 'groups';

// Keep in step with src/lib/booking.ts.
const limits: Record<FormType, { minGuests: number; maxGuests: number; firstSlot: string; lastSlot: string }> = {
  table: { minGuests: 1, maxGuests: 6, firstSlot: '17:00', lastSlot: '22:00' },
  birthday: { minGuests: 2, maxGuests: 20, firstSlot: '17:00', lastSlot: '21:30' },
  groups: { minGuests: 20, maxGuests: 200, firstSlot: '17:00', lastSlot: '22:00' },
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Today's date in Phnom Penh (UTC+7) as YYYY-MM-DD. */
const todayPP = (offsetDays = 0) => new Date(Date.now() + 7 * 3600_000 + offsetDays * 86400_000).toISOString().slice(0, 10);

const isGone = (pathname: string) => {
  const p = pathname.endsWith('/') ? pathname : pathname + '/';
  return gone.includes(p);
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (isGone(url.pathname)) {
      const page = await env.ASSETS.fetch(new URL('/404.html', url).toString());
      return new Response(page.body, {
        status: 410,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' },
      });
    }

    if (url.pathname === '/api/booking' || url.pathname === '/api/booking/') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
      return handleBooking(request, env, url);
    }

    if (url.pathname.startsWith('/api/')) return json({ ok: false, error: 'not_found' }, 404);
    return env.ASSETS.fetch(request);
  },
};

async function handleBooking(request: Request, env: Env, url: URL): Promise<Response> {
  // Same-origin only (plus any extra origins set for testing).
  const origin = request.headers.get('Origin');
  const allowed = new Set([url.origin, ...(env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)]);
  if (!origin || !allowed.has(origin)) return json({ ok: false, error: 'origin' }, 403);

  if (!(request.headers.get('Content-Type') || '').includes('application/json')) return json({ ok: false, error: 'type' }, 415);
  const raw = await request.text();
  if (raw.length > 10_000) return json({ ok: false, error: 'too_large' }, 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'json' }, 400);
  }

  // Honeypot filled: pretend it worked, send nothing.
  if (str(body.website)) return json({ ok: true });

  const formType = str(body.formType) as FormType;
  if (!(formType in limits)) return json({ ok: false, error: 'form_type' }, 400);
  const l = limits[formType];

  // Turnstile. Skipped only when no secret is configured (local dev / early previews).
  if (env.TURNSTILE_SECRET) {
    const token = str(body.turnstileToken, 2048);
    if (!token) return json({ ok: false, error: 'captcha' }, 400);
    const form = new FormData();
    form.append('secret', env.TURNSTILE_SECRET);
    form.append('response', token);
    const ip = request.headers.get('CF-Connecting-IP');
    if (ip) form.append('remoteip', ip);
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const result = (await verify.json().catch(() => ({}))) as { success?: boolean };
    if (!result.success) return json({ ok: false, error: 'captcha' }, 400);
  }

  // Field checks.
  const bad: string[] = [];
  const firstName = str(body.firstName, 60);
  const lastName = str(body.lastName, 60);
  const email = str(body.email, 120);
  const phone = str(body.phone, 30);
  const date = str(body.date, 10);
  const time = str(body.time, 5);
  const guests = Number(body.guests);

  if (!firstName) bad.push('firstName');
  if (!lastName) bad.push('lastName');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) bad.push('email');
  if (!/^[0-9 +().-]{6,30}$/.test(phone)) bad.push('phone');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < todayPP() || date > todayPP(366)) bad.push('date');
  if (!/^\d{2}:(00|30)$/.test(time) || time < l.firstSlot || time > l.lastSlot) bad.push('time');
  if (!Number.isInteger(guests) || guests < l.minGuests || guests > l.maxGuests) bad.push('guests');
  if (str(body.consent) !== 'yes') bad.push('consent');

  let birthday: { day: number; month: number; ownCake: boolean } | undefined;
  if (formType === 'birthday') {
    const day = Number(body.birthDay);
    const month = Number(body.birthMonth);
    if (!Number.isInteger(day) || day < 1 || day > 31) bad.push('birthDay');
    if (!Number.isInteger(month) || month < 1 || month > 12) bad.push('birthMonth');
    birthday = { day, month, ownCake: str(body.ownCake) === 'yes' };
  }

  if (bad.length) return json({ ok: false, error: 'invalid', fields: bad }, 422);

  const firstVisit = str(body.firstVisit);
  const cf = (request as unknown as { cf?: { country?: string } }).cf;

  const payload = {
    id: crypto.randomUUID(),
    formType,
    status: 'pending',
    locale: str(body.locale, 5) || 'en',
    submittedAt: new Date().toISOString(),
    page: str(body.page, 200),
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    email,
    phone,
    date,
    time,
    guests,
    source: str(body.source, 60) || null,
    firstVisit: firstVisit === 'yes' ? true : firstVisit === 'no' ? false : null,
    message: str(body.message, 1000) || null,
    ...(birthday ? { birthday } : {}),
    ...(formType === 'groups' ? { group: { company: str(body.company, 120) || null, package: str(body.package, 60) || null, food: str(body.food) === 'yes', cocktailJars: Math.max(0, Math.min(20, Math.floor(Number(body.cocktailJars) || 0))) } } : {}),
    country: cf?.country ?? null,
  };

  if (!env.N8N_WEBHOOK_URL) {
    console.error('booking: N8N_WEBHOOK_URL is not set', payload.id);
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  try {
    const res = await fetch(env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env.N8N_WEBHOOK_TOKEN ? { 'X-Webhook-Token': env.N8N_WEBHOOK_TOKEN } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error('booking: n8n answered', res.status, payload.id);
      return json({ ok: false, error: 'upstream' }, 502);
    }
  } catch (err) {
    console.error('booking: n8n unreachable', String(err), payload.id);
    return json({ ok: false, error: 'upstream' }, 502);
  }

  return json({ ok: true, id: payload.id });
}
