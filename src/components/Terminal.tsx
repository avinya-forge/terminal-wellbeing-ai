import { useState, useEffect, useRef, useCallback } from 'react';
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
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { logger } from '../services/LoggerService';

const Terminal = () => {
  const [messages, setMessages] = useLocalStorage<Message[]>('terminal_messages', getInitialMessages());
  const [isTyping, setIsTyping] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState("Service Status: Initializing...");
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState(getPrivacyMode());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ref to keep track of messages without triggering re-renders in callbacks
  const messagesRef = useRef(messages);

  // Sync messagesRef with messages state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Initialize AI model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        const success = await initializeModel((status) => {
          setLoadingStatus(status);
        });
        setModelLoaded(success);
        if (!success) {
          setLoadingStatus("Service Status: Using fallback responses");
        }
      } catch (error) {
        logger.error('Failed to initialize model:', error);
        setLoadingStatus("Service Status: Error");
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, []);

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    messagesEndRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input field when component mounts or when panic mode is closed
  useEffect(() => {
    if (!isLoading && !isPanicMode) {
      inputRef.current?.focus();
    }
  }, [isLoading, isPanicMode]);

  // Handle sending a new message
  const handleSendMessage = useCallback(async (content: string) => {
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
      // Use ref to access latest messages without adding to dependency array
      const response = await processCommand(content, messagesRef.current);

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
  }, [isPrivacyMode, setMessages]);

  // Keyboard shortcuts integration
  useKeyboardShortcuts({
    onClear: () => setMessages(getInitialMessages()),
    onFocus: () => inputRef.current?.focus(),
    onPanic: () => setIsPanicMode(true),
    onProfile: () => handleSendMessage('/profile view')
  });

  return (
    /* ── Full-screen terminal — fills the entire flex column from #root → App ── */
    <main
      aria-label="Terminal"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: 0,
        background: 'hsl(var(--card))',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isPanicMode && <PanicOverlay onClose={() => setIsPanicMode(false)} />}

      {/* Header */}
      <TerminalHeader modelLoaded={modelLoaded} loadingStatus={loadingStatus} privacyMode={isPrivacyMode} />

      {/* Scrollable message body — takes all remaining height */}
      <div
        className="scanlines"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem 2rem',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <TerminalOutput messages={messages} isTyping={isTyping} onScrollToBottom={scrollToBottom} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar — always at bottom */}
      <TerminalInput
        ref={inputRef}
        onSendMessage={handleSendMessage}
        disabled={isTyping || isLoading || isPanicMode}
        history={messages.filter(m => m.sender === 'user').map(m => m.content)}
      />
    </main>
  );
};

export default Terminal;
