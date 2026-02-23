import { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import ReloadPrompt from './components/ReloadPrompt';

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    /* flex column fills #root which fills body */
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <a
        href="#terminal-input"
        style={{
          position: 'absolute',
          left: -9999,
        }}
        onFocus={e => { e.currentTarget.style.left = '0'; }}
        onBlur={e => { e.currentTarget.style.left = '-9999px'; }}
      >
        Skip to terminal input
      </a>
      <ReloadPrompt />
      {ready && <Terminal />}
    </div>
  );
}

export default App;
