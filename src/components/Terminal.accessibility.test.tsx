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

    it('has accessible status indicators', () => {
      render(<TerminalHeader modelLoaded={true} />);
      // These should have aria-labels or be hidden if decorative, but status is important
      // We expect them to have some label describing their state
      const indicators = screen.getAllByLabelText(/Status:/i);
      expect(indicators.length).toBeGreaterThan(0);
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

      // Check for aria-hidden on the visual part
      const visualContent = container.querySelector('.message-content');
      expect(visualContent).toBeInTheDocument();
      expect(visualContent).toHaveAttribute('aria-hidden', 'true');
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
