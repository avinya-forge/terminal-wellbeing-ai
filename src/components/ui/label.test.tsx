import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Label } from './label';

describe('Label', () => {
  it('renders correctly', () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });
});
