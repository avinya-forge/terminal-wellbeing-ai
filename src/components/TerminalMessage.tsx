import { useState, useEffect, memo } from 'react';
import { Message } from '../types/Message';

interface TerminalMessageProps {
  message: Message;
  /** When true the typewriter runs; when false the full text is shown instantly */
  animate?: boolean;
  /** Called when the typewriter animation finishes */
  onComplete?: () => void;
}

const TYPING_SPEED_MS = 12; // ms per character

const TerminalMessage = memo(({ message, animate = true, onComplete }: TerminalMessageProps) => {
  const [displayText, setDisplayText] = useState('');
  const [done, setDone] = useState(false);

  const isBot = message.sender === 'bot';
  const shouldAnimate = animate && isBot && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // User messages and non-animated ones: show immediately
    if (!shouldAnimate) {
      setDisplayText(message.content);
      setDone(true);
      onComplete?.();
      return;
    }

    // Typewriter: character by character, left → right
    let idx = 0;
    setDisplayText('');
    setDone(false);

    const timer = setInterval(() => {
      idx++;
      setDisplayText(message.content.substring(0, idx));
      if (idx >= message.content.length) {
        clearInterval(timer);
        setDone(true);
        onComplete?.();
      }
    }, TYPING_SPEED_MS);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.id, shouldAnimate]);

  return (
    <div
      className="flex items-start gap-2 mb-2"
      style={{ minWidth: 0 }}
      role="listitem"
    >
      {/* Prompt glyph */}
      <span
        className="flex-shrink-0 font-bold select-none"
        style={{
          color: isBot ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
          textShadow: '0 0 6px hsl(var(--primary)/0.5)',
          width: '1ch',
          lineHeight: 'inherit',
        }}
        aria-hidden="true"
      >
        {isBot ? '$' : '>'}
      </span>

      {/* Accessible full text for screen readers */}
      <span className="sr-only">
        {isBot ? 'System: ' : 'You: '}
        {message.content}
      </span>

      {/* Visible typewriter text */}
      <div
        aria-hidden="true"
        style={{
          flex: 1,
          minWidth: 0,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          color: isBot ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
          textShadow: isBot ? '0 0 4px hsl(var(--primary)/0.3)' : 'none',
          letterSpacing: '0.03em',
          lineHeight: '1.6',
        }}
      >
        {displayText}
        {/* Blinking block cursor while typing */}
        {!done && isBot && (
          <span
            style={{
              display: 'inline-block',
              width: '0.5em',
              height: '1em',
              background: 'hsl(var(--primary)/0.8)',
              verticalAlign: 'text-bottom',
              marginLeft: '1px',
              animation: 'blink 0.8s step-end infinite',
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
});

TerminalMessage.displayName = 'TerminalMessage';
export default TerminalMessage;
