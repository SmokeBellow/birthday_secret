import { useEffect, useRef, useState } from 'react';
import { t, levelKey } from '../data';
import { Img, Pips, Stage, TapTarget, useShake, useTimeout, type MechanicProps } from '../ui';
import { HOME_LORE, NIGHT_FOUND } from '../extraCopy';
import { sfx } from '../audio';
import { bump } from '../stats';

/** L6 — hiddenObject: four landmarks hide inside the night forest. Coordinates are % of the 16:10 background image. */
const HIDDEN: Record<string, { x: number; y: number; asset: string }> = {
  moon: { x: 74, y: 15, asset: 'night_moon' },
  mushroom: { x: 91, y: 79, asset: 'night_mushroom' },
  signpost: { x: 16, y: 52, asset: 'night_signpost' },
  eyes: { x: 31, y: 28, asset: 'night_eyes' },
};

export function HiddenObject({ level, finished, complete }: MechanicProps) {
  const targets = level.mechanic.targets as string[];
  const [found, setFound] = useState<string[]>(finished ? targets : []);
  const [miss, setMiss] = useState<{ x: number; y: number; n: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const tap = (id: string) => {
    if (found.includes(id) || finished) return;
    const next = [...found, id];
    setFound(next);
    sfx('ok');
    if (next.length === targets.length) complete();
  };
  const onMiss = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    setMiss({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, n: Date.now() });
  };
  return (
    <>
      <Stage level={level} cast={false} className="stage-wide">
        <div ref={ref} className="hidden-layer" onPointerDown={onMiss}>
          {targets.map((id) => {
            const h = HIDDEN[id];
            const ok = found.includes(id);
            return (
              <button
                key={id}
                type="button"
                className={`hotspot hidden-spot${ok ? ' found' : ''}`}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => tap(id)}
                aria-label={id}
              >
                <span className="hot-ring" />
                {ok && <span className="hot-check pop">✓</span>}
              </button>
            );
          })}
          {miss && <span key={miss.n} className="miss-ripple" style={{ left: `${miss.x}%`, top: `${miss.y}%` }} />}
        </div>
      </Stage>
      <div className="found-grid">
        {targets.map((id) => (
          <div key={id} className={`found-cell${found.includes(id) ? ' on' : ''}`}>
            {found.includes(id) ? <span className="pop">{NIGHT_FOUND[id]}</span> : <b>?</b>}
          </div>
        ))}
      </div>
    </>
  );
}

/** L22 — sceneExploration: visit every point of the home base and read its lore. */
const HOME: Record<string, { x: number; y: number; asset: string }> = {
  sofa: { x: 10, y: 48, asset: 'home_sofa' },
  blanket: { x: 26, y: 42, asset: 'home_blanket' },
  charger: { x: 27, y: 74, asset: 'home_charger' },
  snack_box: { x: 40, y: 84, asset: 'home_snack_box' },
};

export function SceneExploration({ level, finished, complete }: MechanicProps) {
  const spots = level.mechanic.hotspots as string[];
  const [seen, setSeen] = useState<string[]>(finished ? spots : []);
  const [last, setLast] = useState<string | null>(null);
  const visit = (id: string) => {
    if (finished) return;
    setLast(id);
    if (seen.includes(id)) return;
    const next = [...seen, id];
    setSeen(next);
    sfx('ok');
    if (next.length === spots.length) complete();
  };
  const lore = last ? HOME_LORE[last] : null;
  return (
    <>
      <Stage level={level} cast={false} className="stage-wide">
        {spots.map((id) => {
          const h = HOME[id];
          const ok = seen.includes(id);
          return (
            <button
              key={id}
              type="button"
              className={`hotspot home-spot${ok ? ' found' : ''}${last === id ? ' last' : ''}`}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              onClick={() => visit(id)}
              aria-label={id}
            >
              <Img k={h.asset} className="hot-sprite hot-sprite-home" />
              <span className="hot-ring" />
              {ok && <span className="hot-check">✓</span>}
            </button>
          );
        })}
      </Stage>
      <Pips done={seen.length} total={spots.length} />
      {lore && (
        <div className="lore-card" key={last}>
          <div className="lore-title">{lore.title}</div>
          <div className="lore-text">{lore.text}</div>
        </div>
      )}
    </>
  );
}

