import { createRoot } from 'react-dom/client';
import { GameApp } from './GameApp';
import { CrashGuard } from './CrashGuard';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <CrashGuard>
    <GameApp />
  </CrashGuard>,
);
