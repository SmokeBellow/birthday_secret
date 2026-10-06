import { useEffect, useRef, useState, type ReactNode } from 'react';
import { t } from '../data';
import { sfx } from '../audio';
import { Feedback, Img, Stage, useShake, useTimeout, type MechanicProps } from '../ui';

type Choice = { id: string; labelKey: string; resultKey: string };
type Tone = 'info' | 'good' | 'warn';

/** Which answer finishes the level. The other one is a joke reaction and the player simply tries again. */
const INTENDED: Record<number, string> = { 4: 'pawn', 5: 'shortcut', 11: 'house_rule', 15: 'counterfact', 20: 'equip', 27: 'side' };

const CHOICE_ART: Record<number, Record<string, string>> = {
  4: { pawn: 'chess_pawn', knight: 'chess_knight' },
  5: { shortcut: 'route_map_short', scenic: 'route_map_scenic' },
  11: { house_rule: 'item_house_rule_card' },
  15: { more: 'fact_card_stack', counterfact: 'item_book' },
  20: { inspect: 'legendary_ring_idle', equip: 'item_ring' },
  27: { bright: 'portal_bright', side: 'portal_side' },
};

/* ------------------------------------------------------------------ L4: a real (tiny) chess move */
const SIZE = 6;
type Sq = [number, number]; // [col, row]
const START: Record<'pawn' | 'knight', Sq> = { pawn: [1, 4], knight: [4, 5] };

function legalMoves(piece: 'pawn' | 'knight', from: Sq, other: Sq): Sq[] {
  const [c, r] = from;
  const cand: Sq[] =
    piece === 'pawn'
      ? [[c, r - 1], [c, r - 2]]
      : [[c + 1, r - 2], [c - 1, r - 2], [c + 2, r - 1], [c - 2, r - 1], [c + 2, r + 1], [c - 2, r + 1]];
  return cand.filter(([x, y]) => x >= 0 && x < SIZE && y >= 0 && y < SIZE && !(x === other[0] && y === other[1]));
}

function ChessScene({ level, finished, choices, complete }: MechanicProps & { choices: Choice[] }) {
  const [pos, setPos] = useState<Record<'pawn' | 'knight', Sq>>({ pawn: START.pawn, knight: START.knight });
  const [sel, setSel] = useState<'pawn' | 'knight' | null>(null);
  const [text, setText] = useState('');
  const [tone, setTone] = useState<Tone>('info');
  const later = useTimeout();
  const choice = (id: string) => choices.find((c) => c.id === id)!;
  const moves = sel ? legalMoves(sel, pos[sel], pos[sel === 'pawn' ? 'knight' : 'pawn']) : [];

  const select = (p: 'pawn' | 'knight') => {
    if (finished) return;
    setSel(sel === p ? null : p);
    setText('');
  };
  const moveTo = (sq: Sq) => {
    if (!sel || finished) return;
    const p = sel;
    setPos({ ...pos, [p]: sq });
    setSel(null);
    const res = t(choice(p).resultKey);
    setText(res);
    if (p === 'pawn') {
      setTone('good');
      complete(res);
    } else {
      setTone('warn');
      later(() => setPos((cur) => ({ ...cur, knight: START.knight })), 1100); // the knight goes home, try something else
    }
  };

  return (
    <>
      <Stage level={level} cast={false} className="stage-tall">
        <div className="mini-board" style={{ ['--n' as string]: SIZE }}>
          {Array.from({ length: SIZE * SIZE }, (_, i) => {
            const c = i % SIZE;
            const r = Math.floor(i / SIZE);
            const isMove = moves.some(([x, y]) => x === c && y === r);
            return (
              <button key={i} type="button" className={`sq ${(c + r) % 2 ? 'dark' : 'light'}${isMove ? ' move' : ''}`} onClick={() => isMove && moveTo([c, r])} aria-label={`${c},${r}`}>
                {isMove && <i />}
              </button>
            );
          })}
          {(['pawn', 'knight'] as const).map((p) => (
            <div key={p} className={`piece${sel === p ? ' sel' : ''}`} style={{ left: `${(pos[p][0] / SIZE) * 100}%`, top: `${(pos[p][1] / SIZE) * 100}%`, width: `${100 / SIZE}%`, height: `${100 / SIZE}%` }}>
              <Img k={CHOICE_ART[4][p]} className="piece-img" />
            </div>
          ))}
        </div>
      </Stage>
      <div className="controls grid2">
        {choices.map((c) => (
          <button key={c.id} type="button" className={`btn btn-art${sel === c.id ? ' btn-primary' : ' btn-primary-soft'}`} disabled={finished} onClick={() => select(c.id as 'pawn' | 'knight')}>
            <Img k={CHOICE_ART[4][c.id]} className="btn-sprite" />
            <span>{t(c.labelKey)}</span>
          </button>
        ))}
      </div>
      <Feedback text={finished ? '' : text} tone={tone} />
    </>
  );
}

/* ------------------------------------------------------------------ L5: walk the route against the deadline */
const PATHS: Record<'shortcut' | 'scenic', string> = {
  shortcut: 'M24 130 C 90 120, 140 60, 276 40',
  scenic: 'M24 130 C 40 20, 120 20, 140 90 S 230 170, 276 40',
};

