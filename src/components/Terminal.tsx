import { useState, useEffect, useRef } from 'react';
import TerminalHeader from './TerminalHeader';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import { initializeModel } from '../utils/aiModel';
import { processCommand } from '../utils/commands';
import { getInitialMessages } from '../data/responses';
import useLocalStorage from '../hooks/useLocalStorage';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const Terminal = () => {
  const [messages, setMessages] = useLocalStorage<Message[]>('terminal_messages', getInitialMessages() as unknown as Message[]);
  const [isTyping, setIsTyping] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize AI model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        const success = await initializeModel();
        setModelLoaded(success);
      } catch (error) {
        console.error('Failed to initialize model:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input field when component mounts
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Handle clear command directly for better UX
    if (content.trim().toLowerCase() === 'clear' || content.trim().toLowerCase() === '/clear') {
      setMessages(getInitialMessages() as unknown as Message[]);
      return;
    }

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Process the command or generate a response
      const response = await processCommand(content, messages);

      // Create bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };

      // Add bot message to chat
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="terminal-container">
      <TerminalHeader modelLoaded={modelLoaded} />
      
      <div className="terminal-body">
        <TerminalOutput messages={messages} isTyping={isTyping} />
        <div ref={messagesEndRef} />
      </div>
      
      <TerminalInput 
        ref={inputRef}
        onSendMessage={handleSendMessage} 
        disabled={isTyping || isLoading} 
      />
    </div>
  );
};

export default Terminal;
