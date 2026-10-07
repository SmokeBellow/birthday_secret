import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { resolveAsset, isDev } from './assets';
import type { LevelSpec } from './data';
import type { GameProgress } from './progress';
import { sfx } from './audio';
import { bump, foundEgg } from './stats';

/** Props every mechanic receives from LevelScreen. */
export type MechanicProps = {
  level: LevelSpec;
  progress: GameProgress;
  finished: boolean;
  /** Mark the level as solved. `result` is shown in the completion panel. */
  complete: (result?: string) => void;
};

/** Opaque "tile" sprites (art that ships with its own dark background) get one consistent card look. */
const tileCache = new Map<string, boolean>();
function detectTile(img: HTMLImageElement): boolean {
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 16;
    const g = c.getContext('2d', { willReadFrequently: true })!;
    g.drawImage(img, 0, 0, 16, 16);
    const px = (x: number, y: number) => g.getImageData(x, y, 1, 1).data[3];
    const opaque = [px(1, 1), px(14, 1), px(1, 14), px(14, 14)].filter((a) => a > 200).length;
    return opaque >= 3;
  } catch {
    return false;
  }
}

/** Image resolved through ASSET_MAP. CSS-rendered / unknown keys draw nothing in normal play. */
export function Img({ k, className = '', style, alt = '', onClick }: { k?: string | null; className?: string; style?: CSSProperties; alt?: string; onClick?: () => void }) {
  const r = resolveAsset(k);
  const url = r.kind === 'image' ? r.url : '';
  const [tile, setTile] = useState<boolean>(tileCache.get(url) ?? false);
  if (r.kind === 'image') {
    const fx = url.includes('/effects/');
    const glowHero = url.includes('hero_build_complete');
    return (
      <img
        src={url}
        alt={alt}
        draggable={false}
        className={`img ${className}${tile ? ' img-tile' : ''}${fx ? ' img-fx' : ''}${glowHero ? ' glow-hero' : ''}`}
        style={style}
        onClick={onClick}
        onLoad={(e) => {
          if (url.includes('/backgrounds/') || tileCache.has(url)) return;
          const v = detectTile(e.currentTarget);
          tileCache.set(url, v);
          if (v) setTile(true);
        }}
      />
    );
  }
  if (r.kind === 'unknown' && isDev && k) return <span className={`img-missing ${className}`}>{k}</span>;
  return null;
}

/** Scene frame: background art plus the persistent cast named in the level's visualState. */
export function Stage({
  level,
  cast = true,
  children,
  className = '',
  castOverride,
}: {
  level: LevelSpec;
  cast?: boolean;
  children?: ReactNode;
  className?: string;
  castOverride?: { hero?: string | null; p2?: string | null; lapka?: string | null };
}) {
  const v = level.visualState;
  const [quip, setQuip] = useState(false);
  const pets = useRef({ n: 0, last: 0 });
  const petLapka = () => {
    const now = Date.now();
    pets.current.n = now - pets.current.last > 2500 ? 1 : pets.current.n + 1;
    pets.current.last = now;
    bump('lapkaPets');
    sfx('ok');
    if (pets.current.n >= 10) {
      pets.current.n = 0;
      foundEgg('lapka_enough');
      setQuip(true);
      window.setTimeout(() => setQuip(false), 2600);
    }
  };
  const hero = castOverride && 'hero' in castOverride ? castOverride.hero : v.heroStateKey;
  const p2 = castOverride && 'p2' in castOverride ? castOverride.p2 : v.player2StateKey;
  const lapka = castOverride && 'lapka' in castOverride ? castOverride.lapka : v.lapkaStateKey;
  return (
    <div className={`stage ${className}`}>
      <Img k={v.backgroundKey} className="stage-bg" />
      <div className="stage-shade" />
      {cast && (
        <div className="stage-cast">
          {hero && <Img k={hero} className="cast cast-hero" />}
          {p2 && <Img k={p2} className="cast cast-p2" />}
          {lapka && <Img k={lapka} className="cast cast-lapka cast-tappable" onClick={petLapka} />}
        </div>
      )}
      {quip && <div className="lapka-quip">Лапка: достаточно.</div>}
      {children}
    </div>
  );
}

export function useShake(): [string, () => void] {
  const [n, setN] = useState(0);
  const trigger = useCallback(() => {
    sfx('nope');
    bump('slips');
    setN((x) => x + 1);
  }, []);
  return [n ? (n % 2 ? 'shake-a' : 'shake-b') : '', trigger];
}

export function useTimeout() {
  const ref = useRef<number[]>([]);
  useEffect(() => () => ref.current.forEach(clearTimeout), []);
  return useCallback((fn: () => void, ms: number) => {
    ref.current.push(window.setTimeout(fn, ms));
  }, []);
}

export function Feedback({ text, tone = 'info' }: { text?: string; tone?: 'info' | 'good' | 'warn' }) {
  if (!text) return <div className="feedback feedback-empty" aria-hidden />;
  return (
    <div key={text} className={`feedback feedback-${tone}`} role="status">
      {text}
    </div>
  );
}

export function Pips({ done, total }: { done: number; total: number }) {
  return (
    <div className="pips" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < done ? 'pip on' : 'pip'} />
      ))}
    </div>
  );
}

/** Round CSS tap target (`ui_tap_target_idle`). */
export function TapTarget({ onTap, count, total, disabled, flash }: { onTap: () => void; count?: number; total?: number; disabled?: boolean; flash?: boolean }) {
  return (
    <button type="button" className={`tap-target${flash ? ' active' : ''}`} onClick={onTap} disabled={disabled} aria-label="tap">
      <span className="tap-ring" />
      <span className="tap-core">{count !== undefined && total ? `${count}/${total}` : ''}</span>
    </button>
  );
}
