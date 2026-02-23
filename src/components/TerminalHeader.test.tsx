import { render, screen } from '@testing-library/react';
import TerminalHeader from './TerminalHeader';

describe('TerminalHeader', () => {

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders the app title', () => {
    render(<TerminalHeader />);
    expect(screen.getByText('WellBeing.sh')).toBeInTheDocument();
  });

  it('shows "Connecting..." status when not loaded (default)', () => {
    render(<TerminalHeader />);
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('shows "Online" status when modelLoaded is true', () => {
    render(<TerminalHeader modelLoaded={true} />);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('shows a custom loadingStatus when provided and not yet loaded', () => {
    render(<TerminalHeader loadingStatus="Loading models…" />);
    expect(screen.getByText('Loading models…')).toBeInTheDocument();
  });

  // ── Privacy mode ──────────────────────────────────────────────────────────

  it('hides the PRIVACY MODE badge by default', () => {
    render(<TerminalHeader />);
    expect(screen.queryByText('PRIVACY MODE')).not.toBeInTheDocument();
  });

  it('shows the PRIVACY MODE badge when privacyMode is true', () => {
    render(<TerminalHeader privacyMode={true} />);
    expect(screen.getByText('PRIVACY MODE')).toBeInTheDocument();
  });

  // ── Status dot colour / label ─────────────────────────────────────────────

  it('labels the service as "Service online" when modelLoaded is true', () => {
    render(<TerminalHeader modelLoaded={true} />);
    // The outer ping ring <span> carries the title attribute
    expect(document.querySelector('[title="Service online"]')).toBeInTheDocument();
  });

  it('labels the service as "Connecting…" when not loaded', () => {
    render(<TerminalHeader modelLoaded={false} />);
    expect(document.querySelector('[title="Connecting…"]')).toBeInTheDocument();
  });

  // ── Traffic lights ────────────────────────────────────────────────────────

  it('renders all three macOS traffic light dots', () => {
    render(<TerminalHeader />);
    expect(document.querySelector('[title="Close"]')).toBeInTheDocument();
    expect(document.querySelector('[title="Minimise"]')).toBeInTheDocument();
    expect(document.querySelector('[title="Maximise"]')).toBeInTheDocument();
  });

  // ── Accessibility ─────────────────────────────────────────────────────────

  it('has a role="status" aria-live region for service status', () => {
    render(<TerminalHeader />);
    const statusRegion = document.querySelector('[role="status"][aria-live="polite"]');
    expect(statusRegion).toBeInTheDocument();
  });

  it('shows PRIVACY MODE badge with role="status"', () => {
    render(<TerminalHeader privacyMode={true} />);
    const badge = screen.getByText('PRIVACY MODE').closest('[role="status"]');
    expect(badge).toBeInTheDocument();
  });

  // ── Snapshot ──────────────────────────────────────────────────────────────

  it('matches snapshot in default state', () => {
    const { container } = render(<TerminalHeader />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot in online+privacy state', () => {
    const { container } = render(<TerminalHeader modelLoaded={true} privacyMode={true} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
