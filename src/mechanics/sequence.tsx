import { useState } from 'react';
import { t, levelKey } from '../data';
import { sfx } from '../audio';
import { Img, Pips, Stage, useShake, type MechanicProps } from '../ui';
import { ACTIONS, ActionPanel } from './stages';

type Ctx = { level: MechanicProps['level']; step: number; seq: string[] };

/** Image shown for the current progress of each ordered sequence level. */
function sceneImage(slug: string, id: string): string | null {
  switch (slug) {
    case 'paper_tulip':
      return { divide: 'origami_divide', fold: 'origami_fold', blow: 'origami_blow' }[id] ?? null;
    case 'aviation':
      return `aircraft_${id}`;
    case 'vibecoding':
      return `pipeline_${id}`;
    default:
      return null;
  }
}

function labelFor(level: MechanicProps['level'], id: string): string {
  const k = levelKey(level.id);
  switch (level.id) {
    case 3:
      return t(`levels.${k}.actions.${id}`);
    case 19:
      return id === 'P1' ? 'ИГРОК 1' : 'ИГРОК 2';
    default:
      return t(`levels.${k}.steps.${id}`);
  }
}

function Scene({ level, step, seq }: Ctx) {
  const done = step >= seq.length;
  switch (level.slug) {
    case 'paper_tulip': {
      const k = step === 0 ? 'origami_state_sheet' : done ? 'origami_tulip_finished' : sceneImage('paper_tulip', seq[step - 1]);
      return (
        <Stage level={level} className="stage-short">
          <Img k={k} className="sprite-lg pop" key={k} />
        </Stage>
      );
    }
    case 'aviation': {
      const shown = done ? seq[seq.length - 1] : step === 0 ? seq[0] : seq[step - 1];
      return (
        <Stage level={level} className="stage-short">
          <div className="route-bar">
            <span className="route-line" style={{ width: `${(step / seq.length) * 100}%` }} />
            <Img k={sceneImage('aviation', shown)} className="plane" style={{ left: `${Math.max(4, (step / seq.length) * 86)}%` }} />
          </div>
          {done && <Img k="touchdown_effect" className="sprite-lg fx-touchdown pop" />}
        </Stage>
      );
    }
    case 'coop': {
      const p2In = step >= 2;
      return (
        <Stage level={level} className="stage-short" castOverride={{ p2: p2In ? level.visualState.player2StateKey : null }}>
          <Img k="coop_energy_left" className="energy energy-l" style={{ opacity: step % 2 ? 0.45 : 1 }} />
          <Img k="coop_energy_right" className="energy energy-r" style={{ opacity: step >= 2 && step % 2 === 0 ? 1 : 0.45 }} />
          {step === 2 && <Img k="player2_join_effect" className="sprite-lg fx-join pop" />}
        </Stage>
      );
    }
    default:
      return <Stage level={level} className="stage-short" />;
  }
}

/** L3, L16, L19, L24, L28 — one shared ordered-sequence mechanic. */
export function Sequence({ level, finished, complete }: MechanicProps) {
  const seq = level.mechanic.sequence as string[];
  const [step, setStep] = useState(finished ? seq.length : 0);
  const [shake, doShake] = useShake();
  const press = (i: number) => {
    if (step >= seq.length) return;
    if (i !== step) return doShake();
    const n = step + 1;
    setStep(n);
    sfx('ok');
    if (n >= seq.length) complete(t(`levels.${levelKey(level.id)}.completion`) || undefined);
  };
  const actions = ACTIONS[level.slug];
  const isCoop = level.slug === 'coop';
  const isPipe = level.slug === 'vibecoding';
  return (
    <>
      <Scene level={level} step={step} seq={seq} />
      <Pips done={step} total={seq.length} />
      {isPipe && (
        <div className="pipeline">
          {seq.map((id, i) => (
            <div key={id} className={`pipe-node${i < step ? ' done' : i === step ? ' current' : ''}`}>
              <Img k={`pipeline_${id}`} className="pipe-img" />
            </div>
          ))}
        </div>
      )}
      {actions && (
        <>
          <div className="step-chips">
            {seq.map((id, i) => (
              <span key={id} className={`step-chip mono${i < step ? ' done' : i === step ? ' cur' : ''}`}>
                {labelFor(level, id)}
              </span>
            ))}
          </div>
          {step < seq.length && !finished && <ActionPanel key={step} def={actions[step]} onDone={() => press(step)} />}
        </>
      )}
      {!actions && <div className={`controls ${isCoop ? 'row' : seq.length === 4 && !isPipe ? 'grid2' : isPipe ? 'grid2' : 'stack'} ${shake}`}>
        {isCoop ? (
          <>
            {(['P1', 'P2'] as const).map((who) => {
              const myTurn = !finished && step < seq.length && seq[step] === who;
              return (
                <button
                  key={who}
                  type="button"
                  className={`btn btn-xl${myTurn ? ' btn-primary pulse' : ' btn-ghost'}`}
                  disabled={finished || !myTurn}
                  onClick={() => press(step)}
                >
                  {labelFor(level, who)}
                </button>
              );
            })}
          </>
        ) : (
          seq.map((id, i) => (
            <button
              key={id}
              type="button"
              className={`btn${i < step ? ' btn-done' : i === step ? ' btn-primary' : ' btn-ghost'}`}
              disabled={finished}
              onClick={() => press(i)}
            >
              {labelFor(level, id)}
            </button>
          ))
        )}
      </div>}
    </>
  );
}
