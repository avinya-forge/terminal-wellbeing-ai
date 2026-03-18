import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toaster } from './toaster';
import * as useToastModule from '@/hooks/use-toast';

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('App Toaster', () => {
  it('renders toasts', () => {
    jest.spyOn(useToastModule, 'useToast').mockReturnValue({
      toasts: [{ id: '1', title: 'Test Toast', description: 'Desc' } as Parameters<typeof useToastModule.toast>[0] & { id: string }],
      toast: jest.fn(),
      dismiss: jest.fn(),
    });
    render(<Toaster />);
    expect(screen.getByText('Test Toast')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });
});
