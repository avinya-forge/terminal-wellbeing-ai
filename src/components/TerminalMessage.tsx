import { useState, useEffect } from 'react';
import { Message } from './Terminal';

interface TerminalMessageProps {
  message: Message;
}

const TerminalMessage = ({ message }: TerminalMessageProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  // Typewriter effect for bot messages
  useEffect(() => {
    if (message.sender === 'user') {
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
    <div className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
      <span className={`message-prompt ${message.sender === 'bot' ? 'bot-prompt' : 'user-prompt'}`}>
        {message.sender === 'bot' ? '$' : '>'}
      </span>
      <div className="message-content">
        {displayText}
        {!isComplete && message.sender === 'bot' && (
          <span className="cursor">|</span>
        )}
      </div>
    </div>
  );
};

export default TerminalMessage;
