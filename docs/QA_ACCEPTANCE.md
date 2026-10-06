# Acceptance / QA checklist

## Build
- TypeScript passes.
- Production build passes.
- No runtime exceptions in normal progression.
- No backend required.

## Full flow
- Start -> Levels 1–30 -> achievements -> Level 30 build -> post-game.
- Every level completes.
- No deadlocks.
- Soft-fail mechanics always recover.
- Normal home navigation preserves progress.
- Reset confirmation works and clears only this game.

## Milestones
- Compass persists after L5.
- L13 checkpoint reflects accumulated early rewards.
- Player 2 unlocks at L19 and persists.
- Ring persists after L20.
- Lapka unlocks at L21 and persists.
- Advanced navigation appears after L25.
- L30 uses actual accumulated categories/rewards.
- Post-game starts only after L30 achievement.

## Assets
- `ASSET_MAP.json` paths load.
- No mapped asset shows a semantic placeholder.
- CSS-rendered keys do not show filenames/placeholders.
- Truly unknown keys keep development fallback.
- No broken images.
- No hero/Player 2/Lapka cropping.
- Existing certificate PDF link remains intact once supplied.

## Required targeted level checks
- L1: tap target distinct from character slot.
- L2: all three cards open once; copy matches.
- L3: divide -> fold -> blow; no fourth tulip button.
- L4: passive board + pawn + knight.
- L7: duck targets + bread projectile.
- L13: item-prefixed inventory art and SAVE COMPLETE.
- L17: six candidates, exactly one bug.
- L18: no fabricated P2 answers.
- L19: alternating P1/P2, Player 2 joins.
- L21: Lapka joins.
- L23: Lapka reactive sequence.
- L24: taxi -> takeoff -> cruise -> landing.
- L26: any two elements valid.
- L27: wrong portal is recoverable.
- L28: layers accumulate.
- L29: four final fact cards.
- L30: six build categories + hero_build_complete.
- Post-game certificate flow.

## Responsive
Test:
- 320×~700
- 375×~812
- 390×844
- 430×932

No horizontal overflow.
No header/title collision.
Touch controls stay usable.
