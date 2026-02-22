import { render, screen } from '@testing-library/react';
import TerminalHeader from './TerminalHeader';

describe('TerminalHeader Component', () => {
  it('renders with model not loaded state by default', () => {
    render(<TerminalHeader />);

    // Check for terminal title
    expect(screen.getByText('WellBeing.sh')).toBeInTheDocument();

    // Check for model status text (shortened strings)
    expect(screen.getByText('AI: Loading...')).toBeInTheDocument();

    // Check for status indicators (dots) — there are 3 decorative traffic lights
    expect(screen.getByTitle('Close')).toBeInTheDocument();
    expect(screen.getByTitle('Minimize')).toBeInTheDocument();
    expect(screen.getByTitle(/AI Model: Loading/i)).toBeInTheDocument();
  });

  it('renders with model loaded state when specified', () => {
    render(<TerminalHeader modelLoaded={true} />);

    // When model is loaded, shorter "AI: Ready" text is shown
    expect(screen.getByText('AI: Ready')).toBeInTheDocument();

    // Check for green status indicator (the third dot becomes green when ready)
    const greenDot = document.querySelector('[title="AI Model: Ready"]');
    expect(greenDot).toBeInTheDocument();
    expect(greenDot).toHaveClass('bg-[var(--success)]');
  });

  it('shows custom loading status when provided', () => {
    render(<TerminalHeader loadingStatus="Loading DistilGPT-2..." />);
    expect(screen.getByText('Loading DistilGPT-2...')).toBeInTheDocument();
  });

  it('shows privacy mode badge when privacyMode is true', () => {
    render(<TerminalHeader privacyMode={true} />);
    expect(screen.getByText('PRIVACY MODE')).toBeInTheDocument();
  });
});

