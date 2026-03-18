import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders with pulse animation', () => {
    const { container } = render(<Skeleton data-testid="skel" />);
    expect(container.firstChild).toHaveClass('animate-pulse', 'bg-muted');
  });
});
