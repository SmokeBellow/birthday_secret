import { useEffect, useRef, useState } from 'react';
import { t, levelKey } from '../data';
import { Img, Pips, Stage, TapTarget, useShake, useTimeout, type MechanicProps } from '../ui';
import player2Config from '../config/level18.player2.json';
import { assetUrl, isDev } from '../assets';
import { sfx } from '../audio';
import { ROUTE_HINT, ROUTE_LABELS, SAVE_RIDDLES, WIKI_PAGES, WIKI_TEXT } from '../extraCopy';

/** L10 — timingWindow: stop the marker inside the green zone. A miss just retries. */
export function TimingWindow({ level, finished, complete }: MechanicProps) {
  const [ok, setOk] = useState(finished);
  const [shake, doShake] = useShake();
  const [missed, setMissed] = useState(0);
  const markerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0.1);
  const running = useRef(!finished);
  const ZONE: [number, number] = [0.58, 0.8];
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      if (running.current) {
        const ph = ((now - t0) / 1700) % 2;
        posRef.current = ph < 1 ? ph : 2 - ph;
        if (markerRef.current) markerRef.current.style.left = `${posRef.current * 100}%`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const stop = () => {
    if (!running.current) return;
    const p = posRef.current;
    if (p >= ZONE[0] && p <= ZONE[1]) {
      running.current = false;
      setOk(true);
      complete();
    } else {
      setMissed((m) => m + 1);
      doShake();
    }
  };
  return (
    <>
      <Stage level={level} cast={false} className="stage-short">
        <div className={`waffle ${ok ? 'ready' : 'raw'}`} data-ui="waffle_tube">
          <Img k="icon_level_10_waffle" className="waffle-img" />
          <span className="waffle-steam" />
        </div>
      </Stage>
      <div className={`timing ${shake}`} data-ui="timing_meter">
        <div className="timing-zone" style={{ left: `${ZONE[0] * 100}%`, width: `${(ZONE[1] - ZONE[0]) * 100}%` }} />
        <div className="timing-track">
          <div ref={markerRef} className="timing-marker" />
        </div>
      </div>
      <div className="controls center">
        <TapTarget onTap={stop} disabled={finished || ok} flash={missed > 0 && !ok} />
      </div>
    </>
  );
}

/** L12 — stabilityGauge: hold to heat, release to cool, keep it in the zone for 4 s. */
export function StabilityGauge({ level, finished, complete }: MechanicProps) {
  const target = level.mechanic.targetDurationSeconds as number;
  const ZONE: [number, number] = [0.42, 0.68];
  const held = useRef(false);
  const st = useRef({ h: 0.3, p: finished ? target : 0, done: finished });
  const brewRef = useRef<HTMLDivElement>(null);
  const liquidRef = useRef<HTMLSpanElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = st.current;
      if (!s.done) {
        const wobble = Math.sin(now / 700) * 0.05 + Math.sin(now / 310) * 0.025;
        s.h += (held.current ? 0.5 : -0.38) * dt + wobble * dt;
        s.h = Math.min(1, Math.max(0, s.h));
        const inZone = s.h >= ZONE[0] && s.h <= ZONE[1];
        s.p = inZone ? Math.min(target, s.p + dt) : Math.max(0, s.p - dt * 0.5);
        if (s.p >= target) {
          s.done = true;
          complete();
        }
      }
      // DOM is updated directly: no React re-render per frame
      const inZone = s.h >= ZONE[0] && s.h <= ZONE[1];
      if (liquidRef.current) liquidRef.current.style.height = `${30 + s.h * 40}%`;
      if (needleRef.current) needleRef.current.style.bottom = `${s.h * 100}%`;
      if (progRef.current) progRef.current.style.width = `${(s.p / target) * 100}%`;
      if (brewRef.current) brewRef.current.className = `brew ${inZone ? 'calm' : 'wild'}`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Stage level={level} cast={false} className="stage-short">
        <div ref={brewRef} className="brew calm" data-ui="brew_vessel">
          <span ref={liquidRef} className="brew-liquid" style={{ height: '39%' }} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <span key={i} className="bubble" style={{ left: `${8 + i * 11}%`, width: 8 + (i % 3) * 5, height: 8 + (i % 3) * 5, animationDelay: `${(i * 0.37) % 1.6}s`, animationDuration: `${1.1 + (i % 4) * 0.35}s` }} />
          ))}
        </div>
        <div className="gauge" data-ui="stability_gauge">
          <div className="gauge-zone" style={{ bottom: `${ZONE[0] * 100}%`, height: `${(ZONE[1] - ZONE[0]) * 100}%` }} />
          <div ref={needleRef} className="gauge-needle" style={{ bottom: '30%' }} />
        </div>
      </Stage>
      <div className="timing-progress" aria-hidden>
        <span ref={progRef} style={{ width: '0%' }} />
      </div>
      <div className="controls center">
        <button
          type="button"
          className="tap-target hold"
          disabled={finished}
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            held.current = true;
          }}
          onPointerUp={() => (held.current = false)}
          onPointerCancel={() => (held.current = false)}
          onPointerLeave={() => (held.current = false)}
          onContextMenu={(e) => e.preventDefault()}
          aria-label="hold"
        >
          <span className="tap-ring" />
          <span className="tap-core" />
        </button>
      </div>
    </>
  );
}