/** L7 — movingTargetAim: tap the pond to throw bread. Misses only get a reaction. */
type Duck = { id: string; dir: 'left' | 'right' | 'idle'; y: number; speed: number; phase: number };
const DUCKS: Duck[] = [
  { id: 'duck_left', dir: 'right', y: 24, speed: 0.045, phase: 0.1 },
  { id: 'duck_right', dir: 'left', y: 50, speed: 0.06, phase: 0.6 },
  { id: 'duck_center', dir: 'right', y: 70, speed: 0.035, phase: 0.35 },
];

export function MovingTargetAim({ level, finished, complete }: MechanicProps) {
  const total = level.mechanic.requiredActions as number;
  const [throws, setThrows] = useState(finished ? total : 0);
  
  const [fx, setFx] = useState<{ x: number; y: number; hit: boolean; n: number; sx: number; sy: number } | null>(null);
  const [reaction, setReaction] = useState<Record<string, number>>({});
  const field = useRef<HTMLDivElement>(null);
  const duckEls = useRef<Record<string, HTMLDivElement | null>>({});
  const pos = useRef<Record<string, number>>({});
  const later = useTimeout();

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (const d of DUCKS) {
        const cur = pos.current[d.id] ?? d.phase;
        const nxt = (cur + dt * d.speed * 4) % 1;
        pos.current[d.id] = nxt;
        const el = duckEls.current[d.id];
        if (el) {
          const x = d.dir === 'right' ? nxt : 1 - nxt;
          el.style.left = `${-12 + x * 124}%`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const throwBread = (e: React.PointerEvent) => {
    if (finished || throws >= total) return;
    const r = field.current!.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    let hitId: string | null = null;
    for (const d of DUCKS) {
      const el = duckEls.current[d.id];
      if (!el) continue;
      const b = el.getBoundingClientRect();
      const pad = 14;
      if (e.clientX > b.left - pad && e.clientX < b.right + pad && e.clientY > b.top - pad && e.clientY < b.bottom + pad) hitId = d.id;
    }
    const n = throws + 1;
    setThrows(n);
    setFx({ x: (px / r.width) * 100, y: (py / r.height) * 100, hit: !!hitId, n: Date.now(), sx: r.width / 2 - px, sy: r.height - py });
    if (hitId) {
      bump('duckHits');
      setReaction((m) => ({ ...m, [hitId!]: Date.now() }));
    }
    if (n >= total) later(() => complete(t(`levels.${levelKey(level.id)}.completion`)), 700);
  };

  return (
    <>
      <Stage level={level} cast={false} className="stage-wide">
        <div ref={field} className="duck-field" onPointerDown={throwBread}>
          {DUCKS.map((d) => (
            <div
              key={d.id}
              ref={(el) => {
                duckEls.current[d.id] = el;
              }}
              className={`duck${reaction[d.id] ? ' duck-hit' : ''}`}
              style={{ top: `${d.y}%` }}
              data-n={reaction[d.id] ?? 0}
            >
              <Img k={d.dir === 'right' ? 'duck_flying_right' : 'duck_flying_left'} className="duck-img" />
            </div>
          ))}
          {fx && (
            <span key={fx.n} className={`bread-shot${fx.hit ? ' hit' : ''}`} style={{ left: `${fx.x}%`, top: `${fx.y}%`, ['--sx' as string]: `${fx.sx}px`, ['--sy' as string]: `${fx.sy}px` }}>
              <Img k="bread_projectile" className="bread-img" />
            </span>
          )}
        </div>
      </Stage>
      <div className="bread-count" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <Img key={i} k="bread_projectile" className={`bread-icon${i < throws ? ' used' : ''}`} />
        ))}
      </div>
    </>
  );
}

/** L8 — resourceTap: feed the fire. Visual-only soft decay; progress never drops. */
export function ResourceTap({ level, finished, complete }: MechanicProps) {
  const total = level.mechanic.requiredActions as number;
  const keys = ['campfire_embers', 'campfire_small', 'campfire_medium', 'campfire_strong', 'campfire_full'];
  const [taps, setTaps] = useState(finished ? total : 0);
  const [dim, setDim] = useState(false);
  const idle = useRef<number>(0);
  const feed = () => {
    if (taps >= total) return;
    const n = taps + 1;
    setTaps(n);
    setDim(false);
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => setDim(true), 1800);
    if (n >= total) {
      window.clearTimeout(idle.current);
      complete();
    }
  };
  useEffect(() => () => window.clearTimeout(idle.current), []);
  const idx = Math.min(keys.length - 1, Math.max(0, taps - 1));
  return (
    <>
      <Stage level={level} cast={false} className="stage-short">
        <div className={`fire${dim ? ' dim' : ''}`}>
          <Img k={keys[idx]} className={`fire-img lvl-${idx}`} key={idx} />
        </div>
      </Stage>
      <div className="controls center">
        <TapTarget onTap={feed} count={taps} total={total} disabled={finished} flash />
      </div>
    </>
  );
}

