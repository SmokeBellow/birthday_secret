import { useState } from 'react';
import { levelKey, t } from '../data';
import { Img, Pips, Stage, useShake, type MechanicProps } from '../ui';

/** Where every layer lands in the scene (% of the stage) and which sprite it uses. */
const LAYERS: Record<string, { x: number; y: number; w: number; asset: string; cls: string }> = {
  landscape: { x: 50, y: 82, w: 30, asset: 'world_landscape_layer', cls: 'lay-rise' },
  hero: { x: 50, y: 52, w: 24, asset: 'world_hero_layer', cls: 'lay-drop' },
  jump: { x: 50, y: 70, w: 44, asset: 'world_jump_effect', cls: 'lay-ring' },
  slime: { x: 76, y: 66, w: 17, asset: 'world_slime', cls: 'lay-bounce' },
};

/** L28 — layerBuilder: tap the glowing spot in the scene to place the next layer of the world. */
export function WorldBuilder({ level, finished, complete }: MechanicProps) {
  const seq = level.mechanic.sequence as string[];
  const [step, setStep] = useState(finished ? seq.length : 0);
  const [shake, doShake] = useShake();
  const place = (i: number) => {
    if (step >= seq.length) return;
    if (i !== step) return doShake();
    const n = step + 1;
    setStep(n);
    if (n >= seq.length) complete(t(`levels.${levelKey(level.id)}.completion`) || undefined);
  };
  const label = (id: string) => t(`levels.${levelKey(level.id)}.steps.${id}`);
  return (
    <>
      <Stage level={level} cast={false} className="stage-tall">
        <div className={`world ${shake}`}>
          {seq.map((id, i) => {
            const L = LAYERS[id];
            const style = { left: `${L.x}%`, top: `${L.y}%`, width: `${L.w}%` };
            if (i < step) return <Img key={id} k={L.asset} className={`wl2 ${L.cls}`} style={style} />;
            if (i === step && !finished)
              return (
                <button key={id} type="button" className="world-spot" style={style} onClick={() => place(i)} aria-label={id}>
                  <span className="world-plus">+</span>
                  <span className="world-chip mono">{label(id)}</span>
                </button>
              );
            return null;
          })}
        </div>
      </Stage>
      <Pips done={step} total={seq.length} />
      <div className="controls grid2">
        {seq.map((id, i) => (
          <button key={id} type="button" className={`btn${i < step ? ' btn-done' : i === step ? ' btn-primary' : ' btn-ghost'}`} disabled={finished} onClick={() => place(i)}>
            {label(id)}
          </button>
        ))}
      </div>
    </>
  );
}
