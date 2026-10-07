import { levels, levelKey, t, TOTAL_LEVELS } from './data';
import { ACHIEVEMENT_GIVES } from './extraCopy';
import { HomeButton } from './LevelScreen';
import { Img } from './ui';
import { EGG_HINTS, EGGS, getStats } from './stats';
import type { GameProgress } from './progress';

/** All achievements of the single playthrough: earned ones are readable, the rest stay a surprise. */
export function GalleryScreen({ progress, onHome }: { progress: GameProgress; onHome: () => void }) {
  const got = progress.achievements.length;
  const eggs = getStats().eggs;
  return (
    <div className="screen gallery-screen">
      <div className="topbar">
        <HomeButton onHome={onHome} />
      </div>
      <h1 className="level-title">ДОСТИЖЕНИЯ И СЕКРЕТЫ</h1>
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
              <div className="gallery-ico">{ok ? <Img k={lv.reward.equipmentKey ?? lv.visualState.headerIconKey} className="gallery-img" /> : <span className="gallery-lock">?</span>}</div>
              <div className="gallery-text">
                <div className="gallery-title">{ok ? t(`achievements.${k}.title`) : `№ ${lv.id}`}</div>
                {ok && <div className="gallery-desc">{t(`achievements.${k}.description`)}</div>}
                {ok && <div className="gallery-gives">{ACHIEVEMENT_GIVES[lv.id]}</div>}
              </div>
            </li>
          );
        })}
      </ul>
      <h2 className="gallery-h2">СЕКРЕТЫ · {eggs.length} / {Object.keys(EGGS).length}</h2>
      <ul className="gallery-list">
        {Object.entries(EGGS).map(([id, name]) => (
          <li key={id} className={`gallery-item egg${eggs.includes(id) ? ' on' : ''}`}>
            <div className="gallery-ico">{eggs.includes(id) ? <span className="egg-star">★</span> : <span className="gallery-lock">?</span>}</div>
            <div className="gallery-text">
              <div className="gallery-title">{eggs.includes(id) ? name : 'Секрет'}</div>
              {!eggs.includes(id) && <div className="egg-hint">{EGG_HINTS[id]}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
