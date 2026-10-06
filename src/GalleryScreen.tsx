import { levels, levelKey, t, TOTAL_LEVELS } from './data';
import { ACHIEVEMENT_GIVES } from './extraCopy';
import { HomeButton } from './LevelScreen';
import { Img } from './ui';
import type { GameProgress } from './progress';

/** All achievements of the single playthrough: earned ones are readable, the rest stay a surprise. */
export function GalleryScreen({ progress, onHome }: { progress: GameProgress; onHome: () => void }) {
  const got = progress.achievements.length;
  return (
    <div className="screen gallery-screen">
      <div className="topbar">
        <HomeButton onHome={onHome} />
      </div>
      <h1 className="level-title">ДОСТИЖЕНИЯ</h1>
      <div className="mono gallery-count">
        {got} / {TOTAL_LEVELS}
      </div>
      <div className="gallery-bar">
        <span style={{ width: `${(got / TOTAL_LEVELS) * 100}%` }} />
      </div>
      <ul className="gallery-list">
        {levels.map((lv) => {
          const k = `level${levelKey(lv.id)}`;
          const ok = progress.achievements.includes(k);
          return (
            <li key={lv.id} className={`gallery-item${ok ? ' on' : ''}`}>
              <div className="gallery-ico">{ok ? <Img k={lv.visualState.headerIconKey} className="gallery-img" /> : <span className="gallery-lock">?</span>}</div>
              <div className="gallery-text">
                <div className="gallery-title">{ok ? t(`achievements.${k}.title`) : `№ ${lv.id}`}</div>
                {ok && <div className="gallery-desc">{t(`achievements.${k}.description`)}</div>}
                {ok && <div className="gallery-gives">{ACHIEVEMENT_GIVES[lv.id]}</div>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
