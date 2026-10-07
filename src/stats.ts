/** Counters shown on the "statistics" screen of the post-game. Cleared together with the progress. */
const KEY = 'build30.stats.v1';

export type Stats = { playMs: number; taps: number; slips: number; duckHits: number; lapkaPets: number; eggs: string[] };
const empty = (): Stats => ({ playMs: 0, taps: 0, slips: 0, duckHits: 0, lapkaPets: 0, eggs: [] });

let cache: Stats | null = null;

export function getStats(): Stats {
  if (cache) return cache;
  try {
    cache = { ...empty(), ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
  } catch {
    cache = empty();
  }
  return cache!;
}

export function bump(key: Exclude<keyof Stats, 'eggs'>, n = 1) {
  const s = getStats();
  s[key] += n;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable: stats are optional */
  }
}

export function resetStats() {
  cache = empty();
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export const EGGS: Record<string, string> = {
  lapka_enough: 'Лапка сказала «достаточно»',
  shortcut: 'Он действительно знает',
  bug_feature: 'Не баг, а фича',
  version: 'Версия 30.0 от Маши',
  lapka_judges: 'Осуждение высшей пробы',
};

/** Remember a secret the player found (shown in the achievements gallery). */
export function foundEgg(id: string) {
  const s = getStats();
  if (s.eggs.includes(id)) return;
  s.eggs = [...s.eggs, id];
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* optional */
  }
}
