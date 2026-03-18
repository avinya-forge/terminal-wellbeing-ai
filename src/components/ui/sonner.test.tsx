import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toaster } from './sonner';

describe('Sonner Toaster', () => {
  it('renders correctly', () => {
    const { container } = render(<Toaster />);
    expect(container).toBeTruthy();
  });
});
