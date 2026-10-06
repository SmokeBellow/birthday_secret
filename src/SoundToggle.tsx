import { useEffect, useState } from 'react';
import { isMuted, onMuteChange, setMuted, sfx } from './audio';

/** Small fixed speaker button: sound is on by default, the choice is remembered. */
export function SoundToggle() {
  const [muted, setM] = useState(isMuted());
  useEffect(() => {
    const off = onMuteChange(() => setM(isMuted()));
    return () => {
      off();
    };
  }, []);
  return (
    <button
      type="button"
      className="sound-toggle"
      aria-label={muted ? 'sound off' : 'sound on'}
      onClick={() => {
        setMuted(!muted);
        if (muted) sfx('ok');
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor" />
        {muted ? <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /> : <path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />}
      </svg>
    </button>
  );
}