function RouteScene({ level, finished, choices, complete }: MechanicProps & { choices: Choice[] }) {
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [tone, setTone] = useState<Tone>('info');
  const [timeLeft, setTimeLeft] = useState(100);
  const shortRef = useRef<SVGPathElement>(null);
  const scenicRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGGElement>(null);
  const raf = useRef(0);
  const later = useTimeout();
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const walk = (c: Choice) => {
    if (busy || finished) return;
    const id = c.id as 'shortcut' | 'scenic';
    const path = (id === 'shortcut' ? shortRef : scenicRef).current!;
    const len = path.getTotalLength();
    const dur = id === 'shortcut' ? 1700 : 3600;
    const cost = id === 'shortcut' ? 30 : 100;
    setBusy(true);
    setText('');
    setTimeLeft(100);
    sfx('whoosh');
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const pt = path.getPointAtLength(len * k);
      dotRef.current?.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
      setTimeLeft(100 - cost * k);
      if (k < 1) raf.current = requestAnimationFrame(step);
      else {
        const res = t(c.resultKey);
        setText(res);
        if (id === 'shortcut') {
          setTone('good');
          complete(res);
        } else {
          setTone('warn');
          sfx('nope');
          later(() => {
            dotRef.current?.setAttribute('transform', 'translate(24 130)');
            setTimeLeft(100);
            setBusy(false);
          }, 1200);
        }
      }
    };
    raf.current = requestAnimationFrame(step);
  };

  return (
    <>
      <Stage level={level} cast={false} className="stage-short">
        <svg viewBox="0 0 300 180" className="route-map" aria-hidden>
          <path ref={scenicRef} d={PATHS.scenic} className="rm-path rm-scenic" />
          <path ref={shortRef} d={PATHS.shortcut} className="rm-path rm-short" />
          <circle cx="24" cy="130" r="8" className="rm-start" />
          <g transform="translate(276 40)">
            <path d="M0 0v-30" stroke="#fff" strokeWidth="4" />
            <path d="M0 -30l22 8-22 8z" fill="#e0533a" stroke="#fff" strokeWidth="2" />
          </g>
          <g ref={dotRef} transform="translate(24 130)">
            <circle r="9" fill="#ffd36a" stroke="#1f2433" strokeWidth="3" />
          </g>
        </svg>
        <div className="deadline" aria-hidden>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M12 8v5l3 2M9 3h6" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
          <span className="deadline-bar"><i className={timeLeft < 35 ? 'low' : ''} style={{ width: `${timeLeft}%` }} /></span>
        </div>
      </Stage>
      <div className="controls grid2">
        {choices.map((c) => (
          <button key={c.id} type="button" className="btn btn-art btn-primary-soft" disabled={busy || finished} onClick={() => walk(c)}>
            <Img k={CHOICE_ART[5][c.id]} className="btn-sprite" />
            <span>{t(c.labelKey)}</span>
          </button>
        ))}
      </div>
      <Feedback text={finished ? '' : text} tone={tone} />
    </>
  );
}

/* ------------------------------------------------------------------ L11: dice decide how the table reacts */
const PIPS: Record<number, number[]> = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
function Die({ n, rolling, gold }: { n: number; rolling: boolean; gold?: boolean }) {
  return (
    <div className={`die${rolling ? ' rolling' : ''}${gold ? ' gold' : ''}`}>
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={PIPS[n].includes(i) ? 'pip-on' : ''} />
      ))}
    </div>
  );
}

function DiceScene({ level, finished, choices, complete }: MechanicProps & { choices: Choice[] }) {
  const [dice, setDice] = useState<[number, number]>([3, 4]);
  const [rolling, setRolling] = useState(false);
  const [text, setText] = useState('');
  const [tone, setTone] = useState<Tone>('info');
  const [rule, setRule] = useState(false);
  const later = useTimeout();
  const roll = (c: Choice) => {
    if (rolling || finished) return;
    setRolling(true);
    setText('');
    setRule(false);
    sfx('whoosh');
    let i = 0;
    const iv = window.setInterval(() => {
      setDice([1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]);
      if (++i > 9) {
        window.clearInterval(iv);
        const win = c.id === 'win';
        setDice(win ? [6, 6] : [3, 4]);
        setRolling(false);
        const res = t(c.resultKey);
        setText(res);
        if (win) {
          setTone('warn');
          sfx('nope');
        } else {
          setTone('good');
          setRule(true);
          later(() => complete(res), 500);
        }
      }
    }, 90);
  };
  return (
    <>
      <Stage level={level} className="stage-short" castOverride={{ p2: null, lapka: null }}>
        <div className="dice-row">
          <Die n={dice[0]} rolling={rolling} gold={!rolling && text !== '' && tone === 'warn'} />
          <Die n={dice[1]} rolling={rolling} gold={!rolling && text !== '' && tone === 'warn'} />
        </div>
        {rule && <Img k="item_house_rule_card" className="sprite-lg rule-pop pop" />}
      </Stage>
      <div className="controls stack">
        {choices.map((c) => (
          <button key={c.id} type="button" className="btn btn-primary-soft" disabled={rolling || finished} onClick={() => roll(c)}>
            <span>{t(c.labelKey)}</span>
          </button>
        ))}
      </div>
      <Feedback text={finished ? '' : text} tone={tone} />
    </>
  );
}

