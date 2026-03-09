import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './use-mobile';

describe('useIsMobile', () => {
  let originalMatchMedia: any;
  let originalInnerWidth: number;
  let addEventListenerMock: jest.Mock;
  let removeEventListenerMock: jest.Mock;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    originalInnerWidth = window.innerWidth;

    addEventListenerMock = jest.fn();
    removeEventListenerMock = jest.fn();

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    }));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.innerWidth = originalInnerWidth;
  });

  it('should initialize with true if innerWidth < 768', () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should initialize with false if innerWidth >= 768', () => {
    window.innerWidth = 800;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('should respond to media query change events', () => {
    window.innerWidth = 800;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate resize event changing innerWidth and calling the change listener
    act(() => {
      window.innerWidth = 500;
      const onChange = addEventListenerMock.mock.calls[0][1];
      onChange();
    });

    expect(result.current).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    const { unmount } = renderHook(() => useIsMobile());
    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledTimes(1);
    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
