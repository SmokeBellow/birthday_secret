/** Small hand-drawn vector sprites (same sticker look: thick navy outline, flat colours) for assets whose raster art ships cut off. */
const INK = '#1f2433';

export function Duck({ dir = 'right', flap = true, className = '' }: { dir?: 'left' | 'right'; flap?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={`duck-svg ${className}`} style={{ transform: dir === 'left' ? 'scaleX(-1)' : undefined }} aria-hidden>
      <g stroke={INK} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M14 52c-4-6-2-14 4-18 2 8 8 12 16 12z" fill="#e8dcc4" />
        <ellipse cx="54" cy="56" rx="34" ry="22" fill="#f8f1e1" />
        <circle cx="88" cy="36" r="17" fill="#f8f1e1" />
        <path d="M102 34c9 0 14 3 14 6s-6 6-14 5z" fill="#f2a23a" />
        <path d="M44 52c-14-18-6-38 6-44 4 14 16 22 26 22 0 14-14 24-32 22z" className={flap ? 'duck-wing' : ''} fill="#b98a5a" style={{ transformOrigin: '52px 50px' }} />
      </g>
      <circle cx="91" cy="31" r="3.4" fill={INK} />
      <circle cx="92" cy="30" r="1.1" fill="#fff" />
      <path d="M82 52c4 4 10 4 14 0" fill="none" stroke="#f2a23a" strokeWidth="0" />
    </svg>
  );
}

export function Bread({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 90" className={`bread-svg ${className}`} aria-hidden>
      <g stroke={INK} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M24 30c-12-2-16-18-4-22 8-3 14 2 18 4 6-4 18-6 24 0 10 4 6 20-4 22 4 8 2 40-4 44-8 4-24 4-32 0-6-4-6-36-2-48z" fill="#d38a3c" />
        <path d="M30 36c-6-2-8-10-2-12 6-2 10 2 14 4 6-4 14-4 20 0 6 2 4 10-2 12 3 10 2 34-2 36-6 2-20 2-26 0-4-2-5-26-2-40z" fill="#f7dfa4" />
      </g>
      <path d="M44 48v6M56 44v6M50 58v6" stroke="#d9b56f" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