/** L13 — inventorySort: place each found item into its checkpoint slot. */
const SAVE_ITEMS = [
  { id: 'paper_tulip', asset: 'item_paper_tulip', slot: 'save_slot_tulip' },
  { id: 'compass', asset: 'item_compass', slot: 'save_slot_compass' },
  { id: 'strange_stone', asset: 'item_strange_stone', slot: 'save_slot_stone' },
  { id: 'maker_part', asset: 'item_maker_part', slot: 'save_slot_maker' },
];
const SLOT_ORDER = ['compass', 'maker_part', 'paper_tulip', 'strange_stone'];

export function InventorySort({ level, finished, complete }: MechanicProps) {
  const [placed, setPlaced] = useState<string[]>(finished ? SAVE_ITEMS.map((i) => i.id) : []);
  const [held, setHeld] = useState<string | null>(null);
  const [shake, doShake] = useShake();
  const [shakeSlot, setShakeSlot] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const placeInto = (slotId: string) => {
    if (finished || !held) return;
    if (held !== slotId) {
      setShakeSlot(slotId);
      setMisses((m) => m + 1);
      doShake();
      return;
    }
    const next = [...placed, held];
    setPlaced(next);
    sfx('ok');
    setHeld(null);
    setMisses(0);
    if (next.length === SAVE_ITEMS.length) complete(t('common.saveComplete'));
  };
  const asset = (id: string) => SAVE_ITEMS.find((i) => i.id === id)!.asset;
  return (
    <>
      <Stage level={level} cast className="stage-short" castOverride={{ p2: null, lapka: null }}>
        {placed.length === SAVE_ITEMS.length && <Img k="checkpoint_marker" className="sprite-lg fx-save pop" />}
      </Stage>
      <div className="tray">
        {SAVE_ITEMS.filter((i) => !placed.includes(i.id)).map((i) => (
          <button key={i.id} type="button" className={`tray-item${held === i.id ? ' held' : ''}`} onClick={() => setHeld(held === i.id ? null : i.id)} aria-label={i.id}>
            <Img k={i.asset} className="tray-img" />
          </button>
        ))}
      </div>
      <div className="riddles">
        {SLOT_ORDER.map((id, i) => {
          const it = SAVE_ITEMS.find((x) => x.id === id)!;
          const filled = placed.includes(id);
          const hintMe = held === id && misses >= 2 && !filled;
          return (
            <button
              key={id}
              type="button"
              data-ui={it.slot}
              className={`save-slot riddle-card${filled ? ' filled' : ''}${held && !filled ? ' ready' : ''}${hintMe ? ' hint' : ''}${shakeSlot === id ? ' ' + shake : ''}`}
              onClick={() => placeInto(id)}
              disabled={filled || finished}
              aria-label={id}
            >
              <span className="riddle-num">{i + 1}</span>
              <span className="riddle-text">{SAVE_RIDDLES[id]}</span>
              <span className="riddle-slot">{filled ? <Img k={asset(id)} className="slot-img pop" /> : <b>?</b>}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

/** L14 — linkChain: follow the highlighted link down the rabbit hole. */
export function LinkChain({ level, finished, complete }: MechanicProps) {
  const seq = level.mechanic.sequence as string[];
  const [opened, setOpened] = useState(finished ? seq.length : 0);
  const go = () => {
    if (opened >= seq.length) return;
    const n = opened + 1;
    setOpened(n);
    sfx('ok');
    if (n >= seq.length) complete(t(`levels.${levelKey(level.id)}.completion`));
  };
  const widths = [92, 78, 86, 64, 90, 70];
  return (
    <>
      <Stage level={level} cast={false} className="stage-short" />
      <div className="browser" data-ui="wiki_window">
        <div className="browser-tabs">
          {Array.from({ length: Math.max(1, opened + (opened < seq.length ? 1 : 0)) }, (_, i) => (
            <span key={i} className={`browser-tab${i === opened || (opened >= seq.length && i === seq.length - 1) ? ' active' : ''}`}>
              <Img k="wiki_window" className="tab-ico" />
              <span className="tab-title">{WIKI_PAGES[i]}</span>
            </span>
          ))}
        </div>
        <div className="browser-page" key={opened}>
          <div className="wiki-title">{WIKI_PAGES[Math.min(opened, WIKI_PAGES.length - 1)]}</div>
          <p className="wiki-text">{WIKI_TEXT[Math.min(opened, WIKI_TEXT.length - 1)]}</p>
          {widths.slice(0, 2).map((w, i) => (
            <div key={i} className="skel" style={{ width: `${(w + opened * 7) % 40 + 55}%` }} />
          ))}
          {opened < seq.length ? (
            <button type="button" className="wiki-link" onClick={go} disabled={finished}>
              <span className="wiki-link-text">{WIKI_PAGES[opened + 1]}</span>
              <span className="wiki-arrow">→</span>
            </button>
          ) : (
            <Img k="item_book" className="sprite-md pop" />
          )}
        </div>
      </div>
      <Pips done={opened} total={seq.length} />
    </>
  );
}

/** L17 — spotTheBug: six interface candidates, exactly one is glitched. */
const BUG_WIDGETS = ['toggle', 'slider', 'check', 'progress', 'input', 'stepper'] as const;

export function SpotTheBug({ level, finished, complete }: MechanicProps) {
  const total = level.mechanic.candidateCount as number;
  const [bugIdx] = useState(() => Math.floor(Math.random() * total));
  const [found, setFound] = useState(finished);
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const [shake, doShake] = useShake();
  const tap = (i: number) => {
    if (found || finished) return;
    if (i === bugIdx) {
      setFound(true);
      complete();
    } else {
      setShakeIdx(i);
      doShake();
    }
  };
  return (
    <>
      <Stage level={level} cast={false} className="stage-short">
        <div className="debug-panel">
          {BUG_WIDGETS.map((w, i) => {
            const bug = i === bugIdx;
            return (
              <button key={w} type="button" className={`dbg-cell${bug && found ? ' is-bug found' : ''}${shakeIdx === i ? ' ' + shake : ''}`} onClick={() => tap(i)} aria-label={`element ${i + 1}`}>
                <DbgWidget kind={w} bug={bug} />
                {bug && found && <Img k="icon_level_17_bug" className="bug-mark pop" />}
              </button>
            );
          })}
        </div>
      </Stage>
    </>
  );
}

function DbgWidget({ kind, bug }: { kind: (typeof BUG_WIDGETS)[number]; bug: boolean }) {
  switch (kind) {
    case 'toggle':
      return <span className={`w-toggle${bug ? ' glitch-toggle' : ''}`}><i /></span>;
    case 'slider':
      return <span className="w-slider"><i style={bug ? { left: '118%', top: '-210%' } : { left: '60%' }} /></span>;
    case 'check':
      return <span className={`w-check${bug ? ' glitch-check' : ' on'}`} />;
    case 'progress':
      return <span className="w-progress"><i style={{ width: bug ? '150%' : '65%' }} /></span>;
    case 'input':
      return <span className={`w-input${bug ? ' glitch-input' : ''}`}><i /></span>;
    case 'stepper':
      return <span className="w-stepper"><b />{bug ? <u className="glitch-step" /> : <u />}<b /></span>;
  }
}

/** L19 — pairedQuiz: Player 1 answers, Player 2's real answers come from config. */
type QOpt = { id: string; questionKey: string; options: string[] };
const P2_ANSWERS = player2Config as Record<string, 'A' | 'B' | null | string>;

export function PairedQuiz({ level, finished, complete }: MechanicProps) {
  const qs = level.mechanic.questions as QOpt[];
  const [idx, setIdx] = useState(finished ? qs.length : 0);
  const [mine, setMine] = useState<Record<string, 'A' | 'B'>>({});
  const [revealed, setRevealed] = useState(false);
  const q = qs[Math.min(idx, qs.length - 1)];
  const p2 = q ? P2_ANSWERS[q.id] : null;
  const p2Set = p2 === 'A' || p2 === 'B';
  const answer = (c: 'A' | 'B') => {
    if (finished || revealed || idx >= qs.length) return;
    setMine({ ...mine, [q.id]: c });
    setRevealed(true);
  };
  const next = () => {
    setRevealed(false);
    const n = idx + 1;
    setIdx(n);
    if (n >= qs.length) complete(t(`levels.${levelKey(level.id)}.completion`));
  };
  const match = revealed && p2Set && mine[q.id] === p2;
  const k = levelKey(level.id);
  const unconfigured = qs.some((x) => !(P2_ANSWERS[x.id] === 'A' || P2_ANSWERS[x.id] === 'B'));
  return (
    <>
      <Stage level={level} className="stage-short" castOverride={{ p2: 'player2_default', lapka: null }} />
      {isDev && unconfigured && <div className="dev-note">DEV: Player 2 answers are not configured — src/config/level18.player2.json</div>}
      {idx < qs.length && (
        <div className="quiz">
          <div className="quiz-q">{t(q.questionKey)}</div>
          <Pips done={idx} total={qs.length} />
          <div className="quiz-who quiz-label">ИГРОК 1</div>
          <div className="quiz-options">
            {(['A', 'B'] as const).map((c, i) => (
              <button key={c} type="button" data-ui="player1_answer_card" className={`quiz-card${mine[q.id] === c ? ' picked' : ''}`} disabled={revealed} onClick={() => answer(c)}>
                <span className="quiz-who">{c}</span>
                <span>{t(q.options[i])}</span>
              </button>
            ))}
          </div>
          {revealed && (
            <div className="quiz-p2" data-ui="player2_answer_card">
              <span className="quiz-who">ИГРОК 2</span>
              {p2Set ? <span>{t(q.options[p2 === 'A' ? 0 : 1])}</span> : <span className="quiz-pending">···</span>}
            </div>
          )}
          {revealed && p2Set && (
            <div className={`sync ${match ? 'sync-match' : 'sync-diff'}`}>
              <b>{t(`levels.${k}.responses.${match ? 'match' : 'mismatch'}.title`)}</b>
              <span>{t(`levels.${k}.responses.${match ? 'match' : 'mismatch'}.text`)}</span>
            </div>
          )}
          {revealed && (
            <button type="button" className="btn btn-primary" onClick={next}>
              {t('common.continue')}
            </button>
          )}
        </div>
      )}
    </>
  );
}

/** L25 — multiStepRoutePuzzle: three segments, pick the cheaper route each time. */
type Route = { id: string; slope: number; obstacle: number; length: number };
const SEGMENTS: Record<string, { img: string; options: [Route, Route] }> = {
  slope: { img: 'route_segment_slope', options: [{ id: 'a', slope: 3, obstacle: 0, length: 1 }, { id: 'b', slope: 0, obstacle: 0, length: 2 }] },
  obstacle: { img: 'route_segment_obstacle', options: [{ id: 'a', slope: 0, obstacle: 0, length: 3 }, { id: 'b', slope: 0, obstacle: 3, length: 1 }] },
  final: { img: 'route_segment_final', options: [{ id: 'a', slope: 2, obstacle: 2, length: 1 }, { id: 'b', slope: 0, obstacle: 0, length: 2 }] },
};
const cost = (r: Route) => r.slope + r.obstacle + r.length;

export function RoutePuzzle({ level, finished, complete }: MechanicProps) {
  const segs = level.mechanic.segments as { id: string; decisionFactors: string[] }[];
  const [idx, setIdx] = useState(finished ? segs.length : 0);
  const [misses, setMisses] = useState(0);
  const [shake, doShake] = useShake();
  const [shakeId, setShakeId] = useState('');
  const seg = segs[Math.min(idx, segs.length - 1)];
  const def = SEGMENTS[seg.id];
  const best = def.options.reduce((a, b) => (cost(a) <= cost(b) ? a : b));
  const choose = (r: Route) => {
    if (finished || idx >= segs.length) return;
    if (r.id !== best.id) {
      setMisses((m) => m + 1);
      setShakeId(r.id);
      doShake();
      return;
    }
    const n = idx + 1;
    setIdx(n);
    setMisses(0);
    if (n >= segs.length) complete(t(`levels.${levelKey(level.id)}.completion`));
  };
  const factors = seg.decisionFactors;
  return (
    <>
      <Stage level={level} className="stage-short">
        <div className="route-nodes">
          {segs.map((s, i) => (
            <span key={s.id} className={`route-node${i < idx ? ' done' : i === idx ? ' cur' : ''}`} />
          ))}
        </div>
        <Img k={idx >= segs.length ? 'compass_upgraded' : def.img} className="sprite-lg pop" key={idx} />
      </Stage>
      {idx < segs.length && (
        <div className="route-hint">
          <div className="route-hint-title">{ROUTE_HINT.title}</div>
          <p>{ROUTE_HINT.text}</p>
          <div className="route-legend">
            {ROUTE_HINT.legend.map(([ico, name]) => (
              <span key={name}>
                <b>{ico}</b> {name}
              </span>
            ))}
          </div>
        </div>
      )}
      {idx < segs.length && (
        <div className="controls grid2">
          {def.options.map((r) => (
            <button key={r.id} type="button" className={`route-card${misses >= 2 && r.id === best.id ? ' hint' : ''}${shakeId === r.id ? ' ' + shake : ''}`} onClick={() => choose(r)}>
              <RouteGlyph r={r} />
              <span className="route-name">{ROUTE_LABELS[seg.id][r.id === 'a' ? 0 : 1]}</span>
              <div className="route-stats">
                {factors.includes('slope') && <Meter kind="slope" n={r.slope} />}
                {factors.includes('obstacle') && <Meter kind="obstacle" n={r.obstacle} />}
                {factors.includes('length') && <Meter kind="length" n={r.length} />}
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function RouteGlyph({ r }: { r: Route }) {
  const short = r.length <= 1;
  const d = short ? 'M10 60 L80 12' : r.length === 2 ? 'M10 60 C 30 20, 60 60, 80 12' : 'M10 60 C 10 10, 45 70, 45 30 S 80 40, 80 12';
  return (
    <svg viewBox="0 0 90 70" className="route-glyph" aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray={r.obstacle ? '2 9' : undefined} />
      <circle cx="10" cy="60" r="6" fill="currentColor" />
      <circle cx="80" cy="12" r="6" fill="currentColor" />
      {r.slope > 0 && <path d="M14 66 L40 66 L40 52 Z" fill="currentColor" opacity=".35" />}
    </svg>
  );
}

function Meter({ kind, n }: { kind: 'slope' | 'obstacle' | 'length'; n: number }) {
  return (
    <span className={`mini-meter mm-${kind}`}>
      <i className="mm-ico">{kind === 'slope' ? '▲' : kind === 'obstacle' ? '■' : '↔'}</i>
      {[0, 1, 2].map((i) => (
        <b key={i} className={i < n ? 'on' : ''} />
      ))}
    </span>
  );
}

/** L26 — combineAnyTwo: every pair of elements is valid. */
export function CombineTwo({ level, finished, complete }: MechanicProps) {
  const els = level.mechanic.elements as string[];
  const [slots, setSlots] = useState<(string | null)[]>([null, null]);
  const [mixed, setMixed] = useState(finished);
  const later = useTimeout();
  const put = (id: string) => {
    if (mixed || finished) return;
    const i = slots.indexOf(null);
    if (i < 0) return;
    const next = [...slots];
    next[i] = id;
    setSlots(next);
    if (next.every(Boolean)) {
      later(() => {
        setMixed(true);
        complete();
      }, 450);
    }
  };
  const clear = (i: number) => {
    if (mixed || finished) return;
    const next = [...slots];
    next[i] = null;
    setSlots(next);
  };
  return (
    <>
      <Stage level={level} className="stage-short">
        <div className="mix">
          {slots.map((s, i) => (
            <button key={i} type="button" data-ui={i ? 'element_mix_slot_right' : 'element_mix_slot_left'} className={`mix-slot${s ? ' full' : ''}`} onClick={() => clear(i)} aria-label={`slot ${i + 1}`}>
              {s && <Img k={`element_${s}`} className="mix-img pop" />}
            </button>
          ))}
        </div>
        {mixed && <Img k="element_mix_effect" className="sprite-lg fx-mix pop" />}
        {mixed && <Img k="item_new_element" className="sprite-md fx-new pop" />}
      </Stage>
      <div className="controls row">
        {els.map((id) => (
          <button key={id} type="button" className="btn btn-art btn-element" disabled={finished || mixed || !slots.includes(null)} onClick={() => put(id)}>
            <Img k={`element_${id}`} className="btn-sprite" />
            <span>{t(`levels.${levelKey(level.id)}.elements.${id}`)}</span>
          </button>
        ))}
      </div>
    </>
  );
}

/** L30 — finalBuildAssembly: activate all six categories using the accumulated unlocks. */
const UNLOCK_ART: Record<string, string> = {
  compass: 'item_compass',
  compass_upgraded: 'item_compass_upgraded',
  paper_tulip: 'item_paper_tulip',
  maker_part: 'item_maker_part',
  factchecker_badge: 'badge_factchecker',
  book: 'item_book',
  clean_log: 'item_clean_log',
  night_vision: 'effect_night_vision',
  warmth: 'effect_warmth',
  boarding_pass: 'item_boarding_pass',
  player2: 'player2_default',
  lapka: 'lapka_default',
  home_base: 'effect_home',
  new_element: 'item_new_element',
  portal_effect: 'effect_portal',
  world_key: 'item_world_key',
};

type Flyer = { key: number; url: string; x0: number; y0: number; x1: number; y1: number; go: boolean };

export function FinalBuild({ level, progress, finished, complete }: MechanicProps) {
  const cats = level.mechanic.categories as { id: string; sourceUnlocks: string[] }[];
  const [on, setOn] = useState<string[]>(finished ? cats.map((c) => c.id) : []);
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [pulse, setPulse] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const later = useTimeout();
  const all = on.length === cats.length;

  const activate = (id: string, el: HTMLElement) => {
    if (on.includes(id) || finished) return;
    const next = [...on, id];
    setOn(next);
    sfx('whoosh');
    // the parts of this category fly from the slot into the hero
    const cat = cats.find((c) => c.id === id)!;
    const sr = el.getBoundingClientRect();
    const hr = (stageRef.current ?? el).getBoundingClientRect();
    const icons = cat.sourceUnlocks.map((u) => assetUrl(UNLOCK_ART[u])).filter(Boolean).slice(0, 3);
    const born = icons.map((url, i) => ({ key: Date.now() + i, url, x0: sr.left + sr.width / 2 + (i - 1) * 22, y0: sr.top + sr.height / 2, x1: hr.left + hr.width / 2, y1: hr.top + hr.height * 0.55, go: false }));
    setFlyers((f) => [...f, ...born]);
    later(() => setFlyers((f) => f.map((x) => (born.some((b) => b.key === x.key) ? { ...x, go: true } : x))), 30);
    later(() => {
      setFlyers((f) => f.filter((x) => !born.some((b) => b.key === x.key)));
      setPulse((p) => p + 1);
      sfx('ok');
      if (next.length === cats.length) complete(`${t('levels.30.completionTitle')}\n${t('levels.30.completionText')}`);
    }, 800);
  };
  return (
    <>
      <div ref={stageRef} className={`power-${Math.min(on.length, 6)}`}>
        <Stage level={level} className="stage-tall" castOverride={{ hero: all ? 'hero_build_complete' : 'hero_mirror' }}>
          <div key={pulse} className="hero-pulse" />
          {all && <Img k="build_complete_effect" className="fx-build pop" />}
        </Stage>
      </div>
      <div className="build-grid">
        {cats.map((c) => {
          const active = on.includes(c.id);
          const owned = c.sourceUnlocks.filter((u) => progress.unlockedItems.includes(u));
          return (
            <button key={c.id} type="button" data-ui={`build_slot_${c.id}`} className={`build-slot${active ? ' active' : ''}`} onClick={(e) => activate(c.id, e.currentTarget)} disabled={finished}>
              <span className="build-name">{t(`levels.30.categories.${c.id}`)}</span>
              <span className="build-icons">
                {c.sourceUnlocks.map((u) => (
                  <Img key={u} k={UNLOCK_ART[u]} className={`build-ico${owned.includes(u) ? '' : ' missing'}`} />
                ))}
              </span>
            </button>
          );
        })}
      </div>
      <Pips done={on.length} total={cats.length} />
      {flyers.map((f) => (
        <img key={f.key} src={f.url} alt="" className="flyer" style={{ left: f.go ? f.x1 : f.x0, top: f.go ? f.y1 : f.y0, opacity: f.go ? 0.2 : 1, transform: `translate(-50%, -50%) scale(${f.go ? 0.4 : 1})` }} />
      ))}
    </>
  );
}
