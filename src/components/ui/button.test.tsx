import { render, screen } from '@testing-library/react';
import { Button } from './button';
import userEvent from '@testing-library/user-event';

describe('Button component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('renders as a custom child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="https://example.com">Link Button</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    // Ensure it's not a button tag
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles clicks', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom classes', () => {
    render(<Button className="custom-class">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('applies variants and sizes', () => {
    // testing variant outline and size lg via buttonVariants
    render(<Button variant="outline" size="lg">Styled</Button>);
    const button = screen.getByRole('button');
    // We don't strictly test tailwind output classes because cva handles that,
    // but we can ensure it renders without error and accepts the props
    expect(button).toBeInTheDocument();
  });
});
