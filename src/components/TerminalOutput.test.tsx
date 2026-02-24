import { render, screen, act } from '@testing-library/react';
import TerminalOutput from './TerminalOutput';
import { Message } from '../types/Message';

// Mock TerminalMessage to expose animate/onComplete props and allow triggering onComplete
jest.mock('./TerminalMessage', () => {
  return {
    __esModule: true,
    default: ({ message, animate, onComplete }: { message: Message, animate: boolean, onComplete?: () => void }) => (
      <div data-testid="terminal-message">
        <span data-testid="message-content">{message.content}</span>
        <span data-testid="message-animate">{animate.toString()}</span>
        {onComplete && (
          <button data-testid="complete-btn" onClick={onComplete}>Complete</button>
        )}
      </div>
    )
  };
});

describe('TerminalOutput Component', () => {
  const bootMessages: Message[] = [
    {
      id: '1',
      content: 'Boot 1',
      sender: 'bot',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      content: 'Boot 2',
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ];

  it('renders boot messages sequentially', () => {
    render(<TerminalOutput messages={bootMessages} isTyping={false} />);
    
    // Initially, only the first message should be visible
    let messages = screen.getAllByTestId('terminal-message');
    expect(messages.length).toBe(1);
    expect(messages[0]).toHaveTextContent('Boot 1');
    expect(screen.getByTestId('message-animate')).toHaveTextContent('true');

    // Complete the first message
    act(() => {
      screen.getByTestId('complete-btn').click();
    });

    // Now second message should appear
    messages = screen.getAllByTestId('terminal-message');
    expect(messages.length).toBe(2);
    expect(messages[1]).toHaveTextContent('Boot 2');
    
    // First message should now have animate=false (snapped to full)
    // Second message should have animate=true
    const animateFlags = screen.getAllByTestId('message-animate');
    expect(animateFlags[0]).toHaveTextContent('false');
    expect(animateFlags[1]).toHaveTextContent('true');
  });

  it('calls onScrollToBottom when boot message completes', () => {
    const mockScroll = jest.fn();
    render(<TerminalOutput messages={bootMessages} isTyping={false} onScrollToBottom={mockScroll} />);

    // Complete first boot message
    act(() => {
      screen.getByTestId('complete-btn').click();
    });

    expect(mockScroll).toHaveBeenCalled();
  });

  it('renders non-boot messages normally after boot sequence and calls onScrollToBottom', () => {
    const mixedMessages: Message[] = [
      { id: '1', content: 'Boot 1', sender: 'bot', timestamp: '' },
      { id: 'msg1', content: 'User 1', sender: 'user', timestamp: '' }
    ];

    const mockScroll = jest.fn();
    render(<TerminalOutput messages={mixedMessages} isTyping={false} onScrollToBottom={mockScroll} />);

    // Complete boot message
    act(() => {
      screen.getByTestId('complete-btn').click();
    });
    
    // Expect scroll called for boot message completion
    expect(mockScroll).toHaveBeenCalledTimes(1);

    // Now user message appears. It should have onComplete wired to onScrollToBottom.
    const buttons = screen.getAllByTestId('complete-btn');
    // Index 0 is boot message (animate=false now, so maybe no button? No, mock renders button if onComplete passed).
    // Wait, for boot messages, onComplete is: bootIndex === revealCount ? handleComplete : undefined.
    // If bootIndex (0) !== revealCount (1), onComplete is undefined. So no button for msg 1.
    // Msg 2 is non-boot. onComplete is passed directly. So button exists.

    const userMsgButton = buttons[0]; // Should be the only one
    
    act(() => {
      userMsgButton.click();
    });

    expect(mockScroll).toHaveBeenCalledTimes(2);
  });
});
