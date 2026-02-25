import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PanicOverlay from './PanicOverlay';

describe('PanicOverlay', () => {
  it('renders crisis resources correctly', () => {
    render(<PanicOverlay onClose={() => {}} />);

    expect(screen.getByText('Crisis Resources')).toBeInTheDocument();
    expect(screen.getByText('988')).toBeInTheDocument();
    expect(screen.getByText('741741')).toBeInTheDocument();
    expect(screen.getByText('911')).toBeInTheDocument();
  });

  it('calls onClose when return button is clicked', () => {
    const handleClose = jest.fn();
    render(<PanicOverlay onClose={handleClose} />);

    const button = screen.getByText('RETURN TO TERMINAL');
    fireEvent.click(button);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = jest.fn();
    render(<PanicOverlay onClose={handleClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus (focuses button on mount)', async () => {
    const handleClose = jest.fn();
    render(<PanicOverlay onClose={handleClose} />);

    const button = screen.getByText('RETURN TO TERMINAL');
    // Wait for timeout used in component (50ms)
    await new Promise(r => setTimeout(r, 60));
    expect(button).toHaveFocus();
  });
});
