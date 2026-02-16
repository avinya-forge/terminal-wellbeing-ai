import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalHeaderProps {
  modelLoaded?: boolean;
}

const TerminalHeader = ({ modelLoaded = false }: TerminalHeaderProps) => {
  return (
    <header className="terminal-header" role="banner">
      <div className="terminal-title">
        <TerminalIcon size={18} />
        <span>WellBeing.sh</span>
      </div>
      <div className="terminal-status">
        <span>
          {modelLoaded ? 'AI Model: Ready' : 'AI Model: Using fallback responses'}
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
};

export default TerminalHeader;
