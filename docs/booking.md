# Booking requests

Table, birthday and group forms all post to `/api/booking`. Nothing is confirmed
automatically: staff confirm or decline every request in Telegram.

```
Browser form ──JSON──▶ Worker /api/booking ──JSON + X-Webhook-Token──▶ n8n
                       (origin, honeypot,                               ├─ Google Sheet row (Pending)
                        Turnstile, fields)                              ├─ Email guest: "request received"
                                                                        └─ Telegram group: Confirm / Decline
```

## What the Worker checks (worker/index.ts)

- `Origin` is the site itself (add a preview origin with the `ALLOWED_ORIGINS` var).
- Hidden `website` honeypot is empty (bots that fill it get a fake success).
- Cloudflare Turnstile token, when `TURNSTILE_SECRET` is set.
- Fields: names, email, phone, date (today to one year ahead, Phnom Penh time),
  time slot, guests within the form's limits, consent ticked, birthday day/month.
- If n8n is not configured or fails, the form shows the phone number and Telegram
  link so the booking is never lost silently.

| Form | Guests | Time slots |
|---|---|---|
| table | 1 to 6 | 17:00 to 22:00, every 30 min |
| birthday | 2 to 20 | 17:00 to 21:30 |
| groups | 20 to 200 | 17:00 to 22:00 |

Limits live in `src/lib/booking.ts` (form) and `worker/index.ts` (server); change both.

## Payload sent to n8n

```json
{
  "id": "0d6c…",               // unique request id, use it as the Sheet row key
  "formType": "table",          // table | birthday | groups
  "status": "pending",
  "locale": "en",
  "submittedAt": "2026-11-18T06:41:58.060Z",
  "page": "/booking/",
  "firstName": "Dara", "lastName": "Sok", "name": "Dara Sok",
  "email": "dara@example.com", "phone": "+855 12 345 678",
  "date": "2026-11-21", "time": "19:00", "guests": 3,
  "source": "Google search",    // or null
  "firstVisit": true,           // true | false | null
  "message": null,
  "birthday": { "day": 12, "month": 3, "ownCake": true },                              // birthday only
  "group": { "company": "ACME", "package": "option-2", "food": true, "cocktailJars": 2 }, // groups only
  "country": "KH"
}
```

The Worker sends the header `X-Webhook-Token: <N8N_WEBHOOK_TOKEN>`. n8n must
reject requests without it and answer `200 {"ok": true}` once the row is saved.

## n8n workflow (to build once the bot and group exist)

1. **Webhook** (POST, respond via "Respond to Webhook") → **IF** header token matches.
2. **Google Sheets: Append** to "Le Moon bookings" (one column per field, `status = Pending`).
3. **Send email** to the guest: "We have received your request… we will confirm shortly".
4. **Telegram: Send message** to the staff group with the details and an inline
   keyboard: `Confirm` (`callback_data = confirm:<id>`) and `Decline` (`decline:<id>`).
5. **Respond to Webhook** `{"ok": true}`.

Second workflow, **Telegram Trigger** (callback_query):

1. Split `confirm|decline` and `id`; look up the row by `id`.
2. Update the row: `Confirmed` / `Declined`, who tapped it and when.
3. Email the guest the confirmation, or the polite "fully booked, please call or pick another time".
4. Edit the Telegram message to show the outcome and who handled it; answer the callback.

Optional: a schedule that re-posts requests still `Pending` after 30 minutes.

## Secrets and variables

| Name | Where | What |
|---|---|---|
| `N8N_WEBHOOK_URL` | Worker secret | Production webhook URL of workflow 1 |
| `N8N_WEBHOOK_TOKEN` | Worker secret | Long random string, also checked in n8n |
| `TURNSTILE_SECRET` | Worker secret | Turnstile widget secret key |
| `PUBLIC_TURNSTILE_SITE_KEY` | Build variable | Turnstile widget site key (hostnames: www.le-moon-rooftop.com and the workers.dev preview) |
| `ALLOWED_ORIGINS` | Worker variable (optional) | Extra origins allowed to post, comma-separated |

## Testing locally

```sh
npm run build
printf 'N8N_WEBHOOK_URL=http://127.0.0.1:8799/hook\nN8N_WEBHOOK_TOKEN=test\n' > .dev.vars
npx wrangler dev   # site + Worker on http://localhost:8787
```
