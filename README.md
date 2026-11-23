# HTML Entities Reference — PWA

A complete, searchable, installable reference of HTML character entities. Browse 531 entities across 13 categories (basic punctuation, math, arrows, Greek, Latin extended, geometric shapes, dingbats, astrology, chess, CJK punctuation, and more), filter live by name / glyph / decimal code / hex code / keyword, and copy any entity, decimal reference, or hex reference with one click. Works fully offline once installed.

![icon](icon-192.png)

---

## Features

- **531 HTML entities** across **13 categories** — every standard named entity (`&amp;`, `&lt;`, `&copy;`, `&euro;`, `&infin;`, …) plus 108 numeric-only characters (CJK brackets, chess pieces, zodiac signs, trigrams, etc.) that have no HTML5 named entity.
- **Live search** that filters as you type, across entity name, slug, glyph, decimal code, hex code, raw codepoint, keywords, and category. Multi-word queries like `corner bracket` or `chess piece` work because hyphens in slugs are normalized to spaces.
- **Three click-to-copy targets per card** — clicking the entity name copies `&amp;`; clicking `&#38;` copies the decimal reference; clicking `&#x26;` copies the hex reference. Each flashes "✓ Copied" with a toast.
- **Category chips** that combine with the text search.
- **Numeric-only badge** — entries without a named entity (e.g. `「`, `♔`, `♈`) show a small `numeric only` badge with the descriptive slug as the title.
- **Keyboard shortcuts** — press <kbd>/</kbd> to focus the search bar, <kbd>Esc</kbd> to clear it.
- **Light / dark mode** toggle, saved to `localStorage`, defaults to the OS preference. The manifest `theme-color` adapts to both schemes.
- **Installable PWA** — add to home screen / dock / desktop. Launches standalone, no browser chrome.
- **Full offline support** — the service worker pre-caches the app shell on first visit; subsequent loads work without a network connection. Reload offline and all 531 entities still render and search.
- **App shortcut** — right-click the installed app icon (or long-press on Android) to access a "Search entities" shortcut that focuses the search bar on launch.
- **Zero dependencies** — vanilla JS, hand-written CSS, no frameworks, no CDNs, no build step.

---

## File structure

```
download/
├── html-entities-reference.html   # The app (single self-contained page, data embedded)
├── html-entities.json             # JSON export of all 531 entities for reuse elsewhere
├── manifest.json                  # PWA web app manifest
├── sw.js                          # Service worker (offline caching)
├── icon-16.png                    # Favicon 16×16
├── icon-32.png                    # Favicon 32×32
├── icon-192.png                   # PWA icon 192×192 (any purpose)
├── icon-512.png                   # PWA icon 512×512 (any purpose)
├── icon-512-maskable.png          # PWA icon 512×512 (maskable — Android adaptive)
├── apple-touch-icon.png           # iOS home screen icon 180×180
└── README.md                      # This file
```

The icons are a solid blue (`#0969da`) square with a large white `&` glyph — the universal symbol of HTML entities.

---

## Quick start

The app is a single HTML file — you can open `html-entities-reference.html` directly in any browser. However, **service workers and PWA installation require the page to be served over `http://` or `https://`** (the `file://` protocol will not register a service worker).

### Serve locally

Any static file server works. Pick whichever you have available:

```bash
# Python 3 (built-in, no install needed)
cd download
python3 -m http.server 8055

# Node.js
npx serve download --listen 8055

# Or any other static server (nginx, Caddy, http-server, …)
```

Then visit <http://localhost:8055/html-entities-reference.html>.

### Deploy

Upload the entire `download/` directory to any static host. The folder is self-contained — no build step, no server-side code. Examples:

- GitHub Pages
- Netlify (drag-and-drop the folder)
- Vercel
- Cloudflare Pages
- Any S3-compatible bucket with static hosting

---

## Installing as a PWA

### Chrome / Edge / Brave (desktop)

