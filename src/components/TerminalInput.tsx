import { forwardRef, useState, KeyboardEvent, ClipboardEvent, memo } from 'react';

interface TerminalInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  history?: string[];
}

const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ onSendMessage, disabled = false, history = [] }, ref) => {
    const [input, setInput] = useState('');
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [tempInput, setTempInput] = useState('');

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      const flattened = text.replace(/[\r\n]+/g, ' ');

      const target = e.currentTarget;
      const start = target.selectionStart || 0;
      const end = target.selectionEnd || 0;

      const newValue = input.slice(0, start) + flattened + input.slice(end);
      setInput(newValue);

      // Restore cursor position after state update
      setTimeout(() => {
        if (target) {
          target.selectionStart = target.selectionEnd = start + flattened.length;
        }
      }, 0);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !disabled && input.trim()) {
        onSendMessage(input);
        setInput('');
        setHistoryIndex(-1);
        setTempInput('');
        return;
      }

      // History navigation
      if (e.key === 'ArrowUp' && history.length > 0) {
        e.preventDefault();

        if (historyIndex === -1) {
          // Start navigation: save current input
          setTempInput(input);
          const newIndex = 0;
          setHistoryIndex(newIndex);
          setInput(history[history.length - 1 - newIndex] || '');
        } else if (historyIndex < history.length - 1) {
          // Continue going back
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(history[history.length - 1 - newIndex] || '');
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex > -1) {
          e.preventDefault();
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);

          if (newIndex === -1) {
            setInput(tempInput);
          } else {
            setInput(history[history.length - 1 - newIndex] || '');
          }
        }
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
            onPaste={handlePaste}
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
