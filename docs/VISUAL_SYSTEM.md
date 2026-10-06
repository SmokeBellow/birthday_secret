# Visual system

## Approved direction
Use the supplied final assets as production art. Do not regenerate them unless the user explicitly requests a replacement.

The current UI is a warm retro-game interface:
- parchment / warm cream page base;
- dark navy-charcoal primary ink;
- muted terracotta/orange accent;
- muted green secondary states;
- retro display serif/slab feeling for large headings;
- monospaced/terminal feeling for small stage/progress labels;
- strong outlined cards, thin rules and offset shadows;
- cozy pixel-cartoon/chibi art.

References:
- `reference/ORIGINAL_STYLE_REFERENCE.jpeg`
- `reference/APPROVED_STYLE_LOCK.png`

## Header
Shared row:
`LEVEL XX / 30 + STAGE LABEL` on the left and one level icon aligned on the right.

The icon belongs to the row; it must never float independently.

## Level composition
Preferred mobile vertical rhythm:

1. Home/navigation control
2. Level metadata/header
3. Main title
4. Intro
5. Objective/help text
6. Scene
7. Interaction area
8. Persistent HUD/build progress

Mechanic-specific scenes may combine 6 and 7.

## Buttons
- minimum comfortable mobile touch size;
- clear active/pressed/completed/disabled states;
- readable Russian copy;
- no decorative icon unless it communicates meaning;
- no random emoji.

## CSS-rendered elements
The keys in `CSS_RENDERED_ASSET_KEYS.json` are not missing art.
Build them as clean HTML/CSS controls/cards/slots.

Do not display:
- semantic key names;
- `UI`;
- `SCENE_ASSET`;
- checkerboards;
- development borders.

## Character continuity
Hero, Player 2 and Lapka are persistent characters.
Do not substitute arbitrary avatars or redesign them.

Player 2 joins at L19 and remains available afterward.
Lapka joins at L21 and remains available afterward.
