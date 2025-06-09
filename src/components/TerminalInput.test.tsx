import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    const user = userEvent.setup();
    render(<TerminalInput onSendMessage={mockSendMessage} />);
    
    const inputElement = screen.getByPlaceholderText(/Type your message/i);
    
    // Type in the input
    await user.type(inputElement, 'Hello');
    expect(inputElement).toHaveValue('Hello');
    
    // Press Enter to send
    await user.keyboard('{Enter}');
    
    // Check if onSendMessage was called with the correct value
    expect(mockSendMessage).toHaveBeenCalledWith('Hello');
    
    // Check if input was cleared
    expect(inputElement).toHaveValue('');
  });

  it('does not send empty messages', async () => {
    const user = userEvent.setup();
    render(<TerminalInput onSendMessage={mockSendMessage} />);
    
    const inputElement = screen.getByPlaceholderText(/Type your message/i);
    
    // Press Enter without typing anything
    await user.keyboard('{Enter}');
    
    // Check that onSendMessage was not called
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    render(<TerminalInput onSendMessage={mockSendMessage} disabled={true} />);
    
    const inputElement = screen.getByPlaceholderText(/Type your message/i);
    expect(inputElement).toBeDisabled();
  });

  it('does not send message when disabled', async () => {
    const user = userEvent.setup();
    render(<TerminalInput onSendMessage={mockSendMessage} disabled={true} />);
    
    const inputElement = screen.getByPlaceholderText(/Type your message/i);
    
    // Try to type (should be prevented by disabled state)
    await user.type(inputElement, 'Hello');
    
    // Try to press Enter
    await user.keyboard('{Enter}');
    
    // Check that onSendMessage was not called
    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});
