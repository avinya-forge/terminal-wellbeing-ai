import { render, screen, fireEvent } from '@testing-library/react';
import ReloadPrompt from './ReloadPrompt';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { logger } from '../services/LoggerService';

jest.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: jest.fn()
}));

jest.mock('../services/LoggerService', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('ReloadPrompt', () => {
  let mockSetOfflineReady: jest.Mock;
  let mockSetNeedRefresh: jest.Mock;
  let mockUpdateServiceWorker: jest.Mock;

  beforeEach(() => {
    mockSetOfflineReady = jest.fn();
    mockSetNeedRefresh = jest.fn();
    mockUpdateServiceWorker = jest.fn();

    (useRegisterSW as jest.Mock).mockReturnValue({
      offlineReady: [false, mockSetOfflineReady],
      needRefresh: [false, mockSetNeedRefresh],
      updateServiceWorker: mockUpdateServiceWorker,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when offlineReady and needRefresh are false', () => {
    const { container } = render(<ReloadPrompt />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders offline ready message and close button when offlineReady is true', () => {
    (useRegisterSW as jest.Mock).mockReturnValue({
      offlineReady: [true, mockSetOfflineReady],
      needRefresh: [false, mockSetNeedRefresh],
      updateServiceWorker: mockUpdateServiceWorker,
    });

    render(<ReloadPrompt />);
    expect(screen.getByText('App ready to work offline')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Reload' })).not.toBeInTheDocument();
  });

  it('renders refresh message and reload button when needRefresh is true', () => {
    (useRegisterSW as jest.Mock).mockReturnValue({
      offlineReady: [false, mockSetOfflineReady],
      needRefresh: [true, mockSetNeedRefresh],
      updateServiceWorker: mockUpdateServiceWorker,
    });

    render(<ReloadPrompt />);
    expect(screen.getByText(/New content available/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('calls close correctly on close button click', () => {
    (useRegisterSW as jest.Mock).mockReturnValue({
      offlineReady: [true, mockSetOfflineReady],
      needRefresh: [false, mockSetNeedRefresh],
      updateServiceWorker: mockUpdateServiceWorker,
    });

    render(<ReloadPrompt />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(mockSetOfflineReady).toHaveBeenCalledWith(false);
    expect(mockSetNeedRefresh).toHaveBeenCalledWith(false);
  });

  it('calls updateServiceWorker on reload button click', () => {
    (useRegisterSW as jest.Mock).mockReturnValue({
      offlineReady: [false, mockSetOfflineReady],
      needRefresh: [true, mockSetNeedRefresh],
      updateServiceWorker: mockUpdateServiceWorker,
    });

    render(<ReloadPrompt />);
    fireEvent.click(screen.getByRole('button', { name: 'Reload' }));

    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);
  });

  it('handles onRegistered callback', () => {
    render(<ReloadPrompt />);

    const callbacks = (useRegisterSW as jest.Mock).mock.calls[0][0];
    callbacks.onRegistered('test-worker');

    expect(logger.info).toHaveBeenCalledWith('SW Registered: test-worker');
  });

  it('handles onRegisterError callback', () => {
    render(<ReloadPrompt />);

    const callbacks = (useRegisterSW as jest.Mock).mock.calls[0][0];
    callbacks.onRegisterError('test-error');

    expect(logger.error).toHaveBeenCalledWith('SW registration error', 'test-error');
  });
});
