# START HERE — BUILD 30.0 Claude handoff

This folder contains the source of truth and production assets needed to recreate the birthday game from scratch.

## For Claude Code
Keep this entire folder inside the working repository. `CLAUDE.md` contains the project rules Claude should follow automatically.

Then tell Claude:

> Read `CLAUDE.md` and all files it identifies as canonical. Recreate BUILD 30.0 from scratch. Do not invent missing content. Work until the app builds and the QA checklist passes.

## For Claude web / a Project
Upload:
1. `CLAUDE_PROJECT_PROMPT.md`
2. the three canonical JSONs in `source_of_truth/`
3. `CSS_RENDERED_ASSET_KEYS.json`
4. `LEVEL18_PLAYER2_ANSWERS_TEMPLATE.json`
5. the `public/assets/v2/` folder or this full ZIP
6. the reference images if file limits allow.

Ask Claude to follow `CLAUDE_PROJECT_PROMPT.md`.

## Canonical files
- `source_of_truth/GAME_SPEC_V2.json`
- `source_of_truth/GAME_COPY_V2.json`
- `public/assets/v2/ASSET_MAP.json`
- `source_of_truth/CSS_RENDERED_ASSET_KEYS.json`

Everything else is support, audit or reference material.

## Known external input
The real Boeing 737 simulator certificate PDF is not included.
See `docs/MISSING_INPUTS.md`.

## Do not do
- Do not copy old prototype architecture.
- Do not invent Russian copy.
- Do not invent Level 18 Player 2 answers.
- Do not invent certificate content.
- Do not create 30 unrelated page components.
- Do not replace CSS UI with raster images.
