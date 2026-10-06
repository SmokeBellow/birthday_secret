import { useEffect, useRef, useState } from 'react';
import { sfx } from '../audio';
import { TapTarget, useShake } from '../ui';

export type StepKind = 'swipe' | 'hold' | 'taps' | 'timing' | 'catch';
export type StepDef = { kind: StepKind; n?: number; ms?: number; dir?: 'h' | 'diag' };

/** One physical action per step of an ordered sequence (the canonical step labels stay as they are). */
export const ACTIONS: Record<string, StepDef[]> = {
  paper_tulip: [{ kind: 'swipe', dir: 'h' }, { kind: 'swipe', dir: 'diag' }, { kind: 'hold', ms: 1300 }],
  vibecoding: [{ kind: 'taps', n: 3 }, { kind: 'taps', n: 6 }, { kind: 'hold', ms: 1400 }, { kind: 'catch', n: 3 }],
  aviation: [{ kind: 'hold', ms: 1800 }, { kind: 'timing' }, { kind: 'catch', n: 3 }, { kind: 'timing' }],
};

type Props = { def: StepDef; onDone: () => void };

function Arrow({ dir }: { dir: 'h' | 'diag' }) {
  return (
    <svg viewBox="0 0 120 60" className={`swipe-arrow ${dir}`} aria-hidden>
      <path d={dir === 'h' ? 'M8 30h92M80 12l22 18-22 18' : 'M10 52L96 12M72 10l26 2-8 24'} fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Drag across the area. After three clumsy tries any drag or tap is accepted so nobody gets stuck. */
function Swipe({ def, onDone }: Props) {
  const start = useRef<[number, number] | null>(null);
  const tries = useRef(0);
  const [shake, doShake] = useShake();
  const [trail, setTrail] = useState(0);
  const finish = () => {
    sfx('whoosh');
    onDone();
  };
  return (
    <div
      className={`swipe-area ${shake}`}
      data-kind="swipe"
      data-dir={def.dir}
      onPointerDown={(e) => {
        start.current = [e.clientX, e.clientY];
        setTrail(0);
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (start.current) setTrail(Math.min(1, Math.hypot(e.clientX - start.current[0], e.clientY - start.current[1]) / 80));
      }}
      onPointerUp={(e) => {
        if (!start.current) return;
        const dx = e.clientX - start.current[0];
        const dy = e.clientY - start.current[1];
        start.current = null;
        setTrail(0);
        const dist = Math.hypot(dx, dy);
        const ok = def.dir === 'h' ? Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3 : dx > 30 && dy < -30;
        tries.current += 1;
        if (ok || tries.current > 3) return finish();
        if (dist > 10) doShake();
      }}
      onPointerCancel={() => (start.current = null)}
    >
      <Arrow dir={def.dir ?? 'h'} />
      <span className="swipe-trail" style={{ transform: `scaleX(${trail})` }} />
    </div>
  );
}

/** Hold the button until the ring fills; letting go drains it. */
function Hold({ def, onDone }: Props) {
  const ms = def.ms ?? 1200;
  const ringRef = useRef<HTMLDivElement>(null);
  const held = useRef(false);
  const prog = useRef(0);
  const done = useRef(false);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      if (!done.current) {
        prog.current = held.current ? Math.min(ms, prog.current + dt) : Math.max(0, prog.current - dt * 1.5);
        ringRef.current?.style.setProperty('--p', `${(prog.current / ms) * 360}deg`);
        if (prog.current >= ms) {
          done.current = true;
          sfx('ok');
          onDone();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="hold-wrap" data-kind="hold">
      <div ref={ringRef} className="hold-ring">
        <button
          type="button"
          className="tap-target hold"
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
    </div>
  );
}

function Taps({ def, onDone }: Props) {
  const n = def.n ?? 3;
  const [c, setC] = useState(0);
  return (
    <div className="taps-wrap" data-kind="taps">
      <TapTarget
        count={c}
        total={n}
        flash={c > 0}
        onTap={() => {
          const k = c + 1;
          setC(k);
          if (k >= n) onDone();
        }}
      />
    </div>
  );
}

function Timing({ onDone }: Props) {
  const [zone] = useState<[number, number]>(() => {
    const a = 0.5 + Math.random() * 0.25;
    return [a, a + 0.2];
  });
  const markerRef = useRef<HTMLDivElement>(null);
  const pos = useRef(0);
  const [shake, doShake] = useShake();
  const [miss, setMiss] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const ph = ((now - t0) / 1500) % 2;
      pos.current = ph < 1 ? ph : 2 - ph;
      if (markerRef.current) markerRef.current.style.left = `${pos.current * 100}%`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="timing-wrap" data-kind="timing">
      <div className={`timing ${shake}`}>
        <div className="timing-zone" style={{ left: `${zone[0] * 100}%`, width: `${(zone[1] - zone[0]) * 100}%` }} />
        <div className="timing-track">
          <div ref={markerRef} className="timing-marker" />
        </div>
      </div>
      <TapTarget
        flash={miss > 0}
        onTap={() => {
          if (pos.current >= zone[0] && pos.current <= zone[1]) {
            sfx('ok');
            onDone();
          } else {
            setMiss((m) => m + 1);
            doShake();
          }
        }}
      />
    </div>
  );
}

/** Small warnings pop up in the field; tap them away. Missed ones just move somewhere else. */
function Catch({ def, onDone }: Props) {
  const n = def.n ?? 3;
  const [got, setGot] = useState(0);
  const [pos, setPos] = useState<[number, number]>([50, 50]);
  const seq = useRef(0);
  useEffect(() => {
    const id = window.setInterval(() => setPos([12 + Math.random() * 76, 18 + Math.random() * 64]), 1700);
    return () => window.clearInterval(id);
  }, [got]);
  return (
    <div className="catch-field" data-kind="catch">
      <button
        key={seq.current}
        type="button"
        className="catch-target pop"
        style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}
        aria-label="target"
        onClick={() => {
          const k = got + 1;
          sfx('ok');
          seq.current += 1;
          setGot(k);
          setPos([12 + Math.random() * 76, 18 + Math.random() * 64]);
          if (k >= n) onDone();
        }}
      >
        <b>!</b>
      </button>
      <div className="catch-count" aria-hidden>
        {Array.from({ length: n }, (_, i) => (
          <i key={i} className={i < got ? 'on' : ''} />
        ))}
      </div>
    </div>
  );
}

export function ActionPanel(props: Props) {
  switch (props.def.kind) {
    case 'swipe':
      return <Swipe {...props} />;
    case 'hold':
      return <Hold {...props} />;
    case 'taps':
      return <Taps {...props} />;
    case 'timing':
      return <Timing {...props} />;
    case 'catch':
      return <Catch {...props} />;
  }
}
