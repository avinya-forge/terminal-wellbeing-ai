import { memo } from 'react';
import { Message } from '../types/Message';
import TerminalMessage from './TerminalMessage';

interface TerminalOutputProps {
  messages: Message[];
  isTyping: boolean;
}

const TerminalOutput = memo(({ messages, isTyping }: TerminalOutputProps) => {
  return (
    <div role="log" aria-live="polite">
      {messages.map((message) => (
        <TerminalMessage key={message.id} message={message} />
      ))}
      
      {isTyping && (
        <div className="typing-indicator" aria-label="Thinking...">
          <span className="message-prompt bot-prompt" aria-hidden="true">{'>'}</span> Thinking
          <span className="typing-dots" aria-hidden="true">...</span>
        </div>
      )}
    </div>
  );
});

TerminalOutput.displayName = 'TerminalOutput';

export default TerminalOutput;
