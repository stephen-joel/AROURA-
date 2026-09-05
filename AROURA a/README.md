# AROURA — Music becomes light

Fresh AROURA music-platform build by **Helupack Systems**.

## Included
- Responsive music streaming UI
- Northern Lights / Aurora Borealis visualizer
- Functional audio player with seek, next/previous and likes
- Search, library and playlist sections
- Premium page
- M-PESA STK Push frontend + Netlify Functions backend
- Original demo audio and artwork

## Important: GitHub Pages + M-PESA
GitHub Pages can host the **static AROURA frontend**, but it cannot run the server-side Netlify Functions needed to safely call Safaricom Daraja. GitHub Pages is a static hosting service. For live STK Push, deploy this same repository on Netlify (or another serverless backend) and configure the Daraja environment variables there.

Do **not** put `MPESA_CONSUMER_SECRET` or `MPESA_PASSKEY` in `app.js` or any public GitHub file.

### Netlify environment variables
- `MPESA_ENVIRONMENT` = `sandbox` while testing
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `MPESA_CALLBACK_URL` = your public HTTPS callback URL, e.g. `https://YOUR-SITE.netlify.app/.netlify/functions/mpesa-callback`

The STK Push destination is a registered Lipa na M-PESA shortcode/Till/PayBill setup, not a normal personal Send Money number.

## Copyright
Only upload music you own or are licensed to stream. The demo tracks are generated original tones for testing.