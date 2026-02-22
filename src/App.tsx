import { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import ReloadPrompt from './components/ReloadPrompt';
import { Skeleton } from './components/ui/Skeleton';
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
      <a href="#terminal-input" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-background focus:text-foreground focus:p-4 focus:outline-none focus:ring-2 focus:ring-accent">
        Skip to terminal input
      </a>
      <ReloadPrompt />
      {isLoaded ? (
        <Terminal />
      ) : (
        <div className="relative max-w-[800px] mx-auto my-8 border border-primary/30 rounded overflow-hidden h-[80vh] flex flex-col bg-background" aria-busy="true" aria-label="Loading application">
          <div className="bg-muted/50 px-4 py-2 border-b border-primary/30 flex items-center h-[45px] gap-2">
            <Skeleton className="h-4 w-24 bg-primary/20" />
            <div className="flex-1" />
            <Skeleton className="h-4 w-16 bg-primary/20" />
          </div>
          <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
            <Skeleton className="h-8 w-2/3 bg-primary/10" />
            <Skeleton className="h-16 w-1/2 bg-primary/10 delay-75" />
            <Skeleton className="h-8 w-1/3 bg-primary/10 delay-150" />
          </div>
          <div className="p-2 border-t border-primary/30 bg-background flex items-center gap-2 h-[50px] px-4">
            <span className="text-primary/50 font-bold" aria-hidden="true">{'>'}</span>
            <Skeleton className="h-6 flex-1 bg-primary/10" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
