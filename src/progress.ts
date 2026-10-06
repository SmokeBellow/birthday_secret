import { getLevel, TOTAL_LEVELS } from './data';

export type GameProgress = {
  version: 2;
  currentLevel: number;
  completedLevels: number[];
  achievements: string[];
  unlockedItems: string[];
  player2Unlocked: boolean;
  lapkaUnlocked: boolean;
  build30Complete: boolean;
};

const STORAGE_KEY = 'build30.progress.v2';

export const emptyProgress = (): GameProgress => ({
  version: 2,
  currentLevel: 1,
  completedLevels: [],
  achievements: [],
  unlockedItems: [],
  player2Unlocked: false,
  lapkaUnlocked: false,
  build30Complete: false,
});

export function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const p = JSON.parse(raw);
    if (p?.version !== 2) return emptyProgress();
    return { ...emptyProgress(), ...p };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable: the game still works for this session */
  }
}

export function hasSave(p: GameProgress): boolean {
  return p.completedLevels.length > 0 || p.currentLevel > 1 || p.build30Complete;
}

const uniq = <T,>(a: T[]) => Array.from(new Set(a));

export function unlockReward(p: GameProgress, unlocks: string[]): GameProgress {
  return {
    ...p,
    unlockedItems: uniq([...p.unlockedItems, ...unlocks]),
    player2Unlocked: p.player2Unlocked || unlocks.includes('player2'),
    lapkaUnlocked: p.lapkaUnlocked || unlocks.includes('lapka'),
  };
}

export function completeLevel(p: GameProgress, n: number): GameProgress {
  const lv = getLevel(n);
  let next = unlockReward(p, lv.reward.persistentUnlocks);
  const ach = `level${String(n).padStart(2, '0')}`;
  next = {
    ...next,
    completedLevels: uniq([...next.completedLevels, n]).sort((a, b) => a - b),
    achievements: uniq([...next.achievements, ach]),
    currentLevel: Math.min(TOTAL_LEVELS, Math.max(next.currentLevel, n + 1)),
    build30Complete: next.build30Complete || n === TOTAL_LEVELS,
  };
  return next;
}

export function resetProgress(): GameProgress {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return emptyProgress();
}

/** Dev-only: pretend levels 1..n-1 were finished so late levels show real accumulated rewards. */
export function seedPrerequisites(p: GameProgress, upToExclusive: number): GameProgress {
  let next = p;
  for (let i = 1; i < upToExclusive; i++) next = completeLevel(next, i);
  return { ...next, currentLevel: Math.max(next.currentLevel, upToExclusive) };
}
