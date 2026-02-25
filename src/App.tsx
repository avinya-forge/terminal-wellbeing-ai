import { useEffect } from 'react';
import Terminal from './components/Terminal';
import ReloadPrompt from './components/ReloadPrompt';
import { applyTheme } from './utils/themes';

function App() {
  // Initialize theme from local storage — themes are stored as plain strings
  useEffect(() => {
    const savedTheme = localStorage.getItem('terminal_theme');
    if (savedTheme && savedTheme.trim()) {
      try {
        // Handle legacy JSON-encoded values (e.g. '"modern"') for backward compat
        const themeName = savedTheme.startsWith('"')
          ? JSON.parse(savedTheme) as string
          : savedTheme;
        applyTheme(themeName);
      } catch {
        applyTheme('modern');
      }
    } else {
      applyTheme('modern');
    }
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
      <Terminal />
    </div>
  );
}

export default App;
