import { getLevel, levelKey, t, TOTAL_LEVELS } from './data';
import { HomeButton } from './LevelScreen';
import { Img } from './ui';

export function AchievementScreen({ levelId, onHome, onNext }: { levelId: number; onHome: () => void; onNext: () => void }) {
  const lv = getLevel(levelId);
  const k = `level${levelKey(levelId)}`;
  const reward = lv.reward.equipmentKey;
  const isChar = reward === 'player2_unlock' || reward === 'lapka_unlock' || reward === 'hero_base';
  return (
    <div className="screen ach-screen">
      <div className="topbar">
        <HomeButton onHome={onHome} />
      </div>
      <div className="ach-card">
        <div className="mono ach-label">{t('common.achievement')}</div>
        <Img k={lv.visualState.headerIconKey} className="ach-icon pop" />
        <h1 className="ach-title">{t(`achievements.${k}.title`)}</h1>
        <p className="ach-desc">{t(`achievements.${k}.description`)}</p>
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
