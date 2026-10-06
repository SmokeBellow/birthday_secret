import { t, spec } from './data';
import { CERTIFICATE } from './extraCopy';
import { HomeButton } from './LevelScreen';
import { Img } from './ui';

export type PostStep = 'summary' | 'bonus' | 'certificate' | 'accepted' | 'plus';
const ORDER = spec.postGameFlow.sequence as string[];
const STEP_OF: Record<string, PostStep> = {
  build_complete_summary: 'summary',
  bonus_mission_unlock: 'bonus',
  certificate_reveal: 'certificate',
  mission_accepted: 'accepted',
  level_30_plus: 'plus',
};
export const POST_STEPS = ORDER.map((s) => STEP_OF[s]);

type Props = { step: PostStep; onStep: (s: PostStep) => void; onHome: () => void; onRestart: () => void };

export function PostGame({ step, onStep, onHome, onRestart }: Props) {
  const idx = POST_STEPS.indexOf(step);
  const next = () => onStep(POST_STEPS[Math.min(POST_STEPS.length - 1, idx + 1)]);
  const lines = ['storyComplete', 'statsSaved', 'achievementsComplete', 'characterUpdated'];

  return (
    <div className={`screen post-screen post-${step}`}>
      <div className="topbar">
        <HomeButton onHome={onHome} />
      </div>
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
        {step === 'bonus' && (
          <>
            <Img k="item_boarding_pass" className="post-item pop" />
            <h1 className="post-title">{t('postgame.bonus.title')}</h1>
            <p className="post-sub">{t('postgame.bonus.subtitle')}</p>
          </>
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
      {step !== 'plus' ? (
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
