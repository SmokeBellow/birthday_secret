# Требования к новым изображениям BUILD 30.0 (для ChatGPT)

Документ написан так, чтобы по нему ChatGPT мог сделать все 145 картинок (мастер-промпт и промпты по одному вставляются по частям), которые встанут в игру без правок кода.
Машиночитаемая версия: `docs/image_manifest.json` (те же ключи, размеры, фоны, описания и готовые промпты).

## 1. Главное

- Новые файлы **заменяют старые один в один**: имя файла = семантический ключ из `ASSET_MAP.json` (например, `hero_compass.png`). Ключи, пути и код игры не меняются.
- Сейчас картинки маленькие (персонаж ~90×140 px), у них рамки, обрезанные края, соседние плитки и «шахматка». Новые должны быть **крупные, чистые, свободные спрайты**: один объект, без плитки-фона и рамок.
- Всего **145 спрайтов** + 6 необязательных новых (раздел 8). 28 фонов (`bg_*`) уже хорошие и **не переделываются**.
- Игра смотрится на телефоне: спрайт показывается примерно 100–260 px по высоте, на экранах 2–3× плотности. Поэтому размеры в таблице ниже с запасом.

## 2. Как работать с ChatGPT (порядок)

1. Откройте новый чат. Прикрепите `reference/APPROVED_STYLE_LOCK.png` (лист стиля) и вставьте **мастер-промпт** из раздела 6.
2. Сначала попросите **листы персонажей** (Антон, Маша, Лапка по одной картинке на каждого, во весь рост, на плоском фоне). Проверьте, что лица, волосы, очки и одежда совпадают с референсом. Если хотя бы один персонаж «поплыл», исправляйте его до того, как идти дальше.
3. Затем генерируйте по одной картинке в сообщении: вставляйте промпт из раздела 7 (он уже содержит размер, фон и описание). Для каждого нового персонажа прикладывайте его утверждённый лист.
4. Сохраняйте результат под именем `<ключ>.png` в одну папку, например `new_sprites/hero_compass.png`.
5. Если ChatGPT отдаёт картинку с шахматкой, тенью или рамкой, не принимайте её: напишите «повтори, фон строго плоский #00FF00, без тени, без рамки».
6. Когда папка готова, передайте её мне. Я запущу `scripts/import-sprites.py`, он вырежет фон, подгонит размеры и положит файлы на места.

**Про прозрачность.** Генераторы часто не умеют честный прозрачный PNG. Поэтому просим **плоский однотонный фон** (`#00FF00` зелёный, `#FF00FF` розовый там, где в объекте есть зелёное, `#000000` чёрный для свечений). Скрипт вырезает этот цвет и убирает цветную кайму. Не просите «transparent background» вместо этого: чаще всего получается шахматка.

## 3. Стиль (общий для всех)

> cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet

Палитра игры: тёплый пергамент, тёмно-синие контуры, терракотовый акцент, приглушённый зелёный. Свет всегда тёплый, мягкий. Никакого фотореализма, никакого 3D-рендера.

## 4. Персонажи (канон внешности)

- **Anton (hero)**: adult man in his 30s, chibi proportions (head about 40% of body height), messy curly auburn-brown hair, rectangular black-rimmed glasses, short trimmed beard, dark navy-black hoodie with white drawstrings, blue jeans, dark sneakers with white soles.
- **Masha (Player 2)**: adult woman, chibi proportions identical to Anton, long wavy golden-blonde hair, round black-rimmed glasses, the same dark navy-black hoodie as Anton, blue jeans, dark sneakers with white soles.
- **Lapka (cat)**: small fluffy jet-black kitten, very round head, big round golden-yellow eyes, pink inner ears and nose, short tail, soft fur texture.

Все изображения одного персонажа должны быть одним и тем же человеком или котом: те же лицо, причёска, очки, борода (у Антона), худи.

**Масштаб в семействе.** Все `hero_*` рисуются в одном масштабе: высота тела одинаковая (±3%), стоят на одной линии низа. Так при смене состояния герой не прыгает. То же для `player2_*` и для `lapka_*`. Позы можно менять, пропорции нет.

## 5. Технические требования

