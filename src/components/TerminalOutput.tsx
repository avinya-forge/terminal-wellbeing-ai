import { memo, useState, useCallback } from 'react';
import { Message } from '../types/Message';
import TerminalMessage from './TerminalMessage';
import TypingIndicator from './TypingIndicator';

interface TerminalOutputProps {
  messages: Message[];
  isTyping: boolean;
}

/**
 * TerminalOutput — renders messages sequentially.
 *
 * Boot messages (those with numeric IDs "1", "2", …) animate one-at-a-time:
 * each message waits for the previous one to finish typing before appearing.
 *
 * Subsequent conversational messages animate immediately on arrival (the user
 * experience handles the sequencing naturally through request/response flow).
 */
const TerminalOutput = memo(({ messages, isTyping }: TerminalOutputProps) => {
  // `revealed` tracks how many boot messages have completed their animation.
  // Once all boot messages are done, all subsequent messages show normally.
  const [revealCount, setRevealCount] = useState(0);

  // Count how many messages look like "boot" messages (IDs "1", "2", …)
  const bootCount = messages.filter(m => /^\d+$/.test(m.id) && m.sender === 'bot').length;
  const bootComplete = revealCount >= bootCount;

  const handleComplete = useCallback(() => {
    setRevealCount(prev => prev + 1);
  }, []);

  return (
    <div role="list" aria-label="Conversation">
      {messages.map((message, i) => {
        const isBoot = /^\d+$/.test(message.id) && message.sender === 'bot';
        const bootIndex = isBoot ? parseInt(message.id, 10) - 1 : -1;

        // Boot messages: only render when the preceding one has finished
        if (isBoot) {
          if (bootIndex > revealCount) return null; // not revealed yet
          return (
            <TerminalMessage
              key={message.id}
              message={message}
              animate={bootIndex === revealCount - 1 || revealCount === 0}
              onComplete={bootIndex === revealCount ? handleComplete : undefined}
            />
          );
        }

        // Non-boot messages: show normally once boot sequence is done
        if (!bootComplete) return null;

        return (
          <TerminalMessage
            key={message.id}
            message={message}
            animate={i === messages.length - 1 && message.sender === 'bot'}
          />
        );
      })}

      {isTyping && <TypingIndicator />}
    </div>
  );
});

TerminalOutput.displayName = 'TerminalOutput';
export default TerminalOutput;
