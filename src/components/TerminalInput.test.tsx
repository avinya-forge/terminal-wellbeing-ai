import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TerminalInput from './TerminalInput';

describe('TerminalInput', () => {
  const mockSend = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders the prompt glyph ">"', () => {
    render(<TerminalInput onSendMessage={mockSend} />);
    expect(screen.getByText('>')).toBeInTheDocument();
  });

  it('renders the text input field', () => {
    render(<TerminalInput onSendMessage={mockSend} />);
    expect(screen.getByRole('textbox', { name: /terminal input/i })).toBeInTheDocument();
  });

  it('shows the correct placeholder when enabled', () => {
    render(<TerminalInput onSendMessage={mockSend} />);
    expect(screen.getByPlaceholderText(/type a message or \/help/i)).toBeInTheDocument();
  });

  it('shows "Processing..." placeholder when disabled', () => {
    render(<TerminalInput onSendMessage={mockSend} disabled={true} />);
    expect(screen.getByPlaceholderText(/processing/i)).toBeInTheDocument();
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it('disables the input field when disabled prop is true', () => {
    render(<TerminalInput onSendMessage={mockSend} disabled={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('hides the blinking block cursor when disabled', () => {
    const { container } = render(<TerminalInput onSendMessage={mockSend} disabled={true} />);
    // The blinking cursor span is only rendered when !disabled
    const cursorSpans = container.querySelectorAll('span[aria-hidden="true"]');
    // Only the prompt glyph is aria-hidden; the cursor span should not exist
    const cursorSpan = Array.from(cursorSpans).find(el =>
      el.getAttribute('style')?.includes('blink')
    );
    expect(cursorSpan).toBeUndefined();
  });

  // ── Input interaction ─────────────────────────────────────────────────────

  it('accepts typed input correctly', () => {
    render(<TerminalInput onSendMessage={mockSend} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input).toHaveValue('Hello');
  });

  it('sends message on Enter and clears input', () => {
    render(<TerminalInput onSendMessage={mockSend} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockSend).toHaveBeenCalledWith('Test message');
    expect(input).toHaveValue('');
  });

  it('sends message on Enter with leading/trailing spaces stripped via trim check', () => {
    render(<TerminalInput onSendMessage={mockSend} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '  hi  ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    // The component checks input.trim() before calling onSendMessage,
    // so the raw value (with spaces) should be passed — it's not trimmed by the component
    expect(mockSend).toHaveBeenCalledWith('  hi  ');
  });

  it('does not send on Enter if input is empty', () => {
    render(<TerminalInput onSendMessage={mockSend} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('does not send on Enter if input is whitespace-only', () => {
    render(<TerminalInput onSendMessage={mockSend} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('does not send on other key presses (e.g. Space)', () => {
    render(<TerminalInput onSendMessage={mockSend} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.keyDown(input, { key: ' ' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('does not send when disabled even if Enter is pressed', () => {
    render(<TerminalInput onSendMessage={mockSend} disabled={true} />);
    const input = screen.getByRole('textbox');
    // Note: fireEvent bypasses the disabled attribute — rely on component logic
    fireEvent.change(input, { target: { value: 'secret' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  // ── Accessibility ─────────────────────────────────────────────────────────

  it('has aria-label on the input field', () => {
    render(<TerminalInput onSendMessage={mockSend} />);
    expect(screen.getByLabelText(/terminal input/i)).toBeInTheDocument();
  });

  it('has autoComplete="off" to prevent browser suggestions', () => {
    render(<TerminalInput onSendMessage={mockSend} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('autoComplete', 'off');
  });

  it('has spellCheck={false}', () => {
    render(<TerminalInput onSendMessage={mockSend} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('spellcheck', 'false');
  });

  // ── Forwarded ref ─────────────────────────────────────────────────────────

  it('exposes the input element via forwardRef', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<TerminalInput onSendMessage={mockSend} ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
  });
});
