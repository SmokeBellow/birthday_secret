import assetMap from '../public/assets/v2/ASSET_MAP.json';
import cssKeys from '../source_of_truth/CSS_RENDERED_ASSET_KEYS.json';

const MAP = assetMap as Record<string, string>;
const CSS_KEYS = new Set<string>(cssKeys.keys);

/**
 * Spec keys that name a state/effect the production pack covers with another sprite
 * (or that are decorative extras the pack deliberately does not ship).
 */
const ALIASES: Record<string, string> = {
  player2_joining: 'player2_default',
  player2_unlock: 'player2_default',
  lapka_unlock: 'lapka_default',
  ring_equip_effect: 'legendary_ring_glow',
  save_complete_effect: 'checkpoint_marker',
  knowledge_aura: 'effect_knowledge_aura',
  lapka_join_effect: 'player2_join_effect',
  sync_match_effect: 'build_complete_effect',
  sync_mismatch_effect: 'element_mix_effect',
  portal_entry_effect: 'effect_portal',
  portal_wrong_flash: 'portal_bright',
  signpost_forest: 'night_signpost',
  book_stack: 'item_book',
  wiki_tab_stack: 'wiki_window',
  world_complete_scene: 'world_landscape_layer',
  final_congratulations_scene: 'build_complete_effect',
  counterfact_card: 'fact_card_stack',
  debug_bug_marker: 'debug_panel_bugged',
};

export const isDev = new URLSearchParams(window.location.search).get('dev') === '1';

export type Resolved =
  | { kind: 'image'; url: string }
  | { kind: 'css'; key: string }
  | { kind: 'unknown'; key: string };

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const warned = new Set<string>();

export function resolveAsset(key: string | null | undefined): Resolved {
  if (!key) return { kind: 'unknown', key: '' };
  const direct = MAP[key] ?? MAP[ALIASES[key]];
  if (direct) return { kind: 'image', url: base + direct };
  if (CSS_KEYS.has(key)) return { kind: 'css', key };
  if (!warned.has(key)) {
    warned.add(key);
    console.warn(`[assets] unknown asset key: ${key}`);
  }
  return { kind: 'unknown', key };
}

/** URL for a key known to be an image; '' otherwise. */
export function assetUrl(key: string | null | undefined): string {
  const r = resolveAsset(key);
  return r.kind === 'image' ? r.url : '';
}
