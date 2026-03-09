import { renderHook, act } from '@testing-library/react';
import { useToast, toast, reducer } from '../use-toast';

jest.useFakeTimers();

describe('use-toast', () => {
  afterEach(() => {
    act(() => {
      const { result } = renderHook(() => useToast());
      if (result.current && result.current.dismiss) {
          result.current.dismiss();
      }
    });
    jest.runAllTimers();
  });

  describe('reducer', () => {
    it('should add a toast', () => {
      const state = { toasts: [] };
      const action: unknown = { type: 'ADD_TOAST', toast: { id: '1', title: 'Test' } };
      const newState = reducer(state, action);
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].title).toBe('Test');
    });

    it('should limit the number of toasts', () => {
      const state = { toasts: [{ id: '1', title: 'Test 1' }] as unknown };
      const action: unknown = { type: 'ADD_TOAST', toast: { id: '2', title: 'Test 2' } };
      const newState = reducer(state, action);
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].title).toBe('Test 2');
    });

    it('should update a toast', () => {
      const state = { toasts: [{ id: '1', title: 'Old' }] as unknown };
      const action: unknown = { type: 'UPDATE_TOAST', toast: { id: '1', title: 'New' } };
      const newState = reducer(state, action);
      expect(newState.toasts[0].title).toBe('New');
    });

    it('should ignore update for a non-existent toast', () => {
      const state = { toasts: [{ id: '1', title: 'Old' }] as unknown };
      const action: unknown = { type: 'UPDATE_TOAST', toast: { id: '2', title: 'New' } };
      const newState = reducer(state, action);
      expect(newState.toasts[0].title).toBe('Old');
    });

    it('should dismiss a specific toast', () => {
      const state = { toasts: [{ id: '1', open: true }, { id: '2', open: true }] as unknown };
      const action: unknown = { type: 'DISMISS_TOAST', toastId: '1' };
      const newState = reducer(state, action);
      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(true);
    });

    it('should dismiss all toasts if no id provided', () => {
      const state = { toasts: [{ id: '1', open: true }, { id: '2', open: true }] as unknown };
      const action: unknown = { type: 'DISMISS_TOAST' };
      const newState = reducer(state, action);
      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(false);
    });

    it('should remove a specific toast', () => {
      const state = { toasts: [{ id: '1' }, { id: '2' }] as unknown };
      const action: unknown = { type: 'REMOVE_TOAST', toastId: '1' };
      const newState = reducer(state, action);
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe('2');
    });

    it('should remove all toasts if no id provided', () => {
      const state = { toasts: [{ id: '1' }, { id: '2' }] as unknown };
      const action: unknown = { type: 'REMOVE_TOAST' };
      const newState = reducer(state, action);
      expect(newState.toasts).toHaveLength(0);
    });
  });

  describe('hook', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useToast());
      expect(result.current.toasts).toEqual([]);
    });

    it('should add a toast and dismiss it', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: 'Hello' });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Hello');
      expect(result.current.toasts[0].open).toBe(true);

      act(() => {
        result.current.dismiss(result.current.toasts[0].id);
      });

      expect(result.current.toasts[0].open).toBe(false);
    });

    it('should update a toast via returned function', () => {
      let toastInstance: { id: string, update: (props: unknown) => void, dismiss: () => void };
      const { result } = renderHook(() => useToast());

      act(() => {
        toastInstance = result.current.toast({ title: 'Hello' });
      });

      act(() => {
        toastInstance.update({ id: toastInstance.id, title: 'Updated' });
      });

      expect(result.current.toasts[0].title).toBe('Updated');
    });

    it('should handle onOpenChange dismiss', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: 'Hello' });
      });

      act(() => {
        result.current.toasts[0].onOpenChange?.(false);
      });

      expect(result.current.toasts[0].open).toBe(false);

      // Try with open=true, should not dismiss
      act(() => {
        result.current.toasts[0].onOpenChange?.(true);
      });
      // Remains false since it was already dismissed, but the callback shouldn't throw or dismiss again
    });

    it('should remove toast after delay', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: 'Hello' });
      });

      act(() => {
        result.current.dismiss();
      });

      expect(result.current.toasts[0].open).toBe(false);

      act(() => {
        jest.advanceTimersByTime(1000000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should not add multiple timeouts for same toast dismiss', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ id: '1', title: 'Hello' });
      });

      act(() => {
        result.current.dismiss();
      });

      act(() => {
        result.current.dismiss(); // second dismiss should not add a timeout
      });

      expect(result.current.toasts[0].open).toBe(false);

      act(() => {
        jest.advanceTimersByTime(1000000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe('toast singleton', () => {
    it('should add a toast using singleton', () => {
       const { result, unmount } = renderHook(() => useToast());

       act(() => {
         toast({ title: 'Singleton' });
       });

       expect(result.current.toasts).toHaveLength(1);
       expect(result.current.toasts[0].title).toBe('Singleton');

       // test unmount logic
       unmount();
    });
  });
});
