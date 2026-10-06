# BUILD 30.0 — Claude project instructions

You are recreating a finished mobile birthday game called BUILD 30.0.

Read these files before writing code:
- `START_HERE.md`
- `source_of_truth/GAME_SPEC_V2.json`
- `source_of_truth/GAME_COPY_V2.json`
- `source_of_truth/CSS_RENDERED_ASSET_KEYS.json`
- `public/assets/v2/ASSET_MAP.json`
- `docs/IMPLEMENTATION_ARCHITECTURE.md`
- `docs/VISUAL_SYSTEM.md`
- `docs/QA_ACCEPTANCE.md`
- `docs/MISSING_INPUTS.md`

## Non-negotiable rules
- Canonical JSON data overrides assumptions.
- Never invent missing visible copy.
- Never invent Level 18 Player 2 answers.
- Never invent certificate personal details.
- Do not modify canonical JSON simply to make implementation easier.
- Build a data-driven shared LevelScreen with reusable mechanics.
- Do not build thirty independent hardcoded screens.
- No backend.
- Persist progress in localStorage.
- Preserve normal `← В НАЧАЛО` navigation and confirmed reset flow.
- Support `?dev=1`.
- Use the provided production assets.
- Semantic asset paths must go through one resolver and `ASSET_MAP.json`.
- Known CSS-rendered semantic keys are not missing images.
- Keep unknown-key development fallback.
- Do not show semantic key names or placeholder labels in normal play.
- Preserve the Level 30 + certificate post-game sequence.

## Implementation order
1. Project shell, data layer, asset resolver, progress.
2. Shared layout and Start/Achievement/PostGame screens.
3. Mechanic component registry.
4. Levels 1–4 and validate architecture.
5. Levels 5–30.
6. Post-game.
7. Assets and visual polish.
8. Dev Mode.
9. Run full `docs/QA_ACCEPTANCE.md`.

Do not stop at a static mockup. The deliverable is the playable game.
