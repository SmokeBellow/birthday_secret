import { useState } from 'react';
import { t } from './data';
import { Img } from './ui';

type Props = { hasSave: boolean; complete: boolean; onStart: () => void; onReset: () => void };

export function StartScreen({ hasSave, complete, onStart, onReset }: Props) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="screen start-screen">
      <Img k="bg_start_initialization" className="start-bg" />
      <div className="start-shade" />
      <div className="start-inner">
        <Img k={complete ? 'hero_build_complete' : 'hero_base'} className="start-hero" />
        <h1 className="start-title">{t('start.title')}</h1>
        <p className="start-sub">{t('start.subtitle')}</p>
        <button type="button" className="btn btn-primary btn-xl" onClick={onStart}>
          {t('start.cta')}
        </button>
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
