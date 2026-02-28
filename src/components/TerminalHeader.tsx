import { memo } from 'react';
import { Terminal as TerminalIcon, ShieldCheck } from 'lucide-react';

interface TerminalHeaderProps {
  modelLoaded?: boolean;
  loadingStatus?: string;
  privacyMode?: boolean;
}

const TerminalHeader = memo(({ modelLoaded = false, loadingStatus, privacyMode = false }: TerminalHeaderProps) => {
  // If loaded, show Online. If not loaded, show the status or default to "Service Status: Loading..."
  const statusText = modelLoaded ? 'Service Status: Connected' : (loadingStatus || 'Service Status: Loading...');

  return (
    <header
      className="flex-shrink-0 flex items-center justify-between px-5 py-2 border-b"
      style={{ borderColor: 'hsl(var(--primary)/0.4)', background: 'hsl(230 10% 9%)' }}
    >
      {/* Left — title */}
      <div className="flex items-center gap-2">
        <TerminalIcon size={14} style={{ color: 'hsl(var(--primary))' }} aria-hidden="true" />
        <h1 className="text-sm font-bold tracking-widest" style={{ color: 'hsl(var(--primary))', margin: 0 }}>
          WellBeing.sh
        </h1>
        {privacyMode && (
          <span
            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded"
            style={{
              background: 'rgba(124,58,237,0.2)',
              color: '#c4b5fd',
              border: '1px solid rgba(124,58,237,0.3)',
            }}
            role="status"
            aria-live="polite"
          >
            <ShieldCheck size={10} aria-hidden="true" />
            PRIVACY MODE
          </span>
        )}
      </div>

      {/* Right — status + heartbeat dot + macOS traffic lights */}
      <div className="flex items-center gap-4">

        {/* Online status with heartbeat */}
        <div className="flex items-center gap-2" role="status" aria-live="polite">
          {/* Heartbeat / pulse dot */}
          <span
            className="relative flex"
            aria-hidden="true"
            title={modelLoaded ? 'Service Status: Connected' : 'Service Status: Loading...'}
          >
            {/* Outer ping ring — only when online */}
            {modelLoaded && (
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{
                  background: 'hsl(var(--primary))',
                  animation: 'heartbeat-ring 2s ease-in-out infinite',
                }}
              />
            )}
            {/* Inner solid dot */}
            <span
              className="relative inline-flex rounded-full"
              style={{
                width: '8px',
                height: '8px',
                background: modelLoaded ? 'hsl(var(--primary))' : 'hsl(var(--warning))',
                boxShadow: modelLoaded ? '0 0 6px hsl(var(--primary)/0.8)' : 'none',
                transition: 'background 0.5s ease, box-shadow 0.5s ease',
              }}
            />
          </span>
          <span
            className="text-xs font-mono"
            style={{
              color: modelLoaded ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
              textShadow: modelLoaded ? '0 0 8px hsl(var(--primary)/0.5)' : 'none',
              transition: 'color 0.5s ease',
            }}
          >
            {statusText}
          </span>
        </div>

        {/* macOS traffic lights */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--error)' }} title="Close" />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--warning)' }} title="Minimise" />
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: 'var(--success)', opacity: modelLoaded ? 1 : 0.35 }}
            title="Maximise"
          />
        </div>
      </div>
    </header>
  );
});

TerminalHeader.displayName = 'TerminalHeader';
export default TerminalHeader;
