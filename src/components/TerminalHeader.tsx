import { Terminal as TerminalIcon, ShieldCheck } from 'lucide-react';

interface TerminalHeaderProps {
  modelLoaded?: boolean;
  loadingStatus?: string;
  privacyMode?: boolean;
}

const TerminalHeader = ({ modelLoaded = false, loadingStatus, privacyMode = false }: TerminalHeaderProps) => {
  return (
    <header className="terminal-header" role="banner">
      <div className="terminal-title">
        <TerminalIcon size={18} aria-hidden="true" />
        <span>WellBeing.sh</span>
        {privacyMode && (
          <span className="privacy-badge flex items-center gap-1 ml-4 text-xs bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded border border-purple-500/30" role="status" aria-live="polite">
            <ShieldCheck size={12} aria-hidden="true" />
            PRIVACY MODE
          </span>
        )}
      </div>
      <div className="terminal-status" role="status" aria-live="polite">
        <span className="text-xs opacity-70 mr-1">
          {modelLoaded
            ? 'AI: Ready'
            : (loadingStatus || 'AI: Loading...')}
        </span>
        {/* Traffic lights - decorative only (macOS style) */}
        <span className="status-indicator status-red" aria-hidden="true" title="Close" />
        <span className="status-indicator status-yellow" aria-hidden="true" title="Minimize" />
        <span
          className={`status-indicator ${modelLoaded ? 'status-green' : 'status-loading'}`}
          aria-label={modelLoaded ? 'AI Model: Ready' : 'AI Model: Loading'}
          title={modelLoaded ? 'AI Model: Ready' : 'AI Model: Loading'}
        />
      </div>
    </header>
  );
};

export default TerminalHeader;
