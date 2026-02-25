import { render, screen, fireEvent, act } from '@testing-library/react';
import PanicOverlay from './PanicOverlay';

describe('PanicOverlay Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders crisis resources correctly', () => {
    render(<PanicOverlay onClose={mockOnClose} />);

    expect(screen.getByText('Crisis Resources')).toBeInTheDocument();
    expect(screen.getByText('988')).toBeInTheDocument();
    expect(screen.getByText('741741')).toBeInTheDocument();
    expect(screen.getByText('911')).toBeInTheDocument();
  });

  it('focuses the return button on mount', () => {
    render(<PanicOverlay onClose={mockOnClose} />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const button = screen.getByRole('button', { name: /return to terminal/i });
    expect(button).toHaveFocus();
  });

  it('calls onClose when clicking the return button', () => {
    render(<PanicOverlay onClose={mockOnClose} />);

    const button = screen.getByRole('button', { name: /return to terminal/i });
    fireEvent.click(button);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when pressing Escape', () => {
    render(<PanicOverlay onClose={mockOnClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus when pressing Tab', () => {
    render(<PanicOverlay onClose={mockOnClose} />);

    const button = screen.getByRole('button', { name: /return to terminal/i });

    // Simulate Tab press
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    const focusSpy = jest.spyOn(button, 'focus');

    // Manually dispatch since fireEvent doesn't support spy easily on preventDefault for synthetic events in this context sometimes
    // But testing library fireEvent is easier.

    fireEvent.keyDown(document, { key: 'Tab' });

    // The component attaches listener to document.
    // If we verify that focus is called on the button again.

    expect(button).toHaveFocus();
    // Since we are mocking focus implementation in JSDOM sometimes, let's just check if our logic ran.
    // The component calls buttonRef.current?.focus() on Tab.
  });
});
