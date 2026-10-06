import { useState } from 'react';
import { getLevel, levelKey, levels, t, TOTAL_LEVELS } from './data';
import { MECHANICS } from './mechanics';
import { Img } from './ui';
import type { GameProgress } from './progress';
import { sfx } from './audio';

export function GameHUD({ progress, level }: { progress: GameProgress; level: number }) {
  const earned = levels
    .filter((l) => progress.completedLevels.includes(l.id) && l.reward.equipmentKey && l.id < level)
    .map((l) => l.reward.equipmentKey as string);
  return (
    <footer className="hud">
      <div className="hud-bar">
        <span style={{ width: `${(Math.min(level - 1, TOTAL_LEVELS) / TOTAL_LEVELS) * 100}%` }} />
      </div>
      <div className="hud-row">
        <span className="mono">
          {String(level).padStart(2, '0')}/{TOTAL_LEVELS}
        </span>
        <div className="hud-items">
          {earned.map((k) => (
            <Img key={k} k={k} className="hud-item" />
          ))}
        </div>
      </div>
    </footer>
  );
}

export function HomeButton({ onHome }: { onHome: () => void }) {
  return (
    <button type="button" className="home-btn" onClick={onHome}>
      ← В НАЧАЛО
    </button>
  );
}

type Props = {
  levelId: number;
  progress: GameProgress;
  onHome: () => void;
  onComplete: (n: number) => void;
  onNext: (n: number) => void;
};

export function LevelScreen({ levelId, progress, onHome, onComplete, onNext }: Props) {
  const level = getLevel(levelId);
  const k = levelKey(levelId);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState('');
  const Mechanic = MECHANICS[level.mechanic.type];

  const complete = (r?: string) => {
    if (done) return;
    setDone(true);
    sfx('win');
    setResult(r ?? t(`levels.${k}.completion`));
    onComplete(levelId);
  };

  return (
    <div className="screen level-screen">
      <div className="topbar">
        <HomeButton onHome={onHome} />
      </div>
      <header className="level-head">
        <div className="level-meta">
          <div className="mono level-num">
            УРОВЕНЬ {k} / {TOTAL_LEVELS}
          </div>
          <div className="mono level-stage">{t(`levels.${k}.stage`)}</div>
        </div>
        <Img k={level.visualState.headerIconKey} className="level-icon" />
      </header>
      <h1 className="level-title">{t(`levels.${k}.title`)}</h1>
      <p className="level-intro">{t(`levels.${k}.intro`)}</p>
      <p className="level-objective">{t(level.mechanic.objectiveKey)}</p>
      <main className="level-body">
        {Mechanic ? <Mechanic level={level} progress={progress} finished={done} complete={complete} /> : <p>unknown mechanic {level.mechanic.type}</p>}
      </main>
      {done && (
        <section className="done-panel" role="status">
          <div className="mono done-label">{t('common.levelComplete')}</div>
          {result && (
            <div className="done-text">
              {result.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}
          <button type="button" className="btn btn-primary btn-xl" onClick={() => onNext(levelId)}>
            {t('common.continue')}
          </button>
        </section>
      )}
      <GameHUD progress={progress} level={levelId} />
    </div>
  );
}
