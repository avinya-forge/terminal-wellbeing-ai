import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  });

  it('renders the terminal with welcome messages', () => {
    render(<Terminal />);
    
    // Check for terminal elements
    expect(screen.getByText(/WellBeing\.sh/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type your message/i)).toBeInTheDocument();
    
    // Check for welcome messages
    expect(screen.getByText(/Welcome to WellBeing\.sh/i)).toBeInTheDocument();
    expect(screen.getByText(/I'm here to listen/i)).toBeInTheDocument();
  });

  it('initializes the AI model on mount', async () => {
    render(<Terminal />);
    
    await waitFor(() => {
      expect(aiModel.initializeModel).toHaveBeenCalledTimes(1);
    });
  });

  it('processes user input and displays responses', async () => {
    const user = userEvent.setup();
    render(<Terminal />);
    
    // Type and submit a message
    const inputElement = screen.getByPlaceholderText(/Type your message/i);
    await user.type(inputElement, 'Hello there');
    await user.keyboard('{Enter}');
    
    // Check if user message is displayed
    expect(screen.getByText('Hello there')).toBeInTheDocument();
    
    // Check if command processing was called
    expect(commands.processCommand).toHaveBeenCalledWith('Hello there', expect.any(Array));
    
    // Check if bot response is displayed
    await waitFor(() => {
      expect(screen.getByText('Command processed')).toBeInTheDocument();
    });
  });

  it('handles the clear command correctly', async () => {
    const user = userEvent.setup();
    render(<Terminal />);
    
    // Type and submit a message first
    const inputElement = screen.getByPlaceholderText(/Type your message/i);
    await user.type(inputElement, 'Hello there');
    await user.keyboard('{Enter}');
    
    // Verify message is displayed
    expect(screen.getByText('Hello there')).toBeInTheDocument();
    
    // Clear the conversation
    await user.clear(inputElement);
    await user.type(inputElement, '/clear');
    await user.keyboard('{Enter}');
    
    // Check that the original message is no longer displayed
    await waitFor(() => {
      expect(screen.queryByText('Hello there')).not.toBeInTheDocument();
    });
    
    // Check that welcome messages are displayed again
    expect(screen.getByText(/Welcome to WellBeing\.sh/i)).toBeInTheDocument();
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
    const user = userEvent.setup();
    render(<Terminal />);
    
    // Mock a delayed response
    (commands.processCommand as jest.Mock).mockImplementationOnce(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve('Delayed response'), 100);
      });
    });
    
    // Type and submit a message
    const inputElement = screen.getByPlaceholderText(/Type your message/i);
    await user.type(inputElement, 'Hello');
    await user.keyboard('{Enter}');
    
    // Input should be disabled while processing
    expect(inputElement).toBeDisabled();
    
    // After response, input should be enabled again
    await waitFor(() => {
      expect(screen.getByText('Delayed response')).toBeInTheDocument();
      expect(inputElement).not.toBeDisabled();
    });
  });
});
