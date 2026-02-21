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
    const dots = document.querySelectorAll('.status-indicator');
    expect(dots.length).toBe(3);
  });

  it('renders with model loaded state when specified', () => {
    render(<TerminalHeader modelLoaded={true} />);

    // When model is loaded, shorter "AI: Ready" text is shown
    expect(screen.getByText('AI: Ready')).toBeInTheDocument();

    // Check for green status indicator (the third dot becomes green when ready)
    const greenDot = document.querySelector('.status-green');
    expect(greenDot).toBeInTheDocument();
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

