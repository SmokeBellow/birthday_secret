# BUILD 30.0 — implementation architecture

## Target stack
Recreate as a mobile-first React + TypeScript application. Vite is the preferred bundler if starting from an empty project.

No backend is required. Do not add authentication, database or server state.

## Source-of-truth priority
1. `source_of_truth/GAME_SPEC_V2.json` — gameplay, mechanics, progression and post-game flow.
2. `source_of_truth/GAME_COPY_V2.json` — all visible copy.
3. `public/assets/v2/ASSET_MAP.json` — image asset routing.
4. `source_of_truth/CSS_RENDERED_ASSET_KEYS.json` — semantic keys intentionally rendered as HTML/CSS.
5. `source_of_truth/FINAL_ASSET_AUDIT.json` — runtime audit and historical QA evidence.
6. Reference images are visual guidance only and never override canonical game data.

## Shared screen architecture
Use one reusable application shell, not thirty bespoke pages:

- `GameApp`
- `StartScreen`
- `LevelScreen`
  - `LevelHeader`
  - `LevelScene`
  - `InteractionArea`
  - `GameHUD`
- `AchievementScreen`
- `PostGame`
- `DevPanel`

`LevelScreen` chooses a reusable mechanic component based on `mechanic.type`.

## Mechanics
The current canonical spec uses reusable mechanic families including:

- `rapidTapProgressiveReveal`
- `independentRevealCards`
- `orderedSequence`
- `spatialChoice`
- `routeChoice`
- `hiddenObject`
- `movingTargetAim`
- `resourceTap`
- `collectRequiredPlusOptional`
- `timingWindow`
- `choice`
- `stabilityGauge`
- `inventorySort`
- `linkChain`
- `choiceWithEscalation`
- `pipeline`
- `spotTheBug`
- `pairedQuiz`
- `alternatingCoop`
- `inspectThenEquip`
- `characterInteraction`
- `sceneExploration`
- `reactiveTap`
- `multiStepRoutePuzzle`
- `combineAnyTwo`
- `layerBuilder`
- `finalBuildAssembly`

Reuse components whenever behavior is genuinely the same.

## Progress
Use one versioned localStorage object. Suggested schema:

```ts
type GameProgress = {
  version: 2;
  currentLevel: number;
  completedLevels: number[];
  achievements: string[];
  unlockedItems: string[];
  player2Unlocked: boolean;
  lapkaUnlocked: boolean;
  build30Complete: boolean;
};
```

Centralize:
- `loadProgress()`
- `saveProgress()`
- `completeLevel()`
- `unlockReward()`
- `resetProgress()`

Do not scatter direct localStorage calls through mechanic components.

## Normal navigation
- Start CTA: `СОБРАТЬ БИЛД`
- On game/achievement screens: `← В НАЧАЛО`
- Returning home preserves progress.
- Start screen shows `СБРОСИТЬ ПРОГРЕСС` only if progress exists.
- Reset requires confirmation and clears only this game's localStorage data.

## Dev Mode
Support `?dev=1`.

Dev panel:
- Jump to Level 1–30
- Previous / Next
- Restart current level
- Preview achievement
- Reset progress
- Show unlocks
- Seed prerequisite progression for late-level QA only in Dev Mode
- Preview Level 30 and post-game flow

## Asset resolver
Read `public/assets/v2/ASSET_MAP.json`.

Resolution rules:
1. Mapped semantic key -> render image.
2. Known key from `CSS_RENDERED_ASSET_KEYS.json` -> render component HTML/CSS, no image placeholder.
3. Truly unknown key -> development fallback + console warning.

Never hardcode asset file paths inside level mechanic components.

For image rendering:
- backgrounds: `object-fit: cover`
- alpha sprites/items/icons: `object-fit: contain`
- preserve full hero / Player 2 / Lapka silhouettes.

## Level 18
The three Player 2 answers are intentionally not supplied. Never invent them.
Use `LEVEL18_PLAYER2_ANSWERS_TEMPLATE.json`.
Until configured, Dev Mode may show a clear development notice.

## Post-game
After Level 30 achievement run the canonical `postGameFlow`:

1. BUILD COMPLETE summary
2. BONUS MISSION UNLOCKED
3. Boeing 737 simulator certificate reveal
4. MISSION ACCEPTED
5. LEVEL 30+

Do not automatically reset completed progress.

## Mobile UX
Primary design widths: 320, 375, 390, 430 px.

Requirements:
- no horizontal scrolling;
- large touch targets;
- title and header icon never collide;
- interactive art and decorative art are visually distinct;
- no semantic key/filename is visible in normal play;
- cards/slots/gauges remain DOM/CSS where specified;
- game remains completable without animation support.
