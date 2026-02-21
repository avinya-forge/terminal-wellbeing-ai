import { useState, useEffect, useRef } from 'react';
import TerminalHeader from './TerminalHeader';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import PanicOverlay from './PanicOverlay';
import { initializeModel } from '../services/ai';
import { processCommand } from '../commands';
import { getInitialMessages } from '../data/responses';
import { getPrivacyMode, setPrivacyMode } from '../utils/sessionManager';
import useLocalStorage from '../hooks/useLocalStorage';
import { Message } from '../types/Message';
import { applyTheme } from '../utils/themes';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { logger } from '../services/LoggerService';

const Terminal = () => {
  const [messages, setMessages] = useLocalStorage<Message[]>('terminal_messages', getInitialMessages());
  const [isTyping, setIsTyping] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState("Initializing...");
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState(getPrivacyMode());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize theme from local storage — themes are stored as plain strings
  useEffect(() => {
    const savedTheme = localStorage.getItem('terminal_theme');
    if (savedTheme && savedTheme.trim()) {
      try {
        // Handle legacy JSON-encoded values (e.g. '"modern"') for backward compat
        const themeName = savedTheme.startsWith('"')
          ? JSON.parse(savedTheme) as string
          : savedTheme;
        applyTheme(themeName);
      } catch {
        applyTheme('modern');
      }
    } else {
      applyTheme('modern');
    }
  }, []);

  // Initialize AI model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        const success = await initializeModel((status) => {
          setLoadingStatus(status);
        });
        setModelLoaded(success);
        if (!success) {
          setLoadingStatus("AI Model: Using fallback responses");
        }
      } catch (error) {
        logger.error('Failed to initialize model:', error);
        setLoadingStatus("Error initializing model");
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

  // Focus input field when component mounts or when panic mode is closed
  useEffect(() => {
    if (!isLoading && !isPanicMode) {
      inputRef.current?.focus();
    }
  }, [isLoading, isPanicMode]);

  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Check for panic command immediately
    const normalizedContent = content.trim().toLowerCase();
    if (normalizedContent === '/panic' || normalizedContent === 'panic') {
      setIsPanicMode(true);
      return;
    }

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Handle clear command directly for better UX
    if (normalizedContent === 'clear' || normalizedContent === '/clear') {
      setMessages(getInitialMessages());
      return;
    }

    // Handle privacy command
    if (normalizedContent === '/privacy') {
      const newState = !isPrivacyMode;
      await setPrivacyMode(newState);
      setIsPrivacyMode(newState);

      setMessages(prev => [...prev, userMessage]);
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: newState
            ? "🔒 Privacy Mode ENABLED. Your session data will not be saved to local storage."
            : "🔓 Privacy Mode DISABLED. Your session data will be saved locally.",
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, botMessage]);
      }, 300);
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
      logger.error('Error processing message:', error);

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

  // Keyboard shortcuts integration
  useKeyboardShortcuts({
    onClear: () => setMessages(getInitialMessages()),
    onFocus: () => inputRef.current?.focus(),
    onPanic: () => setIsPanicMode(true),
    // Simulate user typing /profile view
    onProfile: () => handleSendMessage('/profile view')
  });

  return (
    <div className="terminal-container relative">
      {isPanicMode && <PanicOverlay onClose={() => setIsPanicMode(false)} />}

      <TerminalHeader modelLoaded={modelLoaded} loadingStatus={loadingStatus} privacyMode={isPrivacyMode} />

      <div className="terminal-body">
        <TerminalOutput messages={messages} isTyping={isTyping} />
        <div ref={messagesEndRef} />
      </div>

      <TerminalInput
        ref={inputRef}
        onSendMessage={handleSendMessage}
        disabled={isTyping || isLoading || isPanicMode}
      />
    </div>
  );
};

export default Terminal;
