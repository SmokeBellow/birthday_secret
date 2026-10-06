import { useEffect } from 'react';
import { t, spec } from './data';
import { BOARDING_PASS as BP, CERTIFICATE } from './extraCopy';
import { HomeButton } from './LevelScreen';
import { Img } from './ui';

export type PostStep = 'summary' | 'calm' | 'bonus' | 'pass' | 'certificate' | 'accepted' | 'plus';
const STEP_OF: Record<string, PostStep[]> = {
  build_complete_summary: ['summary', 'calm'], // 'calm' is the quiet beat before the bonus mission cuts in
  bonus_mission_unlock: ['bonus'],
  boarding_pass_reveal: ['pass'],
  certificate_reveal: ['certificate'],
  mission_accepted: ['accepted'],
  level_30_plus: ['plus'],
};
export const POST_STEPS: PostStep[] = (spec.postGameFlow.sequence as string[]).flatMap((s) => STEP_OF[s] ?? []);

type Props = { step: PostStep; onStep: (s: PostStep) => void; onHome: () => void; onRestart: () => void };

export function PostGame({ step, onStep, onHome, onRestart }: Props) {
  const idx = POST_STEPS.indexOf(step);
  const next = () => onStep(POST_STEPS[Math.min(POST_STEPS.length - 1, idx + 1)]);
  const lines = ['storyComplete', 'statsSaved', 'achievementsComplete', 'characterUpdated'];

  // the calm beat ends by itself: the bonus mission arrives uninvited
  useEffect(() => {
    if (step !== 'calm') return;
    const id = window.setTimeout(() => {
      try {
        navigator.vibrate?.([70, 50, 70]);
      } catch {
        /* vibration is optional */
      }
      onStep('bonus');
    }, 2600);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className={`screen post-screen post-${step}`}>
      {step === 'bonus' && <div className="alert-flash" aria-hidden />}
      <div className="topbar">{step !== 'calm' && <HomeButton onHome={onHome} />}</div>
      <div className="post-card" key={step}>
        {step === 'summary' && (
          <>
            <Img k="build_complete_effect" className="post-fx pop" />
            <h1 className="post-title">{t('postgame.summary.title')}</h1>
            <ul className="post-lines">
              {lines.map((l, i) => (
                <li key={l} style={{ animationDelay: `${0.25 + i * 0.35}s` }}>
                  {t(`postgame.summary.${l}`)}
                </li>
              ))}
            </ul>
            <div className="post-cast">
              <Img k="hero_build_complete" className="post-hero" />
              <Img k="player2_final" className="post-p2" />
              <Img k="lapka_final" className="post-lapka" />
            </div>
          </>
        )}
        {step === 'calm' && (
          <>
            <Img k="hero_build_complete" className="post-hero calm-hero" />
            <p className="post-sub calm-text">{t('postgame.summary.storyComplete')}</p>
          </>
        )}
        {step === 'bonus' && (
          <>
            <div className="alert-ring" aria-hidden />
            <h1 className="post-title alert-title">{t('postgame.bonus.title')}</h1>
            <p className="post-sub alert-sub">{t('postgame.bonus.subtitle')}</p>
          </>
        )}
        {step === 'pass' && (
          <div className="pass" data-ui="boarding_pass">
            <div className="pass-head">
              <span className="mono">{BP.heading}</span>
              <span className="mono pass-en">{BP.headingEn}</span>
            </div>
            <div className="pass-body">
              <div className="pass-captain">
                <Img k="hero_aviation" className="pass-hero" />
                <div className="pass-bars" aria-hidden>
                  <i /><i /><i /><i />
                </div>
              </div>
              <div className="pass-fields">
                <div>
                  <div className="pass-label mono">{BP.nameLabel}</div>
                  <div className="pass-value pass-name">{BP.name}</div>
                </div>
                <div>
                  <div className="pass-label mono">{BP.roleLabel}</div>
                  <div className="pass-value">{BP.role}</div>
                </div>
                <div className="pass-row">
                  <div>
                    <div className="pass-label mono">{BP.aircraftLabel}</div>
                    <div className="pass-value">{BP.aircraft}</div>
                  </div>
                  <div>
                    <div className="pass-label mono">{BP.seatLabel}</div>
                    <div className="pass-value">{BP.seat}</div>
                  </div>
                </div>
                <div>
                  <div className="pass-label mono">{BP.flightLabel}</div>
                  <div className="pass-value pass-route">
                    {BP.from} <span>✈</span> {BP.to}
                  </div>
                </div>
              </div>
            </div>
            <div className="pass-stub">
              <div className="pass-barcode" aria-hidden />
              <div className="pass-stamp mono">{BP.stamp}</div>
            </div>
          </div>
        )}
        {step === 'certificate' && (
          <div className="cert" data-ui="certificate_boeing_737_simulator">
            <div className="cert-frame">
              <Img k="aircraft_cruise" className="cert-plane" />
              <div className="mono cert-heading">{CERTIFICATE.heading}</div>
              <div className="cert-service">{CERTIFICATE.service}</div>
              <div className="cert-terms">({CERTIFICATE.terms})</div>
              <div className="cert-name">{CERTIFICATE.recipient}</div>
              <p className="cert-wish">{CERTIFICATE.wish}</p>
              <div className="cert-rule" />
              <div className="mono cert-expires">
                {CERTIFICATE.expiresLabel} <b>{CERTIFICATE.expires}</b>
              </div>
              <div className="cert-how-title">{CERTIFICATE.howTitle}</div>
              <p className="cert-how">{CERTIFICATE.how}</p>
              <p className="cert-how">{CERTIFICATE.address}</p>
            </div>
          </div>
        )}
        {step === 'accepted' && (
          <>
            <Img k="touchdown_effect" className="post-fx pop" />
            <h1 className="post-title">{t('postgame.accepted.title')}</h1>
            <p className="post-sub">{t('postgame.accepted.subtitle')}</p>
            <p className="mono post-foot">{t('postgame.accepted.footer')}</p>
          </>
        )}
        {step === 'plus' && (
          <>
            <Img k="hero_build_complete" className="post-hero pop" />
            <h1 className="post-title post-plus">{t('postgame.level30plus')}</h1>
          </>
        )}
      </div>
      {step === 'calm' ? (
        <div className="calm-dots" aria-hidden>
          <i /><i /><i />
        </div>
      ) : step !== 'plus' ? (
        <button type="button" className="btn btn-primary btn-xl" onClick={next}>
          {t('common.continue')}
        </button>
      ) : (
        <div className="controls row">
          <button type="button" className="btn btn-ghost" onClick={onRestart}>
            ↻ 1
          </button>
          <button type="button" className="btn btn-primary" onClick={onHome}>
            ← В НАЧАЛО
          </button>
        </div>
      )}
    </div>
  );
}