/** L9 — collectRequiredPlusOptional: pack everything, strange stone included. */
const PACK: { id: string; asset: string; x: number; y: number }[] = [
  { id: 'water', asset: 'item_water', x: 56, y: 62 },
  { id: 'map', asset: 'item_map', x: 70, y: 28 },
  { id: 'backpack', asset: 'item_backpack', x: 86, y: 64 },
  { id: 'strange_stone', asset: 'item_strange_stone', x: 90, y: 24 },
];

export function CollectItems({ level, finished, complete }: MechanicProps) {
  const required = level.mechanic.requiredItems as string[];
  const all = [...required, level.mechanic.optionalItem as string];
  const [got, setGot] = useState<string[]>(finished ? all : []);
  const take = (id: string) => {
    if (got.includes(id) || finished) return;
    const next = [...got, id];
    setGot(next);
    sfx('ok');
    if (all.every((x) => next.includes(x))) complete(t(`levels.${levelKey(level.id)}.completion`) || undefined);
  };
  const hasPack = got.includes('backpack');
  return (
    <>
      <Stage level={level} className="stage-wide" castOverride={{ hero: hasPack ? level.visualState.heroStateKey : 'hero_base', p2: null, lapka: null }}>
        {PACK.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`pack-item${got.includes(p.id) ? ' taken' : ''}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onClick={() => take(p.id)}
            aria-label={p.id}
          >
            <Img k={p.asset} className="pack-img" />
          </button>
        ))}
      </Stage>
      <div className="slots-row">
        {PACK.map((p) => (
          <div key={p.id} className={`slot${got.includes(p.id) ? ' filled' : ''}${p.id === 'strange_stone' ? ' slot-opt' : ''}`}>
            {got.includes(p.id) && <Img k={p.asset} className="slot-img pop" />}
          </div>
        ))}
      </div>
    </>
  );
}

/** L21 — characterInteraction: Lapka decides what she wants; read her thought bubble and answer with the right gesture. */
type Act = 'paw' | 'stare' | 'pet';

function ActIcon({ act, className = '' }: { act: Act | 'no'; className?: string }) {
  switch (act) {
    case 'paw':
      return (
        <svg viewBox="0 0 64 64" className={`act-icon ${className}`} aria-hidden>
          <circle cx="16" cy="28" r="7" /><circle cx="29" cy="16" r="7" /><circle cx="43" cy="16" r="7" /><circle cx="54" cy="28" r="7" />
          <path d="M32 31c-9 0-17 9-17 17 0 6 6 9 11 7 4-1 8-1 12 0 5 2 11-1 11-7 0-8-8-17-17-17z" />
        </svg>
      );
    case 'stare':
      return (
        <svg viewBox="0 0 64 64" className={`act-icon ${className}`} aria-hidden>
          <path d="M4 32C14 16 50 16 60 32 50 48 14 48 4 32z" fill="none" strokeWidth="5" />
          <circle cx="32" cy="32" r="9" />
        </svg>
      );
    case 'pet':
      return (
        <svg viewBox="0 0 64 64" className={`act-icon ${className}`} aria-hidden>
          <path d="M32 56C10 40 6 26 12 17c6-8 16-5 20 3 4-8 14-11 20-3 6 9 2 23-20 39z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" className={`act-icon ${className}`} aria-hidden>
          <path d="M16 16l32 32M48 16L16 48" fill="none" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
  }
}

export function CharacterInteraction({ level, finished, complete }: MechanicProps) {
  const acts = level.mechanic.interactions as Act[];
  const [order] = useState<Act[]>(() => [...acts].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(finished ? acts.length : 0);
  const [phase, setPhase] = useState<'wait' | 'ask' | 'happy' | 'no'>('wait');
  const [shake, doShake] = useShake();
  const [hint, setHint] = useState(false);
  const later = useTimeout();
  const askTimer = useRef(0);

  // after a short pause Lapka "decides" what she wants
  useEffect(() => {
    if (finished || idx >= acts.length || phase !== 'wait') return;
    const id = window.setTimeout(() => setPhase('ask'), 900 + Math.random() * 700);
    return () => window.clearTimeout(id);
  }, [phase, idx, finished, acts.length]);
  // if the player is stuck, the right button starts to glow
  useEffect(() => {
    setHint(false);
    if (phase !== 'ask') return;
    askTimer.current = window.setTimeout(() => setHint(true), 3000);
    return () => window.clearTimeout(askTimer.current);
  }, [phase, idx]);

  const need = order[Math.min(idx, order.length - 1)];
  const act = (a: Act) => {
    if (finished || idx >= acts.length || phase === 'happy' || phase === 'no') return;
    if (phase === 'wait') {
      // too early: she does not like to be rushed
      setPhase('no');
      doShake();
      later(() => setPhase('wait'), 800);
      return;
    }
    if (a !== need) {
      setPhase('no');
      doShake();
      later(() => setPhase('ask'), 800);
      return;
    }
    setPhase('happy');
    bump('lapkaPets');
    sfx('ok');
    const n = idx + 1;
    later(() => {
      setIdx(n);
      if (n >= acts.length) complete(t(`levels.${levelKey(level.id)}.completion`));
      else setPhase('wait');
    }, 900);
  };

  const lapka = finished || phase === 'happy' ? 'lapka_purr' : phase === 'ask' ? 'lapka_joining' : 'lapka_neutral';
  return (
    <>
      <Stage level={level} className="stage-tall lapka-solo" castOverride={{ hero: null, p2: null, lapka: null }}>
        <div data-need={phase === 'ask' ? need : ''} className={`lapka-bubble${phase === 'wait' ? ' show wait' : ''}${phase === 'ask' ? ' show' : ''}${phase === 'no' ? ' show no' : ''}${phase === 'happy' ? ' show good' : ''}`}>
          {phase === 'wait' && <span className="bubble-dots"><i /><i /><i /></span>}
          {phase === 'ask' && <ActIcon act={need} />}
          {phase === 'no' && <ActIcon act="no" />}
          {phase === 'happy' && <ActIcon act="pet" />}
        </div>
        <Img k={lapka} className={`cast cast-lapka cast-lapka-big ${shake}${phase === 'happy' ? ' hop' : ''}`} />
        {idx >= acts.length && <Img k="player2_join_effect" className="sprite-lg fx-join pop" />}
      </Stage>
      <Pips done={idx} total={acts.length} />
      <div className="controls row">
        {acts.map((a) => (
          <button key={a} type="button" className={`btn btn-icon act-btn${hint && phase === 'ask' && a === need ? ' pulse glow' : ''}`} disabled={finished} onClick={() => act(a)} aria-label={a}>
            <ActIcon act={a} />
          </button>
        ))}
      </div>
    </>
  );
}

/** L23 — reactiveTap: four pets walk Lapka through neutral → suspicious → annoyed → stays. */
export function ReactiveTap({ level, finished, complete }: MechanicProps) {
  const total = level.mechanic.requiredActions as number;
  const states = level.mechanic.states as string[];
  const [pets, setPets] = useState(finished ? total : 0);
  const [shake, doShake] = useShake();
  const pet = () => {
    if (pets >= total) return;
    const n = pets + 1;
    setPets(n);
    bump('lapkaPets');
    doShake();
    if (n >= total) complete();
  };
  const state = states[Math.min(states.length - 1, pets)];
  return (
    <>
      <Stage level={level} className="stage-tall lapka-solo" castOverride={{ hero: null, p2: null, lapka: null }}>
        <button type="button" className={`lapka-tap ${shake}`} onClick={pet} disabled={finished} aria-label="lapka">
          <Img k={`lapka_${state === 'stays_anyway' ? 'stays' : state}`} className="lapka-img" />
        </button>
      </Stage>
      <div className="meter" aria-label={t('levels.23.meterLabel')}>
        <div className="meter-label">{t('levels.23.meterLabel')}</div>
        <div className="meter-track">
          <div className="meter-fill" style={{ width: `${(pets / total) * 100}%` }} />
        </div>
      </div>
    </>
  );
}
