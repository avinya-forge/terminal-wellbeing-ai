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
      <div className="flex relative px-4 py-2 border-t border-primary bg-background">
        <span className="text-foreground mr-2 font-bold shadow-[0_0_5px_hsl(var(--primary)/0.5)]" aria-hidden="true">{'>'}</span>
        <input
          ref={ref}
          id="terminal-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none text-foreground font-inherit text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-[0_0_5px_hsl(var(--primary)/0.5)] caret-transparent"
          placeholder="Type your message or /help for commands..."
          disabled={disabled}
          aria-label="Terminal Command Input"
        />
        {!disabled && <span className="inline-block w-2 h-4 bg-foreground ml-[2px] animate-[blink_0.8s_step-end_infinite] shadow-[0_0_5px_hsl(var(--primary)/0.5)] opacity-80" aria-hidden="true">|</span>}
      </div>
    );
  }
);

TerminalInput.displayName = 'TerminalInput';

export default memo(TerminalInput);
