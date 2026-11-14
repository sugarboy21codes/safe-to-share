# CLAUDE.md: Safe-to-Share Data Sanitizer

## What this is
A browser-only tool that replaces personal data and credentials in text or a CSV with consistent placeholders ([PERSON_A], [EMAIL_1]), then restores the real values in an AI reply. Personal proof-of-concept project by Temitomiwa Adesina. Present it as a standalone personal project, not as a King Makers product.

## Hard rules
- Everything stays in ONE file: `index.html` (HTML, CSS and JavaScript inline). No build step, no framework, no backend.
- The page must make zero outside network requests: no CDN scripts, no web fonts, no analytics. That is the privacy promise in the README.
- Never send user text anywhere. Detection is rules and word lists only.
- No em dashes anywhere, in code comments, UI copy or docs. Write "%" not "percent".
- Plain, specific UI copy in sentence case.

## Code map (inside index.html)
- Between `/*ENGINE-START*/` and `/*ENGINE-END*/`: the detection engine (pure JavaScript, no DOM). Tests load only this block.
  - `DET`: pattern detectors (keys, cards, phones, etc.) with priority `p`
  - `people()`: name detection (first-name list, labels like "From:", context cues, names inside emails)
  - `scrub()`, `restore()`, `scrubCSV()`, `Session` (placeholder mapping and key export)
- After the engine: UI wiring for the Text, CSV, Restore and Rules tabs.
- Downloads: uses the browser's normal download inside a regular page; uses `window.claude.use("downloads")` only when running inside Claude.

## Tests
Run from the project root with Node.js:
- `node tests/held-out-final.js`: the score quoted in the README (expect 95.5% caught, 97.7% precision)
- `node tests/held-out-1.js`: second set, used to find gaps
- `node tests/dev-set.js`: first set, used while building

## Benchmark honesty
- `tests/held-out-final.js` is the reported score. Do NOT change detection rules to fix specific misses from that set and then quote the new number as a held-out score. If rules change, build a NEW untouched test set and score it once.
- Any change to the engine must keep `node tests/dev-set.js` at 100% and must be re-scored before README numbers are updated.

## Known gaps (roadmap)
1. Names without nearby cues ("loop in Talal Hijazi") are missed. Planned fix: an in-browser name-recognition model via Transformers.js, loaded from the site's own files so no data leaves the device.
2. Browser extension that cleans text before it is pasted into AI tools.