1. Visit the page over `http(s)://`.
2. Click the **install icon** (⊕) that appears in the address bar, or click the **Install** button in the top-right of the page.
3. Confirm the install prompt. The app opens in its own standalone window and is added to your OS app list / dock / start menu.

### Chrome (Android)

1. Visit the page.
2. Tap the **"Install app"** banner if it appears, or open the browser menu → **Install app** / **Add to Home screen**.
3. The app icon is added to your home screen and launches in fullscreen standalone mode.

### Safari (iOS / iPadOS)

Safari does not support the standard install prompt; users add to home screen manually:

1. Open the page in Safari.
2. Tap the **Share** button (square with up arrow).
3. Tap **Add to Home Screen**.
4. Confirm. The icon appears on the home screen and launches in standalone mode.

### Safari (macOS)

Safari 17+ supports adding web apps to the Dock:

1. Open the page in Safari.
2. Choose **File → Add to Dock**.
3. The app launches as a separate window with its own Dock icon.

### Firefox

Firefox does not currently support PWA installation on desktop. The app still works as a normal web page; offline support via service worker still functions.

---

## Offline support

On first visit, the service worker (`sw.js`) pre-caches the entire app shell:

```
html-entities-reference.html
manifest.json
html-entities.json
icon-16.png, icon-32.png, icon-192.png, icon-512.png, icon-512-maskable.png
apple-touch-icon.png
```

The fetch strategy is **stale-while-revalidate** for navigations:

- On reload, the cached HTML is served instantly.
- A background network fetch updates the cache if the file has changed.
- The new version is visible on the next reload.

For other same-origin GETs (icons, manifest, JSON), the strategy is **cache-first** with a network fallback that populates the cache.

If the network is unavailable, the cached version is served transparently — all 531 entities render and search works normally.

---

## Data structure

### Embedded in the HTML

The full entity list is embedded as a JavaScript array assigned to `const ENTITIES = [...]` inside the HTML. Each entry is an object:

```js
{
  "name": "euro",                  // descriptive slug (also the entity name when one exists)
  "entity": "euro",                // HTML5 named entity, or null for numeric-only entries
  "decimal": "&#8364;",            // decimal character reference
  "hex": "&#x20AC;",               // hexadecimal character reference
  "glyph": "€",                    // the rendered character
  "decimalRaw": 8364,              // numeric decimal codepoint
  "hexRaw": "20AC",                // numeric hex codepoint (uppercase, no 0x prefix)
  "category": "Currency",
  "keywords": ["euro", "eur", "money"]
}
```

For numeric-only entries (CJK brackets, chess pieces, zodiac signs, etc.), `entity` is `null` and `name` is a descriptive slug like `left-corner-bracket` or `white-king`.

### Standalone JSON export

`html-entities.json` contains the same data as a standalone JSON array, useful for importing into other tools, scripts, or editors:

```js
import entities from './html-entities.json';
const euroGlyph = entities.find(e => e.entity === 'euro').glyph; // "€"
```

Stats:

- 531 total entries
- 423 named HTML entities (have an `&name;` form)
- 108 numeric-only entries (no named entity)
- 13 categories: Basic, Typography, Misc, Currency, Math, Arrows, Greek, Latin Extended, Geometric Shapes, Dingbats, Astrology, Chess, CJK Punctuation

---

## Categories

