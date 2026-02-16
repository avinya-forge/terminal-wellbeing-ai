import { render, screen, fireEvent } from '@testing-library/react';
import TerminalInput from './TerminalInput';

describe('TerminalInput Component', () => {
  const mockSendMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<TerminalInput onSendMessage={mockSendMessage} />);
    
    // Check for prompt
    expect(screen.getByText('>')).toBeInTheDocument();
    
    // Check for input field
    const inputElement = screen.getByPlaceholderText(/Type your message/i);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).not.toBeDisabled();
    
    // Check for cursor
    expect(screen.getByText('|')).toBeInTheDocument();
  });

  it('handles user input correctly', async () => {
    render(<TerminalInput onSendMessage={mockSendMessage} />);
    
    const inputElement = screen.getByPlaceholderText(/Type your message/i);
    
    // Type in the input
    fireEvent.change(inputElement, { target: { value: 'Hello' } });
    expect(inputElement).toHaveValue('Hello');
    
    // Press Enter to send
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    // Check if onSendMessage was called with the correct value
    expect(mockSendMessage).toHaveBeenCalledWith('Hello');
    
    // Check if input was cleared
    expect(inputElement).toHaveValue('');
  });

  it('does not send empty messages', async () => {
    render(<TerminalInput onSendMessage={mockSendMessage} />);
    
    const inputElement = screen.getByPlaceholderText(/Type your message/i);

    // Press Enter without typing anything
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    // Check that onSendMessage was not called
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    render(<TerminalInput onSendMessage={mockSendMessage} disabled={true} />);
    
    const inputElement = screen.getByPlaceholderText(/Type your message/i);
    expect(inputElement).toBeDisabled();
  });

  it('does not send message when disabled', async () => {
    render(<TerminalInput onSendMessage={mockSendMessage} disabled={true} />);
    
    const inputElement = screen.getByPlaceholderText(/Type your message/i);
    
    // Try to type (should be prevented by disabled state)
    // fireEvent.change mimics the event, but real input respects 'disabled'.
    // However, fireEvent bypasses browser checks, so it might fire onChange anyway?
    // Let's rely on disabled check logic inside component: !disabled && input.trim()
    fireEvent.change(inputElement, { target: { value: 'Hello' } });
    
    // Try to press Enter
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    // Check that onSendMessage was not called
    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});
