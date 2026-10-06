import { useState } from 'react';
import { t, tList } from './data';
import { Img } from './ui';

type Props = { hasSave: boolean; complete: boolean; onStart: () => void; onReset: () => void; onGallery: () => void; achievements: number };

export function StartScreen({ hasSave, complete, onStart, onReset, onGallery, achievements }: Props) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="screen start-screen">
      <Img k="bg_start_initialization" className="start-bg" />
      <div className="start-shade" />
      <div className="start-inner">
        <Img k={complete ? 'hero_build_complete' : 'hero_base'} className="start-hero" />
        <h1 className="start-title">{t('start.title')}</h1>
        <div className="start-intro">
          {tList('start.intro').map((line, i, all) => (
            <p key={i} className={i === all.length - 1 ? 'start-sign' : i === 0 ? 'start-hello' : ''}>
              {line}
            </p>
          ))}
        </div>
        <button type="button" className="btn btn-primary btn-xl" onClick={onStart}>
          {t('start.cta')}
        </button>
        {achievements > 0 && (
          <button type="button" className="btn btn-ghost-light" onClick={onGallery}>
            ДОСТИЖЕНИЯ · {achievements}
          </button>
        )}
        {hasSave && !confirming && (
          <button type="button" className="btn-link" onClick={() => setConfirming(true)}>
            СБРОСИТЬ ПРОГРЕСС
          </button>
        )}
        {hasSave && confirming && (
          <div className="confirm" role="alertdialog">
            <p>Стереть весь прогресс?</p>
            <div className="confirm-row">
              <button type="button" className="btn btn-danger" onClick={() => { setConfirming(false); onReset(); }}>
                СБРОСИТЬ
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setConfirming(false)}>
                ОТМЕНА
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
