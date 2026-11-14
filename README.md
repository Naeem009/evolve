# EVOLVE

Premium clothing storefront for Pakistan. The design and the sitemap follow the EVOLVE development spec.

## Run

```bash
cd evolve
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The local studio is at `/studio`. Copy `.env.example` to `.env.local` and set `ADMIN_PASSWORD`. The sample local password, if you use the provided `.env.local`, is `evolve-studio`. Restart the dev server after changing env values.

Promo codes: `EVOLVE10` (10% off) and `WELCOME500` (PKR 500 off orders of PKR 5,000 or more).

## What is running locally

- Catalog, bag, guest checkout, Cash on Delivery, a sandbox card page, and bank transfer
- Pakistani provinces, cities, shipping zones and phone validation
- Account, wishlist, order tracking, exchange requests
- Policy pages, size guide, product feeds, sitemap
- Orders are stored in `data/orders.json` on this machine

Medusa, Sanity, live payment gateways and courier APIs are not connected yet. Prices are calculated on the server from the catalog, never from the browser.

## Defaults until the business confirms them

- Free standard delivery from PKR 8,000
- COD fee PKR 150 under that threshold, COD limit PKR 50,000
- Exchange window 7 days
- WhatsApp number is a placeholder in `.env.local`