| Категория | Холст, px | Объект занимает | Фон | Куда кладём |
|---|---|---|---|---|
| Персонаж (Антон, Маша, `world_hero_layer`) | 1024×1280 | ~86% высоты, ноги на 6% от низа, по центру | `#00FF00` | `characters/` |
| Лапка (`lapka_*`) | 1024×1024 | ~86% высоты, лапы на 6% от низа | `#00FF00` | `characters/` |
| Иконка уровня, предмет, значок | 1024×1024 | ~80% | `#00FF00` (или `#FF00FF`) | `level_icons/`, `items_rewards/` |
| Свечение/эффект (`effect_*`, `*_effect`) | 1024×1024 | ~90%, по центру | `#000000` чёрный | `items_rewards/`, `effects/` |
| Спрайт сцены | 1024×768 | ~76% | `#00FF00` (или `#FF00FF`) | `scene_assets/` |
| Интерфейсный арт (панели, стопка карточек) | 1536×1152 | ~92% | `#00FF00` | `scene_ui_art/` |

Формат: PNG, sRGB. Внутри кадра минимум 6% пустого поля со всех сторон: ничего не обрезано (кончики ушей, хвост, пламя, крылья целиком).

## 6. Мастер-промпт (вставить первым сообщением вместе с листом стиля)

```text
You are the sprite artist for a mobile birthday game called BUILD 30.0. I will ask for sprites one at a time.
Use the attached image as a strict style reference (art style, outline weight, palette, character designs).

STYLE: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet.

CHARACTER CANON (never change these):
- Anton (hero): adult man in his 30s, chibi proportions (head about 40% of body height), messy curly auburn-brown hair, rectangular black-rimmed glasses, short trimmed beard, dark navy-black hoodie with white drawstrings, blue jeans, dark sneakers with white soles.
- Masha (Player 2): adult woman, chibi proportions identical to Anton, long wavy golden-blonde hair, round black-rimmed glasses, the same dark navy-black hoodie as Anton, blue jeans, dark sneakers with white soles.
- Lapka (cat): small fluffy jet-black kitten, very round head, big round golden-yellow eyes, pink inner ears and nose, short tail, soft fur texture.

TECHNICAL RULES FOR EVERY IMAGE:
- One subject per image, centered, at least 6% margin on every side, nothing cropped.
- Background must be a perfectly flat single color given in the request (chroma green #00FF00, magenta #FF00FF, or black #000000 for glows). Do not use that color in the subject.
- No text, letters, numbers or watermark anywhere (except where the description explicitly says a generic symbol).
- No frame, border, rounded tile, card background or panel behind the subject.
- No checkerboard / transparency-grid pattern, no gradient or textured background.
- No ground shadow, floor, cast shadow or reflection.
- No second character or neighbouring item unless the description asks for it.
- Do not crop the subject: every part (hair, tail, tips of ears, flame, wings) must be fully inside the canvas.
- No extra props that are not in the description.
- Keep the same face, hair, glasses, beard and outfit across all images of the same character.
- Keep identical scale across all images of the same character family (hero, player2, lapka).
- Output exactly one PNG per request at the stated canvas size. Reply with the image only (no commentary) unless something is unclear.

First task: confirm you understood by generating character reference images of Anton, Masha and Lapka, one image each, full body, neutral pose, on flat #00FF00.
```

## 7. Промпты по изображениям

Каждый блок: **ключ**, файл, холст, фон, где используется в игре. Ниже промпт, готовый к вставке.

### Персонажи (26)

**`hero_base.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L01 hero; L01 reward; L02 hero; L03 hero; L04 hero

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Anton standing relaxed, front three-quarter view, arms loose, small friendly smile. Neutral base pose. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other hero images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named hero_base.png.
```

**`hero_compass.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L05 hero; L06 hero; L07 hero; L08 hero

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Anton holding a brass pocket compass in his right hand, looking at it, confident navigator pose. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other hero images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named hero_compass.png.
```

**`hero_backpack.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L09 hero

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Anton with a green-brown hiking backpack on his back, thumbs under the straps, ready for a trip. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other hero images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named hero_backpack.png.
```

**`hero_tulip.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L10 hero; L11 hero; L12 hero

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Anton carefully holding a small red origami paper tulip in both hands at chest height, gentle smile. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other hero images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named hero_tulip.png.
```

**`hero_checkpoint.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L13 hero

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Anton celebrating a saved checkpoint: both fists raised, eyes happily closed, a few small golden sparkles around him. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other hero images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named hero_checkpoint.png.
```

**`hero_knowledge.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L14 hero; L15 hero; L16 hero; L17 hero; L18 hero; L19 hero

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Anton thinking: one hand on chin, eyebrow raised, a small blue question mark floating near his head. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other hero images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named hero_knowledge.png.
```

**`hero_ring.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L20 hero; L21 hero; L22 hero; L23 hero

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Anton proudly raising his right hand to show a glowing gold ring on his finger, smug smile. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other hero images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named hero_ring.png.
```

