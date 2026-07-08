# HK Wedding Venues

A live public site with real traffic — treat it as production and never push
a broken build. Vercel auto-deploys every push to main.

Directory of Hong Kong wedding venues: filters, map, comparison drawer, forum
reviews, and an AI recommender (Claude API). Vite + React 19 + TypeScript +
Tailwind. No test suite — verification is `npm run build` plus eyeballs.

## Commands
- `npm run dev` — dev server
- `npm run build` — typecheck + build; must pass before any push
- `npm run lint`
- Photos (scraping, auditing, fixing bad ones): follow "Managing venue photos"
  in README.md exactly — don't invent a new photo workflow.
- Never run `npm run deploy` — it's a legacy gh-pages script; Vercel deploys
  automatically on push.

## Before every push
- `npm run build` must pass.
- Check the change at a phone-sized viewport (~375px) — mobile layout is the
  most common regression here.
- `git pull --rebase` first — a nightly GitHub Action pushes photo updates to
  main around 02:00 HKT, so your local main is often behind.

## Gotchas
- Bad venue photo (poster / floor plan / logo)? Just deleting the file isn't
  enough — the nightly Action re-downloads it. Add the URL to
  `BLOCKED_URL_PATTERNS` in `scripts/fetch-venue-photos.ts` first, then delete
  and re-scrape (README has the exact steps).
- The AI recommender posts to `/api/recommend`: proxied by `vite.config.ts` in
  dev and `api/recommend.ts` (Vercel edge) in production. The Anthropic API key
  lives only in `.env` / Vercel env vars — it must never appear in client code.
- Site copy is English today, but Traditional Chinese (繁體中文) support is
  planned — keep user-facing strings simple and self-contained so they can be
  translated later.
