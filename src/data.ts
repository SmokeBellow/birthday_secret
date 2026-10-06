import specJson from '../source_of_truth/GAME_SPEC_V2.json';
import copyJson from '../source_of_truth/GAME_COPY_V2.json';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Mechanic = { type: string; objectiveKey: string; requiredActions: number; [k: string]: any };
export type LevelSpec = {
  id: number;
  slug: string;
  titleKey: string;
  stageLabelKey: string;
  introKey: string;
  mechanic: Mechanic;
  visualState: {
    backgroundKey: string;
    headerIconKey: string;
    heroStateKey?: string;
    player2StateKey?: string;
    lapkaStateKey?: string;
    sceneAssetKeys: string[];
  };
  reward: { achievementKey: string; equipmentKey: string | null; persistentUnlocks: string[] };
  nextLevel: number | null;
};

export const spec = specJson as unknown as {
  globalRules: Record<string, any>;
  levels: LevelSpec[];
  postGameFlow: Record<string, any>;
};
export const levels = spec.levels;
export const TOTAL_LEVELS = spec.levels.length;
export const getLevel = (n: number): LevelSpec => levels[n - 1];

/** Resolve a dotted copy key such as `levels.02.title` against GAME_COPY_V2.json. */
export function t(key: string | undefined | null): string {
  if (!key) return '';
  let node: any = copyJson;
  for (const part of key.split('.')) {
    node = node?.[part];
    if (node === undefined) {
      if (import.meta.env.DEV) console.warn(`[copy] missing key: ${key}`);
      return '';
    }
  }
  return typeof node === 'string' ? node : '';
}

/** Copy list (array of strings) at a dotted key. */
export function tList(key: string): string[] {
  let node: any = copyJson;
  for (const part of key.split('.')) node = node?.[part];
  return Array.isArray(node) ? node : [];
}

export const levelKey = (n: number) => String(n).padStart(2, '0');