**`hero_aviation.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L24 hero

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Anton running mid-stride toward a flight, holding a boarding pass in one hand, windswept hair, excited. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other hero images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named hero_aviation.png.
```

**`hero_navigation2.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L25 hero

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Anton holding an upgraded glowing compass with gold gears, one eyebrow raised: 'I knew it'. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other hero images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named hero_navigation2.png.
```

**`hero_elements.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L26 hero

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Anton with both palms up, a tiny water droplet, flame and lightning spark orbiting his hands, surprised-delighted face. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other hero images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named hero_elements.png.
```

**`hero_mirror.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L27 hero; L28 hero; L29 hero

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Anton leaning in curious, hand on chin, a soft blue-violet rim light on one side as if lit by a magic portal. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other hero images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named hero_mirror.png.
```

**`hero_build_complete.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L30 hero

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Anton triumphant: both fists up, big laugh, soft golden aura and sparkles. The 'level 30 complete' hero; slightly more heroic than the others. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other hero images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named hero_build_complete.png.
```

**`world_hero_layer.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L28 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Anton mid-jump, arms up, knees bent, joyful shout. Full-body, nothing around him. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other hero images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named world_hero_layer.png.
```

**`player2_default.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L20 Player 2; L21 Player 2; L22 Player 2; L23 Player 2; L24 Player 2; L25 Player 2

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Masha (Player 2) standing relaxed, front three-quarter view, small friendly smile, hands loosely at her sides. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other player2 images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named player2_default.png.
```

**`player2_final.png`** → `characters/` · 1024×1280 · фон `#00FF00` · L30 Player 2

```text
Create ONE sprite for a mobile game, canvas 1024x1280 px. Subject: Masha happily clasping her hands at chest, laughing with eyes closed, soft pink glow and two small hearts floating beside her. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Keep the exact same scale as the other player2 images (body/figure height identical). Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named player2_final.png.
```

