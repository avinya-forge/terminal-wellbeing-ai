import { memo } from 'react';
import { Terminal as TerminalIcon, ShieldCheck } from 'lucide-react';

interface TerminalHeaderProps {
  modelLoaded?: boolean;
  loadingStatus?: string;
  privacyMode?: boolean;
}

const TerminalHeader = memo(({ modelLoaded = false, loadingStatus, privacyMode = false }: TerminalHeaderProps) => {
  return (
    <header className="flex justify-between items-center px-4 py-2 bg-background text-primary border-b border-primary">
      <div className="flex items-center gap-2 font-bold">
        <TerminalIcon size={18} aria-hidden="true" />
        <h1 className="text-sm font-bold m-0">WellBeing.sh</h1>
        {privacyMode && (
          <span className="flex items-center gap-1 ml-4 text-xs bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded border border-purple-500/30" role="status" aria-live="polite">
            <ShieldCheck size={12} aria-hidden="true" />
            PRIVACY MODE
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs" role="status" aria-live="polite">
        <span className="text-xs opacity-70 mr-1">
          {modelLoaded
            ? 'AI: Ready'
            : (loadingStatus || 'AI: Loading...')}
        </span>
        {/* Traffic lights - decorative only (macOS style) */}
        <span className="w-2 h-2 rounded-full inline-block bg-[var(--error)]" aria-hidden="true" title="Close" />
        <span className="w-2 h-2 rounded-full inline-block bg-[var(--warning)]" aria-hidden="true" title="Minimize" />
        <span
          className={`w-2 h-2 rounded-full inline-block ${modelLoaded ? 'bg-[var(--success)]' : 'bg-[var(--warning)] animate-pulse'}`}
          role="img"
          aria-label={modelLoaded ? 'AI Model: Ready' : 'AI Model: Loading'}
          title={modelLoaded ? 'AI Model: Ready' : 'AI Model: Loading'}
        />
      </div>
    </header>
  );
});

TerminalHeader.displayName = 'TerminalHeader';

export default TerminalHeader;
