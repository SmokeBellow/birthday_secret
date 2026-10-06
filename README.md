# BUILD 30.0

Мобильная игра-поздравление. React + TypeScript + Vite, без бэкенда, прогресс в `localStorage`.

## Запуск

```bash
npm install
npm run dev        # разработка
npm run build      # проверка типов + production-сборка в dist/
npm run preview    # посмотреть dist/
```

`?dev=1` включает панель разработчика (переход по уровням, сброс, просмотр наград, пост-гейм).
QA-ссылка: `/?dev=1&level=12&seed=1` открывает уровень 12 с засеянным прогрессом.

## Чего не хватает (внешние данные)

1. Сертификат Boeing 737 передаётся отдельно. В игре — только его текст, **без кода сертификата** (репозиторий публичный). PDF в репозиторий не добавлять.
2. Ответы Player 2 на уровне 18 заданы в `src/config/level18.player2.json` (B, B, B).

## Структура

- `source_of_truth/` — каноничные JSON (механики, тексты). Не править ради удобства кода.
- `public/assets/v2/` — продакшн-арт и `ASSET_MAP.json`.
- `src/data.ts` (спека + тексты), `src/assets.ts` (единый резолвер ассетов), `src/progress.ts` (весь localStorage).
- `src/mechanics/` — переиспользуемые механики; `LevelScreen` выбирает компонент по `mechanic.type`.
- `scripts/qa.mjs` — автопроход всех 30 уровней в headless Chromium.
- `scripts/trim-scene-assets.py` — обрезка прозрачных полей у спрайтов сцен (уже применена).
- `docs/` — исходные требования и чек-лист QA.
