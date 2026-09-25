# WhatsApp Business Platform / Cloud API

This branch prepares TD Fahrzeugcodierung for the official Meta WhatsApp Cloud API.

## Endpoints

- Webhook callback: `https://td-fahrzeugcodierung.de/api/whatsapp/webhook`
- Internal text-send endpoint: `POST /api/whatsapp/send`

The send endpoint is protected with an internal bearer secret and is not intended to be called directly from public browser code.

## Required Vercel environment variables

Set these only in Vercel/Meta. Never commit their values to GitHub.

```
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_INTERNAL_API_SECRET=
META_GRAPH_VERSION=v26.0
```

## Meta setup

1. Create/select a Meta Business Portfolio and Meta app with WhatsApp.
2. Connect the existing WhatsApp Business number using Meta's supported onboarding/coexistence flow when available for the account.
3. Register this callback URL:
   `https://td-fahrzeugcodierung.de/api/whatsapp/webhook`
4. Use the same value for the Meta webhook verify token and `WHATSAPP_VERIFY_TOKEN`.
5. Subscribe the WhatsApp webhook to message events.
6. Put the Meta app secret into `WHATSAPP_APP_SECRET`.
7. Put the WhatsApp phone-number ID into `WHATSAPP_PHONE_NUMBER_ID`.
8. Use an appropriate long-lived/permanent Meta access token for `WHATSAPP_ACCESS_TOKEN`.
9. Protect internal sends with a strong `WHATSAPP_INTERNAL_API_SECRET`.

## Security

Incoming webhook POST requests are validated against Meta's
`X-Hub-Signature-256` HMAC signature. The application deliberately does not log
message text or customer phone numbers.

## Messaging rules

Free-form replies are subject to WhatsApp's customer-service conversation rules.
Business-initiated outreach outside the permitted window generally requires an
approved template and appropriate recipient consent/opt-in. This implementation
does not bypass Meta's messaging policies.