| Category | Count | Examples |
| --- | --- | --- |
| Basic | 7 | `&amp;` `&lt;` `&gt;` `&quot;` `&nbsp;` |
| Typography | 32 | `&mdash;` `&hellip;` `&ldquo;` `&bull;` `&permil;` |
| Misc | 58 | `&copy;` `&reg;` `&trade;` `&deg;` `&sect;` `&num;` `&dollar;` |
| Currency | 19 | `&cent;` `&pound;` `&yen;` `&euro;` `&ruble;` `&rupee;` |
| Math | 107 | `&plus;` `&minus;` `&times;` `&le;` `&infin;` `&sum;` `&int;` `&radic;` |
| Arrows | 44 | `&larr;` `&rarr;` `&hArr;` `&lhar;` `&map;` |
| Greek | 52 | `&alpha;` … `&omega;` `&Alpha;` … `&Omega;` |
| Latin Extended | 69 | `&Agrave;` `&aacute;` `&ccedil;` `&szlig;` `&OElig;` |
| Geometric Shapes | 29 | `■` `□` `▲` `△` `◆` `○` `★` `█` `░` |
| Dingbats | 53 | `✓` `✗` `☑` `✂` `✉` `☮` `☯` `☢` `♪` `♭` `♯` (incl. 8 trigrams) |
| Astrology | 19 | `♈` … `♓` (zodiac) `☿` `♁` `♃` `♄` `♅` `♆` `♇` |
| Chess | 12 | `♔` `♕` `♖` `♗` `♘` `♙` `♚` `♛` `♜` `♝` `♞` `♟` |
| CJK Punctuation | 30 | `、` `。` `〈` `》` `「` `」` `『` `』` `【` `】` `〔` `〕` `〖` `〗` `〰` |

---

## Customizing

### Adding or editing entities

The data is regenerated from `/home/z/my-project/scripts/build_html_entities.py`. Each entry is a tuple:

```python
# (slug, decimal_codepoint, category, keywords_string, entity_or_None)
("euro", 8364, "Currency", "euro eur money", "euro")                # named entity
("left-corner-bracket", 12300, "CJK Punctuation",
 "left corner bracket cjk japanese quote", None)                    # numeric only
```

- For 4-tuples, the slug doubles as the entity name.
- For 5-tuples with `None` as the 5th element, the entry is treated as numeric-only (no named entity).
- Hex codes and rendered glyphs are derived automatically from the decimal codepoint.

After editing, regenerate:

```bash
python3 scripts/build_html_entities.py
```

This rewrites `html-entities-reference.html` and `html-entities.json`. The service worker cache version (`CACHE_NAME` in `sw.js`) should be bumped when deploying so users get the new version:

```js
// sw.js
const CACHE_NAME = "html-entities-v2";   // ← bump on each deploy
```

### Regenerating icons

```bash
python3 scripts/generate_pwa_icons.py
```

Edit the script to change the background color, glyph, or font. The icons are regenerated to all required sizes (16, 32, 180, 192, 512, 512-maskable).

---

## Browser compatibility

| Feature | Chrome / Edge / Brave | Firefox | Safari (desktop) | Safari (iOS) |
| --- | :---: | :---: | :---: | :---: |
| Live search & filtering | ✓ | ✓ | ✓ | ✓ |
| Click-to-copy | ✓ | ✓ | ✓ | ✓ |
| Light/dark mode | ✓ | ✓ | ✓ | ✓ |
| Service worker (offline) | ✓ | ✓ | ✓ | ✓ |
| Manifest | ✓ | ✓ | ✓ | ✓ (limited) |
| Installable PWA | ✓ | ✗ | ✓ (Safari 17+) | ✓ (Add to Home Screen) |
| App shortcuts | ✓ | ✗ | ✗ | ✗ |
| Maskable icon (adaptive) | ✓ (Android) | ✗ | ✗ | ✗ |

Clipboard write requires a secure context (`https://` or `localhost`). On insecure origins, the app falls back to the legacy `document.execCommand('copy')` API.

---

## Tech stack

- **HTML / CSS / vanilla JavaScript** — no framework, no build step, no dependencies.
- **Web App Manifest** (W3C spec) — app metadata, icons, display mode.
- **Service Workers API** — offline caching with stale-while-revalidate.
- **Cache Storage API** — keyed by versioned cache name.
- **Clipboard API** (`navigator.clipboard.writeText`) with `execCommand` fallback.
- **Match Media** (`prefers-color-scheme`) for theme detection.
- **CSS Custom Properties** for theming.
- **PIL/Pillow** for icon generation (development only).
- All data and code are embedded in `html-entities-reference.html` — the entire app is one file you can email, host on a static bucket, or read offline.

---

## License

Public domain / CC0. The entity data is factual (drawn from the HTML Living Standard and Unicode). Use it however you like.
