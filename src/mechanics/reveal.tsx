import { useState } from 'react';
import { t } from '../data';
import { Img, Pips, Stage, TapTarget, type MechanicProps } from '../ui';

/** L1 — rapidTapProgressiveReveal: three taps load the hero in 33 / 66 / 100 % steps. */
export function TapReveal({ level, finished, complete }: MechanicProps) {
  const total = level.mechanic.requiredActions as number;
  const [taps, setTaps] = useState(finished ? total : 0);
  const [flash, setFlash] = useState(false);
  const pct = Math.round((taps / total) * 100);
  const tap = () => {
    if (taps >= total) return;
    const n = taps + 1;
    setTaps(n);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 160);
    if (n >= total) complete();
  };
  return (
    <>
      <Stage level={level} cast={false} className="stage-tall">
        <div className="char-slot" data-ui="ui_character_slot">
          <div className="char-slot-frame" />
          <div className="char-slot-reveal" style={{ clipPath: `inset(${100 - pct}% 0 0 0)` }}>
            <Img k={level.visualState.heroStateKey} className="slot-hero" />
          </div>
          <div className="char-slot-pct">{pct}%</div>
        </div>
      </Stage>
      <div className="controls center">
        <TapTarget onTap={tap} count={taps} total={total} disabled={finished} flash={flash} />
      </div>
    </>
  );
}

/** L2 / L29 — independentRevealCards: every card opens on its own. */
const CARD_CSS: Record<string, string> = {
  birth_year: 'card_fact_birth_year',
  favorite_snack: 'card_fact_snack',
  secret_skill: 'card_fact_secret_skill',
  origin: 'fact_max_card_origin',
  plot_twist: 'fact_max_card_twist',
  rare_drop: 'fact_max_card_drop',
  final_fact: 'fact_max_card_final',
};

export function RevealCards({ level, finished, complete }: MechanicProps) {
  const items = level.mechanic.items as { id: string; labelKey: string; resultKey: string }[];
  const [open, setOpen] = useState<string[]>(finished ? items.map((i) => i.id) : []);
  const isMax = level.id === 29;
  const toggle = (id: string) => {
    if (open.includes(id)) return;
    const next = [...open, id];
    setOpen(next);
    if (next.length === items.length) complete();
  };
  return (
    <>
      <Stage level={level} className="stage-short" />
      <div className={`cards ${isMax ? 'cards-max' : ''}`}>
        {items.map((it, i) => {
          const isOpen = open.includes(it.id);
          return (
            <button
              key={it.id}
              type="button"
              data-ui={CARD_CSS[it.id]}
              className={`fact-card${isOpen ? ' open' : ''}`}
              onClick={() => toggle(it.id)}
              aria-expanded={isOpen}
            >
              <span className="fact-card-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="fact-card-label">{t(it.labelKey)}</span>
              {isOpen && <span className="fact-card-result">{t(it.resultKey)}</span>}
            </button>
          );
        })}
      </div>
      <Pips done={open.length} total={items.length} />
      {isMax && open.length === items.length && (
        <div className="collapse-fx">
          <Img k="fact_stack_collapse" className="sprite-md" />
        </div>
      )}
    </>
  );
}
