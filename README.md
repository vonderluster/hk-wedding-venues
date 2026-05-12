# HK Wedding Venues

A directory of wedding venues in Hong Kong. Vite + React + TypeScript.

## Managing venue photos

Photos live in `public/venue-photos/<venue-id>-<n>.{jpg,png,webp,avif}` and are
referenced from `src/data/venues.ts` as `/venue-photos/<venue-id>-<n>.<ext>`.

### Automatic — for most venues

```bash
npx tsx scripts/fetch-venue-photos.ts             # all venues missing photos
npx tsx scripts/fetch-venue-photos.ts --venue=X   # one venue (after deleting bad photos)
```

The scraper tries five sources in priority order:

1. **`OVERRIDE_IMAGES`** in the script — hand-picked URLs that bypass scraping.
2. **`OFFICIAL_PAGES`** — curated wedding/event pages per venue
   (Marriott, Hilton, Shangri-La, etc.). Falls back to the venue's `enquiryUrl`.
3. **`HAND_PICKED`** — known Wikimedia Commons filenames.
4. **Existing Wikimedia / LCSD / official URLs** already in `venue.images[]`.
5. **Wikimedia Commons API search** for `"<venue name> Hong Kong"` —
   the auto safety net for heritage sites, beaches, and landmarks.

The script is idempotent — re-running only downloads what's missing. A
nightly GitHub Action (`.github/workflows/refresh-venue-photos.yml`) runs
it automatically.

### Auditing what's there

```bash
npx tsx scripts/audit-venue-photos.ts
open public/venue-photos/_audit.html
```

This generates a single-page HTML report showing every venue's photo, its
file size, and the source URL. Flagged photos (small file, or URL contains
suspicious words like "poster" or "floorplan") are highlighted with a
copy-paste snippet for adding deny patterns.

### Fixing a bad photo

When a venue's hero photo looks wrong (event poster, floor plan, logo, etc.):

1. Open the audit report and find the offending row.
2. Click "Mark this as bad" — copy the suggested deny snippet.
3. Paste it into `BLOCKED_URL_PATTERNS` in `scripts/fetch-venue-photos.ts`.
4. Delete and re-scrape that venue:

   ```bash
   rm public/venue-photos/<venue-id>-*.{jpg,png,webp,avif}
   npx tsx scripts/fetch-venue-photos.ts --venue=<venue-id>
   ```

### Manual upload — for venues automation can't reach

Some venues (private gardens, niche restaurants, by-application estates)
don't have public photos the scraper can find. To add one manually:

1. Get a photo from the venue's Instagram / Facebook / press article /
   your own visit — anything you have permission to use.
2. Save it to `public/venue-photos/<venue-id>-1.jpg` (or `.png` / `.webp`).
   Use the exact `id` value from `src/data/venues.ts`. Aim for at least
   800×600, ideally ≥1200×800.
3. Run the script for just that venue:

   ```bash
   npx tsx scripts/fetch-venue-photos.ts --venue=<venue-id>
   ```

   It will see the file is already present, skip downloading, and wire the
   local path into `venues.ts`.

4. Commit and push:

   ```bash
   git add public/venue-photos/ src/data/venues.ts
   git commit -m "Add manual photo for <venue-id>"
   git push
   ```

When automation can't find a photo, the venue card falls back to a stylized
icon hero (based on `venueTypes[0]`) with the district label — looks
intentional, not broken — so it's safe to leave a venue without a photo
indefinitely.

## Development

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