**`lapka_default.png`** → `characters/` · 1024×1024 · фон `#00FF00` · L22 Lapka; L24 Lapka; L25 Lapka; L26 Lapka; L27 Lapka; L28 Lapka

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: Lapka the kitten sitting upright facing the viewer, big round golden eyes, calm curious look. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other lapka images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named lapka_default.png.
```

**`lapka_neutral.png`** → `characters/` · 1024×1024 · фон `#00FF00` · L23 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: Lapka sitting, slightly turned, neutral relaxed face, tail wrapped around feet. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other lapka images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named lapka_neutral.png.
```

**`lapka_joining.png`** → `characters/` · 1024×1024 · фон `#00FF00` · L21 Lapka

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: Lapka sitting and looking up with interest, ears forward, one tiny sparkle near her, 'a new companion joins'. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other lapka images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named lapka_joining.png.
```

**`lapka_paw.png`** → `characters/` · 1024×1024 · фон `#00FF00` · L21 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: Lapka sitting with one front paw lifted toward the viewer, as if about to pat. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other lapka images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named lapka_paw.png.
```

**`lapka_stare.png`** → `characters/` · 1024×1024 · фон `#00FF00` · L21 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: Lapka sitting very still, wide unblinking golden eyes staring straight at the viewer. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other lapka images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named lapka_stare.png.
```

**`lapka_purr.png`** → `characters/` · 1024×1024 · фон `#00FF00` · L21 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: Lapka curled in a loaf, eyes closed, tiny content smile, a very small heart above her. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other lapka images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named lapka_purr.png.
```

**`lapka_suspicious.png`** → `characters/` · 1024×1024 · фон `#00FF00` · L23 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: Lapka sitting, eyes narrowed, ears slightly back, side-eye at the viewer. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other lapka images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named lapka_suspicious.png.
```

**`lapka_annoyed.png`** → `characters/` · 1024×1024 · фон `#00FF00` · L23 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: Lapka sitting, ears flat, eyes half-closed in clear disapproval, tail flicking. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other lapka images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named lapka_annoyed.png.
```

**`lapka_reactive.png`** → `characters/` · 1024×1024 · фон `#00FF00` · L23 Lapka

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: Lapka alert and tense, ears up and slightly back, tail puffed a little, eyes wide and watchful. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other lapka images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named lapka_reactive.png.
```

**`lapka_stays.png`** → `characters/` · 1024×1024 · фон `#00FF00` · L23 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: Lapka lying down in a loaf pose, eyes half-closed, reluctantly staying put, a very small smug expression. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other lapka images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named lapka_stays.png.
```

**`lapka_final.png`** → `characters/` · 1024×1024 · фон `#00FF00` · L30 Lapka

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: Lapka sitting proudly with tail up, bright happy eyes, a tiny golden sparkle. The 'final build' companion. Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 86% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other lapka images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named lapka_final.png.
```

### Иконки уровней (30)

**`icon_level_01_initialization.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L01 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a small laptop with a red heart on its screen Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_01_initialization.png.
```

**`icon_level_02_facts.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L02 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: an open book with a red origami tulip rising out of it, small sparkles Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_02_facts.png.
```

**`icon_level_03_origami.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L03 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a red paper origami tulip Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_03_origami.png.
```

**`icon_level_04_chess.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L04 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a cream-colored chess knight piece Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_04_chess.png.
```

**`icon_level_05_compass.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L05 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a brass pocket compass with a blue dial Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_05_compass.png.
```

**`icon_level_06_lantern.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L06 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: an old brass lantern with a warm glowing flame Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_06_lantern.png.
```

**`icon_level_07_bread.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L07 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a slice of bread flying with a golden motion trail and crumbs Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_07_bread.png.
```

**`icon_level_08_campfire.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L08 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a small campfire with logs and a bright orange flame Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_08_campfire.png.
```

**`icon_level_09_backpack.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L09 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a green hiking backpack with straps and a front pocket Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_09_backpack.png.
```

**`icon_level_10_waffle.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L10 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a golden rolled waffle tube Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_10_waffle.png.
```

**`icon_level_11_dice.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L11 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: two white dice with black pips Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_11_dice.png.
```

**`icon_level_12_brewing.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L12 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a glass mug of golden foamy drink with bubbles Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_12_brewing.png.
```

**`icon_level_13_save.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L13 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a retro floppy disk with a green check mark Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_13_save.png.
```

**`icon_level_14_wikipedia.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L14 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: an open browser window with an encyclopedia-style globe puzzle letter 'W' (generic, not a real logo) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_14_wikipedia.png.
```

**`icon_level_15_fact.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L15 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a glowing light bulb with an exclamation mark Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_15_fact.png.
```

**`icon_level_16_vibecoding.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L16 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a laptop showing a code symbol </> and a small heart Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_16_vibecoding.png.
```

**`icon_level_17_bug.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L17 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a cute red bug beetle with black dots Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_17_bug.png.
```

**`icon_level_18_quiz.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L18 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: two overlapping quiz cards each with a question mark Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_18_quiz.png.
```

**`icon_level_19_coop.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L19 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: two game controllers (blue and red) with a small heart between them Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_19_coop.png.
```

**`icon_level_20_ring.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L20 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a shiny gold ring with a faint glow Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_20_ring.png.
```

**`icon_level_21_lapka.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L21 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a black cat paw print with a tiny paw pad pattern, pink pads Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_21_lapka.png.
```

**`icon_level_22_home.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L22 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a cozy small house with a red roof and warm lit window Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_22_home.png.
```

**`icon_level_23_cat_support.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L23 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a black cat paw gently pressing a heart Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_23_cat_support.png.
```

**`icon_level_24_aviation.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L24 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a white passenger airplane in flight, side view Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_24_aviation.png.
```

**`icon_level_25_navigation2.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L25 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a folded map with a red pin and a small glowing compass Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_25_navigation2.png.
```

**`icon_level_26_elements.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L26 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a flame and a water drop swirling together with a lightning spark Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_26_elements.png.
```

**`icon_level_27_portal.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L27 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a swirling blue-violet magic portal Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_27_portal.png.
```

**`icon_level_28_world.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L28 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a small floating island with a tree and a house Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_28_world.png.
```

**`icon_level_29_fact_max.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L29 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a stack of fact cards topped with a golden star Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_29_fact_max.png.
```

**`icon_level_30_build.png`** → `level_icons/` · 1024×1024 · фон `#00FF00` · L30 header icon

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a golden finished build block cube with a star, assembled from six small colored blocks Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named icon_level_30_build.png.
```

### Предметы и значки (24)

**`badge_duck_ethics.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L07 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a round gold medal with a duck silhouette and a small balance scale, blue ribbon Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named badge_duck_ethics.png.
```

**`badge_factchecker.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L02 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a round gold and blue medal showing an open book with a red check mark, two ribbon tails Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named badge_factchecker.png.
```

**`badge_vibecoder.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L16 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a round medal with a code symbol </> and a small heart, ribbon Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named badge_vibecoder.png.
```

**`checkpoint_marker.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L13 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a small flag on a pole with a floppy-disk badge, checkpoint marker Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named checkpoint_marker.png.
```

**`item_absolute_truth.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L29 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a golden crystal with a single bright eye shape inside, radiating light Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_absolute_truth.png.
```

**`item_backpack.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L09 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a green hiking backpack, three-quarter view Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_backpack.png.
```

**`item_boarding_pass.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L24 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a boarding pass ticket with a small plane icon and a barcode strip (no readable text) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_boarding_pass.png.
```

**`item_book.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L14 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a thick closed book with a brown cover and gold bookmark Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_book.png.
```

**`item_cat_hair.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L23 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a small tuft of fluffy black cat fur Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_cat_hair.png.
```

**`item_chess_piece.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L04 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a cream-colored chess pawn Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_chess_piece.png.
```

**`item_clean_log.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L17 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a rolled terminal log scroll with a green check mark and clean neat lines (no readable text) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_clean_log.png.
```

**`item_compass.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L05 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a brass pocket compass with a blue dial and a red needle Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_compass.png.
```

**`item_compass_upgraded.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L25 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a brass compass with extra gold gears and a softly glowing blue dial Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_compass_upgraded.png.
```

**`item_house_rule_card.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L11 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a cream card with a small dice and a gold star, 'house rule' card (no readable text) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_house_rule_card.png.
```

**`item_maker_part.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L10 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a metal gear part from a waffle maker, brass and steel Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_maker_part.png.
```

**`item_map.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L09 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a folded paper map with a red pin and a dotted path Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_map.png.
```

**`item_new_element.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L26 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a glowing crystal whose halves are orange fire and blue water mixed together Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_new_element.png.
```

**`item_paper_tulip.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L03 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a red origami paper tulip Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_paper_tulip.png.
```

**`item_ring.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L20 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a shiny gold ring with a soft warm glow Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_ring.png.
```

**`item_secret_recipe.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L12 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a rolled parchment scroll tied with a string and a small bubbling flask Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_secret_recipe.png.
```

**`item_shared_answer.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L18 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: two overlapping speech bubbles, one orange and one blue, with a small heart between them Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_shared_answer.png.
```

**`item_strange_stone.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L09 scene; L09 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a strange teal-purple stone with glowing swirl veins Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_strange_stone.png.
```

**`item_water.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L09 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a travel water bottle with blue water and a small drop Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_water.png.
```

**`item_world_key.png`** → `items_rewards/` · 1024×1024 · фон `#00FF00` · L28 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: an ornate golden key whose head is a tiny floating world island with a cloud Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named item_world_key.png.
```

### Эффекты-свечения в наградах (5)

**`effect_home.png`** → `items_rewards/` · 1024×1024 · фон `#000000` · L22 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a warm orange glowing house outline with gentle light rays Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Glowing light/effect only, drawn on pure flat black #000000 so the black can be removed (additive glow): bright saturated colors, soft falloff, nothing dark inside the effect. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named effect_home.png.
```

**`effect_knowledge_aura.png`** → `items_rewards/` · 1024×1024 · фон `#000000` · L15 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a radiant blue-gold aura ring with tiny floating book pages and stars Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Glowing light/effect only, drawn on pure flat black #000000 so the black can be removed (additive glow): bright saturated colors, soft falloff, nothing dark inside the effect. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named effect_knowledge_aura.png.
```

**`effect_night_vision.png`** → `items_rewards/` · 1024×1024 · фон `#000000` · L06 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a pair of glowing green-yellow eyes inside a soft lantern glow Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Glowing light/effect only, drawn on pure flat black #000000 so the black can be removed (additive glow): bright saturated colors, soft falloff, nothing dark inside the effect. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named effect_night_vision.png.
```

**`effect_portal.png`** → `items_rewards/` · 1024×1024 · фон `#000000` · L27 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a compact swirling blue-violet portal vortex Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Glowing light/effect only, drawn on pure flat black #000000 so the black can be removed (additive glow): bright saturated colors, soft falloff, nothing dark inside the effect. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named effect_portal.png.
```

**`effect_warmth.png`** → `items_rewards/` · 1024×1024 · фон `#000000` · L08 reward

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a flame inside a soft warm orange glow Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 80% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Glowing light/effect only, drawn on pure flat black #000000 so the black can be removed (additive glow): bright saturated colors, soft falloff, nothing dark inside the effect. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named effect_warmth.png.
```

### Спрайты сцен (52)

**`aircraft_taxi.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L24 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a white airliner (side view) rolling on the ground, wheels down, no clouds Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other aircraft images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named aircraft_taxi.png.
```

**`aircraft_takeoff.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L24 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: the same white airliner lifting off, nose tilted up about 15 degrees, wheels just leaving the ground Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other aircraft images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named aircraft_takeoff.png.
```

**`aircraft_cruise.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L24 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: the same white airliner flying level, wheels up, a few small cloud puffs under it Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other aircraft images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named aircraft_cruise.png.
```

**`aircraft_landing.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L24 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: the same white airliner descending to land, wheels down, nose slightly up Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other aircraft images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named aircraft_landing.png.
```

**`bread_projectile.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L07 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a slice of bread flying to the right with a golden motion trail and a few crumbs Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named bread_projectile.png.
```

**`campfire_embers.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L08 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a ring of stones with grey ash and faintly glowing red embers, no flame Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other campfire images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named campfire_embers.png.
```

**`campfire_small.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L08 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a ring of stones with small logs and a small flame Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other campfire images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named campfire_small.png.
```

**`campfire_medium.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L08 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a ring of stones, logs and a medium orange flame Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other campfire images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named campfire_medium.png.
```

**`campfire_strong.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L08 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a ring of stones, logs and a tall bright flame with sparks Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other campfire images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named campfire_strong.png.
```

**`campfire_full.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L08 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a ring of stones, stacked logs and a full roaring campfire with sparks and warm glow Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other campfire images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named campfire_full.png.
```

**`chess_board_small.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L04 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a top-down 8x8 wooden chess board with a dark wood frame, empty, no pieces Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named chess_board_small.png.
```

**`chess_knight.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L04 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a cream-colored chess knight piece, three-quarter view Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named chess_knight.png.
```

**`chess_pawn.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L04 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a cream-colored chess pawn piece, three-quarter view Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named chess_pawn.png.
```

**`compass_upgraded.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L25 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a large brass compass with extra gold gears and a glowing blue dial Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named compass_upgraded.png.
```

**`coop_energy_left.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L19 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a glowing blue energy orb with a small heart inside Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named coop_energy_left.png.
```

**`coop_energy_right.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L19 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a glowing pink-orange energy orb with a small heart inside Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named coop_energy_right.png.
```

**`duck_flying_left.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L07 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a cartoon duck flying to the left, wings up, cheerful Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other duck images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named duck_flying_left.png.
```

**`duck_flying_right.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L07 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: the same cartoon duck flying to the right, wings up Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other duck images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named duck_flying_right.png.
```

**`duck_idle.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L07 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: the same cartoon duck sitting calmly on the water line, looking at the viewer, slightly judging Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Same scale and design as the other duck images. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named duck_idle.png.
```

**`element_fire.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L26 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a round orb of orange fire, stylized Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named element_fire.png.
```

**`element_lightning.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L26 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a round orb of yellow-white lightning, stylized Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named element_lightning.png.
```

**`element_water.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L26 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a round orb of blue water with a highlight, stylized Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named element_water.png.
```

**`fact_stack_collapse.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L29 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a tall stack of paper fact cards tumbling and sliding apart Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named fact_stack_collapse.png.
```

**`home_blanket.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L22 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a folded orange-red plaid blanket on its own (isolated object) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named home_blanket.png.
```

**`home_charger.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L22 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a phone charger with a coiled cable and a small plug (isolated object) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named home_charger.png.
```

**`home_snack_box.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L22 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a small cardboard snack box with a few snacks sticking out (isolated object) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named home_snack_box.png.
```

**`home_sofa.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L22 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a cozy red sofa with a cushion, three-quarter view (isolated object) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named home_sofa.png.
```

**`legendary_ring_glow.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L20 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a gold ring surrounded by a bright glowing aura and sparks Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named legendary_ring_glow.png.
```

**`legendary_ring_idle.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L20 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: the same gold ring resting calmly with a very faint shine Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named legendary_ring_idle.png.
```

**`night_eyes.png`** → `scene_assets/` · 1024×768 · фон `#FF00FF` · L06 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a pair of yellow glowing eyes peeking out of a small dark bush Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat magenta #FF00FF filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #FF00FF anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named night_eyes.png.
```

**`night_moon.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L06 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a large full moon with soft craters and a pale glow Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named night_moon.png.
```

**`night_mushroom.png`** → `scene_assets/` · 1024×768 · фон `#FF00FF` · L06 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a cluster of red-capped white-spotted mushrooms with a small leaf Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat magenta #FF00FF filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #FF00FF anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named night_mushroom.png.
```

**`night_signpost.png`** → `scene_assets/` · 1024×768 · фон `#FF00FF` · L06 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a wooden signpost with two blank arrows pointing left and right, small grass at the base (no readable text) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat magenta #FF00FF filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #FF00FF anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named night_signpost.png.
```

**`origami_state_sheet.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L03 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a flat square sheet of red paper, slightly angled Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named origami_state_sheet.png.
```

**`origami_divide.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L03 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a red paper sheet being divided into two parts with a crease line Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named origami_divide.png.
```

**`origami_fold.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L03 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a red paper being folded into a tulip shape, mid-fold, folded corners visible Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named origami_fold.png.
```

**`origami_blow.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L03 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: an almost finished red paper tulip with small air-puff lines blowing it open Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named origami_blow.png.
```

**`origami_tulip_finished.png`** → `scene_assets/` · 1024×768 · фон `#FF00FF` · L03 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a finished red origami paper tulip with a green stem and leaf, with a few small sparkles Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat magenta #FF00FF filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #FF00FF anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named origami_tulip_finished.png.
```

**`pipeline_idea.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L16 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a glowing light bulb Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named pipeline_idea.png.
```

**`pipeline_code.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L16 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a small dark code editor window with colored lines and a code symbol (no readable text) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named pipeline_code.png.
```

**`pipeline_run.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L16 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a play button inside a terminal window with small motion lines Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named pipeline_run.png.
```

**`pipeline_build.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L16 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a closed cardboard package box with a green check mark and a small gold star Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named pipeline_build.png.
```

**`portal_bright.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L27 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: an oversized bright white-blue glowing portal door in a stone arch, almost blinding Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named portal_bright.png.
```

**`portal_side.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L27 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a smaller side stone arch with a calm blue-violet portal door, echoing sound waves Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named portal_side.png.
```

**`route_map_short.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L05 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a small rolled map tile showing a short straight trail from a start dot to a red flag Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named route_map_short.png.
```

**`route_map_scenic.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L05 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a small rolled map tile showing a long curved trail with trees and a lake to a red flag Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named route_map_scenic.png.
```

**`route_segment_slope.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L25 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a map tile showing a trail climbing a steep hill with small arrows Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named route_segment_slope.png.
```

**`route_segment_obstacle.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L25 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a map tile showing a trail blocked by a fallen log and a boulder Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named route_segment_obstacle.png.
```

**`route_segment_final.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L25 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a map tile showing the last stretch of trail ending at a red flag on a ridge Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named route_segment_final.png.
```

**`wiki_window.png`** → `scene_assets/` · 1024×768 · фон `#00FF00` · L14 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a browser window with a blank encyclopedia page layout and a globe-puzzle letter 'W' (generic, not a real logo, no readable text) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named wiki_window.png.
```

**`world_landscape_layer.png`** → `scene_assets/` · 1024×768 · фон `#FF00FF` · L28 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a floating grassy island chunk with rock underside, a tree and tiny flowers Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat magenta #FF00FF filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #FF00FF anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named world_landscape_layer.png.
```

**`world_slime.png`** → `scene_assets/` · 1024×768 · фон `#FF00FF` · L28 scene

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a cute green slime blob with two big shiny eyes and a happy mouth Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat magenta #FF00FF filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #FF00FF anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named world_slime.png.
```

### Интерфейсный арт (3)

**`debug_panel_clean.png`** → `scene_ui_art/` · 1536×1152 · фон `#00FF00` · L17 scene

