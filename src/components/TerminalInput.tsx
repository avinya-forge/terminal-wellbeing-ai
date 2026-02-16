import { forwardRef, useState, KeyboardEvent } from 'react';

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
      <div className="terminal-input-container">
        <span className="input-prompt" aria-hidden="true">{'>'}</span>
        <input
          ref={ref}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="terminal-input"
          placeholder="Type your message or /help for commands..."
          disabled={disabled}
          aria-label="Terminal Command Input"
        />
        {!disabled && <span className="cursor" aria-hidden="true">|</span>}
      </div>
    );
  }
);

TerminalInput.displayName = 'TerminalInput';

export default TerminalInput;
