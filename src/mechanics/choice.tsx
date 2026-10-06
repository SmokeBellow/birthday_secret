import { useState, type ReactNode } from 'react';
import { t } from '../data';
import { Feedback, Img, Stage, useShake, type MechanicProps } from '../ui';

type Choice = { id: string; labelKey: string; resultKey: string };

const CHOICE_ART: Record<number, Record<string, string>> = {
  4: { pawn: 'chess_pawn', knight: 'chess_knight' },
  5: { shortcut: 'route_map_short', scenic: 'route_map_scenic' },
  11: { house_rule: 'item_house_rule_card' },
  15: { more: 'fact_card_stack', counterfact: 'item_book' },
  20: { inspect: 'legendary_ring_idle', equip: 'item_ring' },
  27: { bright: 'portal_bright', side: 'portal_side' },
};

/**
 * L4, L5, L11, L15, L20, L27 — one shared "pick an option" mechanic.
 *  - L4/L5/L11/L15: any pick is a valid completion (the reaction line differs).
 *  - L20: inspecting is a free action, equipping completes.
 *  - L27: the bright door is a recoverable wrong turn; the side door completes.
 */
export function ChoiceMechanic({ level, finished, complete }: MechanicProps) {
  const choices = level.mechanic.choices as Choice[];
  const [picked, setPicked] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState('');
  const [tone, setTone] = useState<'info' | 'good' | 'warn'>('info');
  const [shake, doShake] = useShake();
  const [inspected, setInspected] = useState(false);
  const [escalation, setEscalation] = useState(0);

  const pick = (c: Choice) => {
    if (finished) return;
    const result = t(c.resultKey);
    setLastResult(result);
    if (level.id === 20) {
      if (c.id === 'inspect') {
        setInspected(true);
        setTone('info');
        return;
      }
      setPicked('equip');
      setTone('good');
      complete(result);
      return;
    }
    if (level.id === 27 && c.id === 'bright') {
      setTone('warn');
      doShake();
      return;
    }
    if (level.id === 15 && c.id === 'more') setEscalation(3);
    setPicked(c.id);
    setTone(level.id === 27 || c.id === 'counterfact' || c.id === 'house_rule' || c.id === 'pawn' || c.id === 'shortcut' ? 'good' : 'warn');
    complete(result);
  };

  const art = CHOICE_ART[level.id] ?? {};
  const equipped = level.id === 20 && picked === 'equip';

  let scene: ReactNode;
  switch (level.id) {
    case 4:
      scene = (
        <Stage level={level} cast={false} className="stage-short">
          <Img k="chess_board_small" className="board" />
          {picked && <Img k={art[picked]} className={`board-piece pop board-piece-${picked}`} />}
        </Stage>
      );
      break;
    case 15:
      scene = (
        <Stage level={level} className="stage-short">
          <Img k="fact_card_stack" className={`sprite-lg stack-grow-${escalation}${escalation ? ' shake-b' : ''}`} />
          {picked === 'counterfact' && <Img k="effect_knowledge_aura" className="sprite-lg fx-aura pop" />}
        </Stage>
      );
      break;
    case 20:
      scene = (
        <Stage level={level} className="stage-short">
          <Img k={inspected || equipped ? 'legendary_ring_glow' : 'legendary_ring_idle'} className="sprite-lg ring-item pop" key={String(inspected || equipped)} />
        </Stage>
      );
      break;
    case 27:
      scene = (
        <Stage level={level} cast={false} className="stage-short">
          <Img k="portal_bright" className={`portal portal-l ${shake}`} />
          <Img k="portal_side" className="portal portal-r" />
          {picked === 'side' && <Img k="effect_portal" className="sprite-lg fx-portal pop" />}
        </Stage>
      );
      break;
    default:
      scene = <Stage level={level} className="stage-short" />;
  }

  return (
    <>
      {scene}
      <div className={`controls ${level.id === 5 || level.id === 27 ? 'grid2' : 'stack'}`}>
        {choices.map((c) => {
          const a = art[c.id];
          const withArt = level.id === 4 || level.id === 5 || level.id === 27;
          const disabled = finished || (level.id === 20 && c.id === 'inspect' && inspected);
          return (
            <button
              key={c.id}
              type="button"
              className={`btn ${withArt ? 'btn-art' : ''}${picked === c.id ? ' btn-done' : ' btn-primary-soft'}`}
              disabled={disabled}
              onClick={() => pick(c)}
            >
              {withArt && a && <Img k={a} className="btn-sprite" />}
              <span>{t(c.labelKey)}</span>
            </button>
          );
        })}
      </div>
      <Feedback text={finished ? '' : lastResult} tone={tone} />
    </>
  );
}
