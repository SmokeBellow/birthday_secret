import { useCallback, useState } from 'react';
import { isDev } from './assets';
import { TOTAL_LEVELS } from './data';
import { completeLevel, hasSave, loadProgress, resetProgress, saveProgress, seedPrerequisites, type GameProgress } from './progress';
import { StartScreen } from './StartScreen';
import { LevelScreen } from './LevelScreen';
import { AchievementScreen } from './AchievementScreen';
import { PostGame, type PostStep } from './PostGame';
import { DevPanel } from './DevPanel';

type Screen = { kind: 'start' } | { kind: 'level'; n: number; run: number } | { kind: 'ach'; n: number } | { kind: 'post'; step: PostStep };

export function GameApp() {
  const [progress, setProgressState] = useState<GameProgress>(() => {
    const p = loadProgress();
    // QA helper (dev only): ?dev=1&level=N&seed=1 pre-completes levels 1..N-1
    const q = new URLSearchParams(window.location.search);
    return isDev && q.get('seed') === '1' && q.get('level') ? seedPrerequisites(p, Number(q.get('level'))) : p;
  });
  const [screen, setScreen] = useState<Screen>(() => {
    const lv = Number(new URLSearchParams(window.location.search).get('level'));
    return isDev && lv >= 1 && lv <= TOTAL_LEVELS ? { kind: 'level', n: lv, run: 0 } : { kind: 'start' };
  });

  const update = useCallback((fn: (p: GameProgress) => GameProgress) => {
    setProgressState((prev) => {
      const next = fn(prev);
      saveProgress(next);
      return next;
    });
  }, []);
  const setProgress = useCallback((p: GameProgress) => update(() => p), [update]);

  const home = () => setScreen({ kind: 'start' });
  const openLevel = (n: number) => setScreen((s) => ({ kind: 'level', n, run: s.kind === 'level' ? s.run + 1 : 0 }));

  const start = () => {
    if (progress.build30Complete && progress.currentLevel >= TOTAL_LEVELS) setScreen({ kind: 'post', step: 'plus' });
    else openLevel(progress.currentLevel);
  };

  const onComplete = (n: number) => update((p) => completeLevel(p, n));
  const afterAchievement = (n: number) => {
    if (n >= TOTAL_LEVELS) setScreen({ kind: 'post', step: 'summary' });
    else openLevel(n + 1);
  };

  const devLevel = screen.kind === 'level' || screen.kind === 'ach' ? screen.n : null;

  return (
    <>
      {screen.kind === 'start' && (
        <StartScreen
          hasSave={hasSave(progress)}
          complete={progress.build30Complete}
          onStart={start}
          onReset={() => setProgress(resetProgress())}
        />
      )}
      {screen.kind === 'level' && (
        <LevelScreen
          key={`${screen.n}-${screen.run}`}
          levelId={screen.n}
          progress={progress}
          onHome={home}
          onComplete={onComplete}
          onNext={(n) => setScreen({ kind: 'ach', n })}
        />
      )}
      {screen.kind === 'ach' && <AchievementScreen levelId={screen.n} onHome={home} onNext={() => afterAchievement(screen.n)} />}
      {screen.kind === 'post' && (
        <PostGame
          step={screen.step}
          onStep={(step) => setScreen({ kind: 'post', step })}
          onHome={home}
          onRestart={() => {
            update((p) => ({ ...p, currentLevel: 1 }));
            openLevel(1);
          }}
        />
      )}
      {isDev && (
        <DevPanel
          progress={progress}
          level={devLevel}
          onJump={openLevel}
          onAchievement={(n) => setScreen({ kind: 'ach', n })}
          onSeed={(n) => update((p) => seedPrerequisites(p, n))}
          onReset={() => setProgress(resetProgress())}
          onPostGame={() => setScreen({ kind: 'post', step: 'summary' })}
        />
      )}
    </>
  );
}