```text
Create ONE sprite for a mobile game, canvas 1536x1152 px. Subject: a dark navy interface panel with thin blue borders and neat rows of toggles, sliders and bars, everything aligned (no readable text) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 92% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named debug_panel_clean.png.
```

**`debug_panel_bugged.png`** → `scene_ui_art/` · 1536×1152 · фон `#00FF00` · L17 scene

```text
Create ONE sprite for a mobile game, canvas 1536x1152 px. Subject: the same dark navy interface panel but one element is visibly glitched (shifted, red) with a small red bug beetle sitting on it (no readable text) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 92% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named debug_panel_bugged.png.
```

**`fact_card_stack.png`** → `scene_ui_art/` · 1536×1152 · фон `#00FF00` · L15 scene

```text
Create ONE sprite for a mobile game, canvas 1536x1152 px. Subject: a stack of five slightly messy cream fact cards with colored corners (no readable text) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 92% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named fact_card_stack.png.
```

### Эффекты (5)

**`build_complete_effect.png`** → `effects/` · 1024×1024 · фон `#000000` · L30 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a radial burst of golden light rays with sparkles and small confetti, centered Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 90% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Glowing light/effect only, drawn on pure flat black #000000 so the black can be removed (additive glow): bright saturated colors, soft falloff, nothing dark inside the effect. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named build_complete_effect.png.
```

**`element_mix_effect.png`** → `effects/` · 1024×1024 · фон `#000000` · L26 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a swirling burst of orange fire, blue water and yellow lightning merging into a sparkle, centered Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 90% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Glowing light/effect only, drawn on pure flat black #000000 so the black can be removed (additive glow): bright saturated colors, soft falloff, nothing dark inside the effect. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named element_mix_effect.png.
```

**`player2_join_effect.png`** → `effects/` · 1024×1024 · фон `#000000` · L19 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a pink-and-gold ring burst with two small hearts and sparkles, centered Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 90% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Glowing light/effect only, drawn on pure flat black #000000 so the black can be removed (additive glow): bright saturated colors, soft falloff, nothing dark inside the effect. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named player2_join_effect.png.
```

**`touchdown_effect.png`** → `effects/` · 1024×1024 · фон `#000000` · L24 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a puff of dust and tiny sparks as wheels touch down, spreading left and right, centered Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 90% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Glowing light/effect only, drawn on pure flat black #000000 so the black can be removed (additive glow): bright saturated colors, soft falloff, nothing dark inside the effect. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named touchdown_effect.png.
```

**`world_jump_effect.png`** → `effects/` · 1024×1024 · фон `#000000` · L28 scene

