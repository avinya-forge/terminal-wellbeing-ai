import { forwardRef, useState, KeyboardEvent, memo } from 'react';

interface TerminalInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ onSendMessage, disabled = false }, ref) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !disabled && input.trim()) {
        onSendMessage(input);
        setInput('');
      }
    };

    return (
      <div
        className="flex-shrink-0 flex items-center gap-2 px-4 py-3 border-t"
        style={{
          borderColor: 'hsl(var(--primary)/0.5)',
          background: 'hsl(var(--background))',
        }}
      >
        {/* Prompt glyph */}
        <span
          className="font-bold select-none flex-shrink-0"
          style={{
            color: 'hsl(var(--primary))',
            textShadow: '0 0 6px hsl(var(--primary)/0.7)',
            fontSize: '14px',
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          {'>'}
        </span>

        {/* Input + blinking cursor */}
        <div className="flex-1 flex items-center min-w-0 relative">
          <input
            ref={ref}
            id="terminal-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none"
            style={{
              color: 'hsl(var(--foreground))',
              caretColor: 'hsl(var(--primary))',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit',
              letterSpacing: '0.04em',
            }}
            placeholder={disabled ? 'Processing...' : 'Type a message or /help…'}
            disabled={disabled}
            aria-label="Terminal input"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    );
  }
);

TerminalInput.displayName = 'TerminalInput';
export default memo(TerminalInput);
