import { useState, useEffect, memo } from 'react';
import { Message } from '../types/Message';

interface TerminalMessageProps {
  message: Message;
}

const TerminalMessage = memo(({ message }: TerminalMessageProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  // Typewriter effect for bot messages
  useEffect(() => {
    if (message.sender === 'user') {
      setDisplayText(message.content);
      setIsComplete(true);
      return;
    }

    // Skip typewriter effect if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(message.content);
      setIsComplete(true);
      return;
    }
    
    let index = 0;
    const content = message.content;
    const timer = setInterval(() => {
      setDisplayText(content.substring(0, index));
      index++;
      
      if (index > content.length) {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, 15); // Speed of typing
    
    return () => clearInterval(timer);
  }, [message.content, message.sender]);

  return (
    <div className={`flex mb-2 ${message.sender === 'bot' ? 'text-primary mb-3' : 'text-foreground mb-3'}`}>
      <span className={`mr-2 font-bold shadow-[0_0_5px_hsl(var(--primary)/0.5)] ${message.sender === 'bot' ? 'text-primary' : 'text-foreground'}`} aria-hidden="true">
        {message.sender === 'bot' ? '$' : '>'}
      </span>

      {/* Screen Reader Only Content - Full text immediately available */}
      <span className="sr-only">
        {message.sender === 'bot' ? 'System: ' : 'You: '}
        {message.content}
      </span>

      {/* Visual Content - Typewriter effect, hidden from screen readers to avoid reading character by character */}
      <div className="break-words whitespace-pre-wrap tracking-wider shadow-[0_0_5px_hsl(var(--primary)/0.5)]" aria-hidden="true">
        {displayText}
        {!isComplete && message.sender === 'bot' && (
          <span className="inline-block w-2 h-4 bg-foreground ml-[2px] animate-[blink_0.8s_step-end_infinite] shadow-[0_0_5px_hsl(var(--primary)/0.5)] opacity-80">|</span>
        )}
      </div>
    </div>
  );
});

TerminalMessage.displayName = 'TerminalMessage';

export default TerminalMessage;
