import { Message } from '../types/Message';
import TerminalMessage from './TerminalMessage';
import TypingIndicator from './TypingIndicator';

interface TerminalOutputProps {
  messages: Message[];
  isTyping: boolean;
}

const TerminalOutput = ({ messages, isTyping }: TerminalOutputProps) => {
  return (
    <div role="log" aria-live="polite">
      {messages.map((message) => (
        <TerminalMessage key={message.id} message={message} />
      ))}
      
      {isTyping && <TypingIndicator />}
    </div>
  );
};

export default TerminalOutput;
