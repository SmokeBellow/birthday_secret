import { Component, useEffect, useState, type ReactNode } from 'react';

/** If anything crashes or throws, show a calm screen instead of a blank page. Progress lives in localStorage, so it is not lost. */
function CrashScreen() {
  return (
    <div className="screen crash-screen" role="alert">
      <h1 className="level-title">Что-то зависло</h1>
      <p className="level-intro">Не переживай, прогресс сохранён. Нажми кнопку, и всё заработает снова.</p>
      <button type="button" className="btn btn-primary btn-xl" onClick={() => window.location.reload()}>
        ОТКРЫТЬ ЗАНОВО
      </button>
    </div>
  );
}

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.error('[crash]', err);
  }
  render() {
    return this.state.failed ? <CrashScreen /> : this.props.children;
  }
}

export function CrashGuard({ children }: { children: ReactNode }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    // errors thrown inside event handlers / timers never reach the React boundary
    const onError = (e: ErrorEvent) => {
      if (e.error) setFailed(true);
    };
    const onReject = () => setFailed(true);
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onReject);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onReject);
    };
  }, []);
  return failed ? <CrashScreen /> : <Boundary>{children}</Boundary>;
}
