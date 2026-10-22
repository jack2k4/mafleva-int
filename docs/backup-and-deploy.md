# Hosting and deployment

The repository includes a Render Blueprint for a single-origin deployment: Render builds the React site and serves it with the Node.js API. MongoDB Atlas stores products, testimonials, orders, and customer accounts. Cloudinary stores product uploads. Flutterwave Standard provides hosted checkout; Kenya orders offer card and M-Pesa. SMTP sends order receipts and fulfillment updates. The backend refuses to start in production without its required services and secure admin credentials.

## 1. Set up service accounts

1. Create a MongoDB Atlas database and a database user restricted to this application's database. Permit connections from the hosting service.
2. Create a Cloudinary account. Admin product images are stored in `mafleva/products`.
3. Create and complete Flutterwave merchant onboarding. Use test credentials first; configure card and M-Pesa for Kenya.
4. Configure an SMTP sender mailbox for customer receipts and fulfillment notices.
5. Connect this repository to Render and apply `render.yaml`. The blueprint uses one paid `starter` web service and one instance because the API currently caches application state in process. The free service plan is not suitable for production availability or persistent local files. Applying the blueprint provisions billable hosting; review Render's current price before creating it.

## 2. Provide Render environment values

The blueprint prompts for values marked `sync: false`. Set them in Render's service environment:

- `MONGODB_URI`: Atlas connection string
- `ADMIN_EMAIL`: production administrator email
- `ADMIN_PASSWORD_HASH`: generate with `npm run hash-admin-password` from `backend`; enter a unique password when prompted
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `FLW_SECRET_KEY`: Flutterwave secret key (test key during verification)
- `FLW_WEBHOOK_SECRET_HASH`: random webhook secret, also entered in Flutterwave
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, and `FULFILLMENT_EMAIL`

Render generates `JWT_SECRET`. The blueprint sets `FRONTEND_URL` and `CORS_ORIGINS` to the default Render URL. If you add a custom domain, set both to its exact HTTPS origin (and include `www` only if it serves the site). Keep all secrets in Render's environment settings. Never commit `.env` files or expose backend secrets in frontend build variables.

The default Flutterwave webhook URL is:

```text
https://mafleva-store.onrender.com/api/payments/flutterwave/webhook
```

Replace the host with the Render service URL or custom domain shown in the dashboard. Successful orders are finalized only after the backend verifies the transaction with Flutterwave. The webhook signature is checked against `FLW_WEBHOOK_SECRET_HASH`; duplicate events are idempotent.

## 3. Build and serve

The Render build command installs frontend and backend dependencies, builds React, and the Node service serves `frontend/build` alongside the API. This same-origin setup uses relative API paths, so `REACT_APP_API_URL` should be empty. The production server serves the SPA fallback and exposes `/health` for host health checks.

For local production configuration, see `backend/.env.example` and `frontend/.env.example`. The first production startup seeds MongoDB from the included product catalog and initializes empty testimonials, orders, and customer accounts. Use the included hash script to create the administrator credential; do not use a plain-text admin password in production.

Successful API write requests are saved to MongoDB before the API responds. The current application state cache supports one backend instance; do not scale horizontally until it is replaced with shared persistence. Customer passwords are hashed server-side and sessions use an HTTP-only cookie. Checkout validates product prices and stock on the server. Admin fulfillment changes send email, while carrier handoff remains manual because no courier provider is configured.

## 4. Backups and release checks

- Enable Atlas automated backups and point-in-time recovery, and test a restore before launch.
- Keep product uploads in Cloudinary; do not rely on the host's local filesystem for persistent media.
- Verify `/health` returns HTTP 200, the storefront loads products, admin login works, and uploaded images remain available after an API restart.
- With Flutterwave test credentials, verify successful and cancelled card/M-Pesa checkouts, invalid and duplicate webhook signatures, stock conflicts, customer registration/login/logout, and receipt/fulfillment emails before enabling live credentials.
- Confirm checkout redirects to Flutterwave and only verified payments become paid orders. Check browser requests for failed localhost API calls.
- Keep a rollback release available when deploying frontend and backend changes together.

Shipping is free in Kenya and a flat USD 12 elsewhere, converted using the storefront's configured exchange-rate table. Confirm exchange rates and delivery policy before launch. Flutterwave live credentials require merchant approval and successful end-to-end tests.