```text
Create ONE sprite for a mobile game, canvas 1024x1024 px. Subject: a ring of white-blue shock lines and small stars as someone lands a jump, centered Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 90% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Glowing light/effect only, drawn on pure flat black #000000 so the black can be removed (additive glow): bright saturated colors, soft falloff, nothing dark inside the effect. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named world_jump_effect.png.
```

## 8. Необязательные новые изображения (для доработки анимаций)

Эти ключи ещё не подключены. Они нужны, чтобы заменить нарисованные кодом вафельную трубочку, банку для брожения и кубики настоящим артом. Делать после основных 145.

**`waffle_tube_raw.png`** → `scene_assets/` · 1024×768 · фон `#00FF00`

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a pale raw waffle tube roll with soft waffle grid pattern Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named waffle_tube_raw.png.
```

**`waffle_tube_ready.png`** → `scene_assets/` · 1024×768 · фон `#00FF00`

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: the same waffle tube golden brown, with a little steam Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named waffle_tube_ready.png.
```

**`brew_vessel.png`** → `scene_assets/` · 1024×768 · фон `#00FF00`

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a large glass fermentation jar with a lid and an airlock, empty and transparent Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named brew_vessel.png.
```

**`dice_pair.png`** → `scene_assets/` · 1024×768 · фон `#00FF00`

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: two white dice with black pips, one slightly tilted Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named dice_pair.png.
```

**`rule_card.png`** → `scene_assets/` · 1024×768 · фон `#00FF00`

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a cream house-rule card with a small gold star (no readable text) Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named rule_card.png.
```

**`tent.png`** → `scene_assets/` · 1024×768 · фон `#00FF00`

