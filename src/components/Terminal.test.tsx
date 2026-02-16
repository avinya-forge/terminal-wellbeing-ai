import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Terminal from './Terminal';
import * as aiModel from '../utils/aiModel';
import * as commands from '../utils/commands';

// Mock the AI model and commands modules
jest.mock('../utils/aiModel', () => ({
  initializeModel: jest.fn().mockResolvedValue(true),
  generateResponse: jest.fn().mockResolvedValue('This is a test response')
}));

jest.mock('../utils/commands', () => ({
  processCommand: jest.fn().mockImplementation(async (input) => {
    if (input.toLowerCase().includes('help')) {
      return 'Help information';
    }
    if (input.toLowerCase().includes('resources')) {
      return 'Resources information';
    }
    return 'Command processed';
  }),
  formatTimestamp: jest.fn().mockReturnValue('12:34')
}));

describe('Terminal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('renders the terminal with welcome messages', async () => {
    render(<Terminal />);
    
    // Check for terminal elements
    expect(screen.getByText(/WellBeing\.sh/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type your message/i)).toBeInTheDocument();
    
    // Check for welcome messages
    expect(await screen.findByText(/Welcome to WellBeing\.sh/i)).toBeInTheDocument();
    expect(await screen.findByText(/I'm here to listen/i)).toBeInTheDocument();
  });

  it('initializes the AI model on mount', async () => {
    render(<Terminal />);
    
    await waitFor(() => {
      expect(aiModel.initializeModel).toHaveBeenCalledTimes(1);
    });
  });

  it('processes user input and displays responses', async () => {
    render(<Terminal />);
    
    // Wait for initialization
    const inputElement = screen.getByPlaceholderText(/Type your message/i);
    await waitFor(() => expect(inputElement).not.toBeDisabled());

    // Type and submit a message
    fireEvent.change(inputElement, { target: { value: 'Hello there' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    // Check if user message is displayed
    expect(await screen.findByText('Hello there')).toBeInTheDocument();
    
    // Check if command processing was called
    await waitFor(() => {
      expect(commands.processCommand).toHaveBeenCalledWith('Hello there', expect.any(Array));
    });
    
    // Check if bot response is displayed
    await waitFor(() => {
      expect(screen.getByText('Command processed')).toBeInTheDocument();
    });
  });

  it('handles the clear command correctly', async () => {
    render(<Terminal />);
    
    // Wait for initialization
    const inputElement = screen.getByPlaceholderText(/Type your message/i);
    await waitFor(() => expect(inputElement).not.toBeDisabled());

    // Type and submit a message first
    fireEvent.change(inputElement, { target: { value: 'Hello there' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    // Verify message is displayed
    expect(await screen.findByText('Hello there')).toBeInTheDocument();
    
    // Clear the conversation
    fireEvent.change(inputElement, { target: { value: '/clear' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    // Check that the original message is no longer displayed
    await waitFor(() => {
      expect(screen.queryByText('Hello there')).not.toBeInTheDocument();
    });
    
    // Check that welcome messages are displayed again
    expect(await screen.findByText(/Welcome to WellBeing\.sh/i)).toBeInTheDocument();
  });

  it('handles model loading error gracefully', async () => {
    // Mock a failure in model initialization
    (aiModel.initializeModel as jest.Mock).mockResolvedValueOnce(false);
    
    render(<Terminal />);
    
    // Check that the terminal still renders
    expect(screen.getByText(/WellBeing\.sh/i)).toBeInTheDocument();
    
    // Check that the model status shows it's using fallback
    await waitFor(() => {
      expect(screen.getByText(/Using fallback responses/i)).toBeInTheDocument();
    });
  });

  it('disables input while processing a message', async () => {
    render(<Terminal />);
    
    // Mock a delayed response
    (commands.processCommand as jest.Mock).mockImplementationOnce(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve('Delayed response'), 100);
      });
    });
    
    // Wait for initialization
    const inputElement = screen.getByPlaceholderText(/Type your message/i);
    await waitFor(() => expect(inputElement).not.toBeDisabled());

    // Type and submit a message
    fireEvent.change(inputElement, { target: { value: 'Hello' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    // Input should be disabled while processing
    await waitFor(() => {
      expect(inputElement).toBeDisabled();
    });
    
    // After response, input should be enabled again
    await waitFor(() => {
      expect(screen.getByText('Delayed response')).toBeInTheDocument();
      expect(inputElement).not.toBeDisabled();
    });
  });
});
