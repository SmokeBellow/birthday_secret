import { useState } from 'react';
import { t, tList } from './data';
import { BUTTONS } from './extraCopy';
import { foundEgg } from './stats';
import { haptic, sfx } from './audio';
import { useRef } from 'react';
import { Img } from './ui';

type Props = { hasSave: boolean; complete: boolean; onStart: () => void; onReset: () => void; onGallery: () => void; achievements: number };

export function StartScreen({ hasSave, complete, onStart, onReset, onGallery, achievements }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [egg, setEgg] = useState(false);
  const [go, setGo] = useState(false);
  const launch = () => {
    if (go) return;
    setGo(true);
    sfx('fanfare');
    haptic([40, 30, 40]);
    window.setTimeout(onStart, 1250);
  };
  const titleTaps = useRef({ n: 0, last: 0 });
  const tapTitle = () => {
    const now = Date.now();
    titleTaps.current.n = now - titleTaps.current.last > 1800 ? 1 : titleTaps.current.n + 1;
    titleTaps.current.last = now;
    if (titleTaps.current.n >= 7) {
      titleTaps.current.n = 0;
      foundEgg('version');
      sfx('ding');
      setEgg(true);
    }
  };
  return (
    <div className="screen start-screen">
      <Img k="bg_start_initialization" className="start-bg" />
      <div className="start-shade" />
      <div className="start-inner">
        <Img k={complete ? 'hero_build_complete' : 'hero_base'} className="start-hero" />
        <h1 className="start-title" onClick={tapTitle}>
          {t('start.title')}
        </h1>
        <div className="start-intro">
          {tList('start.intro').map((line, i, all) => (
            <p key={i} className={i === all.length - 1 ? 'start-sign' : i === 0 ? 'start-hello' : ''}>
              {line}
            </p>
          ))}
        </div>
        <button type="button" className="btn btn-primary btn-xl" onClick={launch} disabled={go}>
          {t('start.cta')}
        </button>
        {achievements > 0 && (
          <button type="button" className="btn btn-ghost-light" onClick={onGallery}>
            ДОСТИЖЕНИЯ И СЕКРЕТЫ · {achievements}
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
                {BUTTONS.resetYes}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setConfirming(false)}>
                {BUTTONS.resetNo}
              </button>
            </div>
          </div>
        )}
      </div>
      {go && (
        <div className="go-pop" aria-hidden>
          <span className="go-rays" />
          <span className="go-text">Эээээрл!</span>
        </div>
      )}
      {egg && (
        <button type="button" className="egg-overlay" onClick={() => setEgg(false)}>
          <img src={`${import.meta.env.BASE_URL}assets/easter/frog.jpg`} alt="" className="egg-img" />
          <span className="mono egg-text">version 30.0 (build by Маша)</span>
        </button>
      )}
    </div>
  );
}
