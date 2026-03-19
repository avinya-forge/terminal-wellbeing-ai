import { renderHook, act } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  it('should trigger onClear when Ctrl+K is pressed', () => {
    const onClear = jest.fn();
    renderHook(() => useKeyboardShortcuts({ onClear }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    });

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('should trigger onClear when Meta+K is pressed', () => {
    const onClear = jest.fn();
    renderHook(() => useKeyboardShortcuts({ onClear }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    });

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('should trigger onFocus when Ctrl+L is pressed', () => {
    const onFocus = jest.fn();
    renderHook(() => useKeyboardShortcuts({ onFocus }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'l', ctrlKey: true }));
    });

    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('should trigger onProfile when Ctrl+, is pressed', () => {
    const onProfile = jest.fn();
    renderHook(() => useKeyboardShortcuts({ onProfile }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: ',', ctrlKey: true }));
    });

    expect(onProfile).toHaveBeenCalledTimes(1);
  });

  it('should trigger onPanic when Ctrl+Shift+P is pressed', () => {
    const onPanic = jest.fn();
    renderHook(() => useKeyboardShortcuts({ onPanic }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', ctrlKey: true, shiftKey: true }));
    });

    expect(onPanic).toHaveBeenCalledTimes(1);
  });

  it('should trigger onPanic when Ctrl+Shift+P is pressed (uppercase P)', () => {
    const onPanic = jest.fn();
    renderHook(() => useKeyboardShortcuts({ onPanic }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'P', ctrlKey: true, shiftKey: true }));
    });

    expect(onPanic).toHaveBeenCalledTimes(1);
  });

  it('should not trigger anything when just P is pressed', () => {
    const onPanic = jest.fn();
    renderHook(() => useKeyboardShortcuts({ onPanic }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
    });

    expect(onPanic).not.toHaveBeenCalled();
  });

  it('should clean up event listeners on unmount', () => {
    const onClear = jest.fn();
    const { unmount } = renderHook(() => useKeyboardShortcuts({ onClear }));

    unmount();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    });

    expect(onClear).not.toHaveBeenCalled();
  });
});
