import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Terminal from './Terminal';
import * as sessionManager from '../utils/sessionManager';

// Mock dependencies
jest.mock('../utils/aiModel', () => ({
  initializeModel: jest.fn().mockResolvedValue(true),
}));

jest.mock('../utils/commands', () => ({
  processCommand: jest.fn().mockResolvedValue('Command processed'),
}));

jest.mock('../utils/sessionManager', () => ({
  getPrivacyMode: jest.fn(),
  setPrivacyMode: jest.fn(),
  updateSession: jest.fn(),
  startSession: jest.fn(),
  getProfileSummary: jest.fn().mockReturnValue('Summary'),
  resetSession: jest.fn(),
  clearProfile: jest.fn(),
  togglePrivacy: jest.fn(),
  exportSessionData: jest.fn()
}));

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('Terminal Privacy Mode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (sessionManager.getPrivacyMode as jest.Mock).mockReturnValue(false);
  });

  test('toggles privacy mode when /privacy is entered', async () => {
    render(<Terminal />);

    const input = screen.getByPlaceholderText(/Type your message/i);

    // Type /privacy
    fireEvent.change(input, { target: { value: '/privacy' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Expect setPrivacyMode to be called with true (toggled from false)
    await waitFor(() => {
        expect(sessionManager.setPrivacyMode).toHaveBeenCalledWith(true);
    });

    // Expect UI update (Privacy Mode indicator)
    // The indicator text is "PRIVACY MODE" in TerminalHeader
    expect(await screen.findByText('PRIVACY MODE')).toBeInTheDocument();

    // Expect confirmation message
    expect(await screen.findByText(/Privacy Mode ENABLED/i)).toBeInTheDocument();
  });

  test('toggles privacy mode off when /privacy is entered again', async () => {
    // Start with privacy mode ON
    (sessionManager.getPrivacyMode as jest.Mock).mockReturnValue(true);

    render(<Terminal />);

    // Verify indicator is initially present
    expect(screen.getByText('PRIVACY MODE')).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Type your message/i);

    // Type /privacy
    fireEvent.change(input, { target: { value: '/privacy' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Expect setPrivacyMode to be called with false (toggled from true)
    await waitFor(() => {
        expect(sessionManager.setPrivacyMode).toHaveBeenCalledWith(false);
    });

    // Expect confirmation message
    expect(await screen.findByText(/Privacy Mode DISABLED/i)).toBeInTheDocument();
  });
});
