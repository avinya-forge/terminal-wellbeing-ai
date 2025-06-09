import { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
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
