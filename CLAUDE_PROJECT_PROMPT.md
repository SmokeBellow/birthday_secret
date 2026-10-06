# Claude build prompt — recreate BUILD 30.0

Recreate the complete mobile birthday game in this package.

First read:
- `START_HERE.md`
- `CLAUDE.md`
- all canonical source-of-truth JSON files;
- architecture, visual and QA docs.

Do not begin implementation until you have parsed all 30 levels and the post-game flow.

## Goal
Produce a fully playable mobile-first game:
Start -> 30 levels -> achievements/rewards -> BUILD 30.0 final assembly -> bonus mission -> Boeing 737 simulator certificate -> MISSION ACCEPTED -> LEVEL 30+.

## Technical baseline
Use React + TypeScript + Vite when starting from scratch.
No backend.
Use localStorage.

## Required behavior
The exact mechanics, copy, progression, achievements and post-game sequence come from the canonical JSON.

Use one shared level architecture and reusable mechanic components.
Use `public/assets/v2/ASSET_MAP.json` for image resolution.
Use `source_of_truth/CSS_RENDERED_ASSET_KEYS.json` so intentional CSS UI never displays fake missing-asset placeholders.

Do not invent:
- visible copy;
- Player 2 quiz answers at L18;
- certificate details.

For L18, leave the answers explicitly unconfigured until the user supplies them.
For the certificate, implement the final reveal and expect the real external PDF at:
`public/assets/flight-simulator-certificate.pdf`.

## UX requirements
Mobile-first 320–430 px.
No horizontal scroll.
Large touch targets.
Persistent progress.
`← В НАЧАЛО` returns home without wiping progress.
Start screen allows confirmed `СБРОСИТЬ ПРОГРЕСС` when a save exists.
Support `?dev=1`.

## Quality bar
The game must be functional, not a static recreation.
After coding, execute the complete checklist in `docs/QA_ACCEPTANCE.md`.
Fix issues you find rather than merely reporting them.

At completion report:
- architecture;
- mechanics implemented;
- QA status;
- unresolved external inputs only.
