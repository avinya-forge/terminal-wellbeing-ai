import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalHeaderProps {
  modelLoaded?: boolean;
}

const TerminalHeader = ({ modelLoaded = false }: TerminalHeaderProps) => {
  return (
    <div className="terminal-header">
      <div className="terminal-title">
        <TerminalIcon size={18} />
        <span>WellBeing.sh</span>
      </div>
      <div className="terminal-status">
        <span>
          {modelLoaded ? 'AI Model: Ready' : 'AI Model: Using fallback responses'}
        </span>
        <span className="status-indicator status-red"></span>
        <span className="status-indicator status-yellow"></span>
        <span className={`status-indicator ${modelLoaded ? 'status-green' : 'status-yellow'}`}></span>
      </div>
    </div>
  );
};

export default TerminalHeader;
