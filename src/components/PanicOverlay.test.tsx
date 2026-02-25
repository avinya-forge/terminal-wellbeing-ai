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
});
