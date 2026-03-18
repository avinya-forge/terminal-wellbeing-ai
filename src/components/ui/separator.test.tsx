import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Separator } from './separator';

describe('Separator', () => {
  it('renders horizontally by default', () => {
    const { container } = render(<Separator />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('h-[1px]', 'w-full');
  });
  it('renders vertically', () => {
    const { container } = render(<Separator orientation="vertical" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('h-full', 'w-[1px]');
  });
});