/* ------------------------------------------------------------------ L15: the pile of facts grows */
function StackScene({ level, finished, choices, complete }: MechanicProps & { choices: Choice[] }) {
  const [pile, setPile] = useState(1);
  const [text, setText] = useState('');
  const [tone, setTone] = useState<Tone>('info');
  const [shake, doShake] = useShake();
  const [over, setOver] = useState(false);
  const [done, setDone] = useState(false);
  const pick = (c: Choice) => {
    if (finished || done) return;
    const res = t(c.resultKey);
    setText(res);
    if (c.id === 'more') {
      setPile((p) => Math.min(6, p + 1));
      setOver(true);
      setTone('warn');
      doShake();
    } else {
      setTone('good');
      setDone(true);
      setPile(0);
      complete(res);
    }
  };
  return (
    <>
      <Stage level={level} className="stage-short">
        <div className={`fact-pile ${shake}${over ? ' over' : ''}`}>
          {Array.from({ length: pile }, (_, i) => (
            <Img key={i} k="fact_card_stack" className="pile-card pop" style={{ bottom: `${i * 14}%`, left: `${(i % 2 ? 1 : -1) * (i * 3)}%`, transform: `rotate(${(i % 2 ? 1 : -1) * i * 4}deg)` }} />
          ))}
        </div>
        {done && <Img k="fact_stack_collapse" className="sprite-lg pop" />}
        {done && <Img k="effect_knowledge_aura" className="sprite-lg fx-aura pop" />}
      </Stage>
      <div className="controls stack">
        {choices.map((c) => (
          <button key={c.id} type="button" className="btn btn-primary-soft" disabled={finished || done} onClick={() => pick(c)}>
            <span>{t(c.labelKey)}</span>
          </button>
        ))}
      </div>
      <Feedback text={finished ? '' : text} tone={tone} />
    </>
  );
}

/* ------------------------------------------------------------------ L20 / L27: generic choice with a recoverable wrong option */
function GenericScene(props: MechanicProps & { choices: Choice[] }) {
  const { level, finished, complete, choices } = props;
  const [lastResult, setLastResult] = useState('');
  const [tone, setTone] = useState<Tone>('info');
  const [shake, doShake] = useShake();
  const [inspected, setInspected] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const art = CHOICE_ART[level.id] ?? {};
  const intended = INTENDED[level.id];

  const pick = (c: Choice) => {
    if (finished) return;
    const result = t(c.resultKey);
    setLastResult(result);
    if (level.id === 20 && c.id === 'inspect') {
      setInspected(true);
      setTone('info');
      return;
    }
    if (c.id !== intended) {
      setTone('warn');
      doShake();
      return;
    }
    setPicked(c.id);
    setTone('good');
    complete(result);
  };
  const equipped = level.id === 20 && picked === 'equip';
  let scene: ReactNode;
  if (level.id === 20)
    scene = (
      <Stage level={level} className="stage-short">
        <Img k={inspected || equipped ? 'legendary_ring_glow' : 'legendary_ring_idle'} className="sprite-lg ring-item pop" key={String(inspected || equipped)} />
      </Stage>
    );
  else
    scene = (
      <Stage level={level} cast={false} className="stage-short">
        <Img k="portal_bright" className={`portal portal-l ${shake}`} />
        <Img k="portal_side" className="portal portal-r" />
        {picked === 'side' && <Img k="effect_portal" className="sprite-lg fx-portal pop" />}
      </Stage>
    );
  return (
    <>
      {scene}
      <div className={`controls ${level.id === 27 ? 'grid2' : 'stack'}`}>
        {choices.map((c) => {
          const withArt = level.id === 27;
          const disabled = finished || (level.id === 20 && c.id === 'inspect' && inspected);
          return (
            <button key={c.id} type="button" className={`btn ${withArt ? 'btn-art' : ''}${picked === c.id ? ' btn-done' : ' btn-primary-soft'}`} disabled={disabled} onClick={() => pick(c)}>
              {withArt && art[c.id] && <Img k={art[c.id]} className="btn-sprite" />}
              <span>{t(c.labelKey)}</span>
            </button>
          );
        })}
      </div>
      <Feedback text={finished ? '' : lastResult} tone={tone} />
    </>
  );
}

/** L4, L5, L11, L15, L20, L27 — one entry point, each level gets its own little scene. */
export function ChoiceMechanic(props: MechanicProps) {
  const choices = props.level.mechanic.choices as Choice[];
  switch (props.level.id) {
    case 4:
      return <ChessScene {...props} choices={choices} />;
    case 5:
      return <RouteScene {...props} choices={choices} />;
    case 11:
      return <DiceScene {...props} choices={choices} />;
    case 15:
      return <StackScene {...props} choices={choices} />;
    default:
      return <GenericScene {...props} choices={choices} />;
  }
}
