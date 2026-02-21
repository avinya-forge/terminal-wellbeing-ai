import { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import ReloadPrompt from './components/ReloadPrompt';
import './styles.css';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading to ensure all resources are ready
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <a href="#terminal-input" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-background focus:text-foreground focus:p-4 focus:outline-none">
        Skip to terminal input
      </a>
      <ReloadPrompt />
      {isLoaded ? (
        <Terminal />
      ) : (
        <div className="loading-screen">
          <div className="loading-text">Loading WellBeing.sh...</div>
        </div>
      )}
    </div>
  );
}

export default App;
