import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from './input';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="test input" />);
    expect(screen.getByPlaceholderText('test input')).toBeInTheDocument();
  });
  it('applies custom classes', () => {
    render(<Input data-testid="input" className="custom-class" />);
    expect(screen.getByTestId('input')).toHaveClass('custom-class');
  });
});
