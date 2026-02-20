import { memo } from 'react';
import { Terminal as TerminalIcon, ShieldCheck } from 'lucide-react';

interface TerminalHeaderProps {
  modelLoaded?: boolean;
  loadingStatus?: string;
  privacyMode?: boolean;
}

const TerminalHeader = memo(({ modelLoaded = false, loadingStatus, privacyMode = false }: TerminalHeaderProps) => {
  return (
    <header className="terminal-header" role="banner">
      <div className="terminal-title">
        <TerminalIcon size={18} />
        <span>WellBeing.sh</span>
        {privacyMode && (
          <span className="privacy-badge flex items-center gap-1 ml-4 text-xs bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded border border-purple-500/30">
            <ShieldCheck size={12} />
            PRIVACY MODE
          </span>
        )}
      </div>
      <div className="terminal-status">
        <span>
          {modelLoaded
            ? 'AI Model: Ready'
            : (loadingStatus || 'AI Model: Using fallback responses')}
        </span>
        <span
          className="status-indicator status-red"
          aria-label="Status: Offline"
          title="Status: Offline"
        ></span>
        <span
          className="status-indicator status-yellow"
          aria-label="Status: Connecting"
          title="Status: Connecting"
        ></span>
        <span
          className={`status-indicator ${modelLoaded ? 'status-green' : 'status-yellow'}`}
          aria-label={modelLoaded ? "Status: Ready" : "Status: Loading"}
          title={modelLoaded ? "Status: Ready" : "Status: Loading"}
        ></span>
      </div>
    </header>
  );
});

TerminalHeader.displayName = 'TerminalHeader';

export default TerminalHeader;
