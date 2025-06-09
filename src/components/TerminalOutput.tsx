import { Message } from './Terminal';
import TerminalMessage from './TerminalMessage';

interface TerminalOutputProps {
  messages: Message[];
  isTyping: boolean;
}

const TerminalOutput = ({ messages, isTyping }: TerminalOutputProps) => {
  return (
    <div>
      {messages.map((message) => (
        <TerminalMessage key={message.id} message={message} />
      ))}
      
      {isTyping && (
        <div className="typing-indicator">
          <span className="message-prompt bot-prompt">{'>'}</span> Thinking
          <span className="typing-dots">...</span>
        </div>
      )}
    </div>
  );
};

export default TerminalOutput;
