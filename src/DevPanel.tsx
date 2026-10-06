import { useState } from 'react';
import { TOTAL_LEVELS } from './data';
import type { GameProgress } from './progress';

type Props = {
  progress: GameProgress;
  level: number | null;
  onJump: (n: number) => void;
  onAchievement: (n: number) => void;
  onSeed: (n: number) => void;
  onReset: () => void;
  onPostGame: () => void;
};

/** Visible only with ?dev=1. */
export function DevPanel({ progress, level, onJump, onAchievement, onSeed, onReset, onPostGame }: Props) {
  const [open, setOpen] = useState(false);
  const [showUnlocks, setShowUnlocks] = useState(false);
  const [target, setTarget] = useState(level ?? 1);
  const cur = level ?? target;
  return (
    <div className="dev">
      <button type="button" className="dev-toggle" onClick={() => setOpen(!open)}>
        DEV
      </button>
      {open && (
        <div className="dev-panel">
          <div className="dev-row">
            <button onClick={() => onJump(Math.max(1, cur - 1))}>◀</button>
            <select value={cur} onChange={(e) => { setTarget(+e.target.value); onJump(+e.target.value); }}>
              {Array.from({ length: TOTAL_LEVELS }, (_, i) => (
                <option key={i} value={i + 1}>
                  L{String(i + 1).padStart(2, '0')}
                </option>
              ))}
            </select>
            <button onClick={() => onJump(Math.min(TOTAL_LEVELS, cur + 1))}>▶</button>
          </div>
          <div className="dev-row">
            <button onClick={() => onJump(cur)}>restart level</button>
            <button onClick={() => onAchievement(cur)}>achievement</button>
          </div>
          <div className="dev-row">
            <button onClick={() => onSeed(cur)}>seed 1..{cur - 1}</button>
            <button onClick={() => onJump(30)}>L30</button>
            <button onClick={onPostGame}>post-game</button>
          </div>
          <div className="dev-row">
            <button onClick={() => setShowUnlocks(!showUnlocks)}>unlocks</button>
            <button onClick={onReset}>reset</button>
          </div>
          {showUnlocks && (
            <pre className="dev-pre">
              {JSON.stringify({ cur: progress.currentLevel, done: progress.completedLevels.length, p2: progress.player2Unlocked, lapka: progress.lapkaUnlocked, items: progress.unlockedItems }, null, 1)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