```text
Create ONE sprite for a mobile game, canvas 1024x768 px. Subject: a small orange camping tent, three-quarter view Style: cozy retro pixel-cartoon chibi game art, clean dark-navy outline about 3 px at 512 px size, flat cel shading with soft highlights, warm saturated palette (terracotta orange, mustard yellow, deep navy, forest green, cream), subtle painterly texture, large readable shapes that survive being shown at 100 px on a phone, exactly matching the attached style reference sheet. Subject centered, filling about 76% of the canvas height, at least 6% empty margin on every side, fully inside the canvas. Background: pure flat chroma green #00FF00 filling the whole canvas, perfectly flat, no gradient, no shadow, no floor. Do not use #00FF00 anywhere in the subject itself. No text, no frame, no tile, no border, no checkerboard. Deliver as PNG named tent.png.
```

## 9. Чек-лист приёмки каждого изображения

- [ ] Имя файла = ключ, размер холста как в таблице.
- [ ] Фон плоский, одного цвета, без шахматки, градиента, тени, пола.
- [ ] Нет рамки, плитки, скруглённой подложки, текста и водяных знаков.
- [ ] Объект целиком в кадре, поля не меньше 6%.
- [ ] Персонаж узнаётся: лицо, причёска, очки, борода (Антон), худи совпадают с каноном.
- [ ] Масштаб совпадает с остальными картинками этого семейства (hero, player2, lapka).
- [ ] Силуэт читается в маленьком размере (проверьте, уменьшив картинку до 100 px).

## 10. Подключение в игру (делаю я)

```bash
python3 scripts/import-sprites.py new_sprites/
```
Скрипт вырезает фон по цвету из манифеста, убирает кайму, обрезает пустые поля одинаково для всей семьи (чтобы масштаб не терялся), уменьшает до рабочего размера и кладёт файлы в `public/assets/v2/<папка>/<ключ>.png`. После этого запускается полный прогон `scripts/qa.mjs`.
