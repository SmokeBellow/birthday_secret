/** Counters shown on the "statistics" screen of the post-game. Cleared together with the progress. */
const KEY = 'build30.stats.v1';

export type Stats = { playMs: number; taps: number; slips: number; duckHits: number; lapkaPets: number };
const empty = (): Stats => ({ playMs: 0, taps: 0, slips: 0, duckHits: 0, lapkaPets: 0 });

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

export function bump(key: keyof Stats, n = 1) {
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
