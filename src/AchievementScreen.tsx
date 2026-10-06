import { getLevel, levelKey, t, TOTAL_LEVELS } from './data';
import { HomeButton } from './LevelScreen';
import { Img } from './ui';
import { useEffect } from 'react';
import { sfx } from './audio';
import { ACHIEVEMENT_GIVES } from './extraCopy';

export function AchievementScreen({ levelId, onHome, onNext }: { levelId: number; onHome: () => void; onNext: () => void }) {
  useEffect(() => {
    sfx("fanfare");
  }, []);
  const lv = getLevel(levelId);
  const k = `level${levelKey(levelId)}`;
  const reward = lv.reward.equipmentKey;
  const isChar = reward === 'player2_unlock' || reward === 'lapka_unlock' || reward === 'hero_base';
  return (
    <div className="screen ach-screen">
      <div className="confetti" aria-hidden>
        {Array.from({ length: 26 }, (_, i) => (
          <i key={i} style={{ left: `${(i * 37) % 100}%`, background: ['#e0a73a', '#c8613a', '#5f8a52', '#6aa6d9', '#f3e6c8'][i % 5], animationDelay: `${(i % 9) * 0.12}s`, animationDuration: `${1.8 + (i % 5) * 0.3}s` }} />
        ))}
      </div>
      <div className="topbar">
        <HomeButton onHome={onHome} />
      </div>
      <div className="ach-card">
        <div className="mono ach-label">{t('common.achievement')}</div>
        <Img k={lv.visualState.headerIconKey} className="ach-icon pop" />
        <h1 className="ach-title">{t(`achievements.${k}.title`)}</h1>
        <p className="ach-desc">{t(`achievements.${k}.description`)}</p>
        <div className="ach-gives">
          <span className="mono ach-gives-label">ЧТО ДАЁТ</span>
          <span>{ACHIEVEMENT_GIVES[levelId]}</span>
        </div>
        {reward && (
          <div className="reward">
            <div className="mono reward-label">{t('common.reward')}</div>
            <Img k={reward} className={isChar ? 'reward-char pop' : 'reward-img pop'} />
          </div>
        )}
      </div>
      <button type="button" className="btn btn-primary btn-xl" onClick={onNext}>
        {t('common.continue')}
      </button>
      <div className="mono hud-mini">
        {String(levelId).padStart(2, '0')}/{TOTAL_LEVELS}
      </div>
    </div>
  );
}
