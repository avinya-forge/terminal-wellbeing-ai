import { render, screen } from '@testing-library/react';
import TerminalHeader from './TerminalHeader';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import TerminalMessage from './TerminalMessage';
import { Message } from '../types/Message';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('Terminal Accessibility', () => {
  describe('TerminalHeader', () => {
    it('uses a semantic header element', () => {
      render(<TerminalHeader modelLoaded={true} />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header.tagName).toBe('HEADER');
    });

    it('has accessible status indicator for model state', () => {
      render(<TerminalHeader modelLoaded={true} />);
      // The meaningful status indicator (3rd dot) has an aria-label describing model state
      // The decorative red/yellow dots are aria-hidden
      const indicator = screen.getByLabelText(/AI Model: Ready/i);
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('TerminalOutput', () => {
    it('has a live region for messages', () => {
      const messages: Message[] = [
        { id: '1', content: 'Hello', sender: 'user', timestamp: '2023-01-01T00:00:00Z' }
      ];
      render(<TerminalOutput messages={messages} isTyping={false} />);

      const liveRegion = screen.getByRole('log');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('TerminalMessage', () => {
    it('provides screen reader only text and hides animated text', async () => {
      const message: Message = {
        id: '1',
        content: 'Hello World',
        sender: 'bot',
        timestamp: '2023-01-01T00:00:00Z'
      };

      const { container } = render(<TerminalMessage message={message} />);

      // Check for sr-only span
      const srOnlySpan = container.querySelector('.sr-only');
      expect(srOnlySpan).toBeInTheDocument();
      expect(srOnlySpan?.textContent).toMatch(/System:.*Hello World/);

      // Check for aria-hidden on the visual part (it's a div, unlike prompts which are spans)
      const visualContent = container.querySelector('div[aria-hidden="true"]');
      expect(visualContent).toBeInTheDocument();
    });
  });

  describe('TerminalInput', () => {
    it('has an accessible label', () => {
      const mockFn = jest.fn();
      render(<TerminalInput onSendMessage={mockFn} />);

      const input = screen.getByLabelText('Terminal Command Input');
      expect(input).toBeInTheDocument();
    });
  });
});
