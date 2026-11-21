# Maison Muse

A small, responsive beauty, fashion, and jewellery storefront built with React and Vite. Product browsing, category filters, search, product details, favourites, and a shopping bag work out of the box. The Shop editor manages the product list.

## Run locally

```sh
npm install
npm run dev
```

## Deploy to Vercel

Import this folder as a Vite project in Vercel and deploy. Vercel serves the React app and the `/api/products` serverless function.

For a new Supabase project, run [`supabase.sql`](./supabase.sql). For the existing deployed shop, run [`supabase-category-migration.sql`](./supabase-category-migration.sql) instead; it enables custom categories without reseeding or changing existing products. Then set these Vercel environment variables:

- `SUPABASE_URL` — your project URL
- `SUPABASE_SERVICE_ROLE_KEY` — the server-side service role key (keep it in Vercel settings; never put it in frontend code)
- `ADMIN_TOKEN` — a private shop key you choose; the `/admin` editor asks for this before allowing product/category changes

Redeploy after adding the variables. Open `https://your-domain.vercel.app/admin` to sign in to the editor. Its Products tab can add, update, and remove products; its Categories tab can add new categories. New categories are saved to Supabase and become available in the storefront filters and product editor. Without those variables the shop still works as a browser demo, with product edits saved in that browser's local storage.

Checkout is a working cart journey with a checkout handoff placeholder. Connect Stripe or another payment provider before accepting real payments. Orders are not stored yet. Testimonials are sample storefront content and should be replaced with permissioned customer reviews before launch.
