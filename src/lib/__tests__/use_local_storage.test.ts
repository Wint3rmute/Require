import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../use_local_storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Mock window.addEventListener for beforeunload tests
const addEventListenerMock = jest.fn();
const removeEventListenerMock = jest.fn();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'addEventListener', {
  value: addEventListenerMock,
});

Object.defineProperty(window, 'removeEventListener', {
  value: removeEventListenerMock,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic functionality', () => {
    it('should return default value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
      
      expect(result.current[0]).toBe('default');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should return stored value when localStorage has data', () => {
      localStorageMock.setItem('test-key', JSON.stringify('stored-value'));
      
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
      
      expect(result.current[0]).toBe('stored-value');
    });

    it('should handle malformed JSON gracefully', () => {
      localStorageMock.setItem('test-key', 'invalid-json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
      
      expect(result.current[0]).toBe('default');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to parse JSON from localStorage',
        expect.any(Error)
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('State updates', () => {
    it('should update state and persist immediately on first update', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
      
      act(() => {
        result.current[1]('updated');
      });
      
      expect(result.current[0]).toBe('updated');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"updated"');
    });

    it('should handle function updates correctly', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 0));
      
      act(() => {
        result.current[1](prev => prev + 1);
      });
      
      expect(result.current[0]).toBe(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '1');
    });

    it('should work with complex objects', () => {
      const initialValue = { name: 'test', count: 0 };
      const { result } = renderHook(() => useLocalStorage('test-key', initialValue));
      
      const newValue = { name: 'updated', count: 5 };
      act(() => {
        result.current[1](newValue);
      });
      
      expect(result.current[0]).toEqual(newValue);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(newValue));
    });
  });

  describe('Intelligent debouncing', () => {
    it('should persist first update immediately', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
      
      act(() => {
        result.current[1]('first-update');
      });
      
      // Should persist immediately
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"first-update"');
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    });

    it('should debounce rapid successive updates', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
      
      // First update - immediate
      act(() => {
        result.current[1]('update-1');
      });
      
      // Rapid follow-ups - should be debounced
      act(() => {
        result.current[1]('update-2');
      });
      
      act(() => {
        result.current[1]('update-3');
      });
      
      // Only first update should have persisted immediately
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"update-1"');
      
      // State should still be updated
      expect(result.current[0]).toBe('update-3');
      
      // Advance timers to trigger debounced persist
      act(() => {
        jest.advanceTimersByTime(150);
      });
      
      // Should persist the latest value
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
      expect(localStorageMock.setItem).toHaveBeenLastCalledWith('test-key', '"update-3"');
    });

    it('should persist immediately if enough time passes between updates', async () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
      
      // First update
      act(() => {
        result.current[1]('update-1');
      });
      
      // Wait longer than debounce period
      act(() => {
        jest.advanceTimersByTime(200);
      });
      
      // Second update should persist immediately
      act(() => {
        result.current[1]('update-2');
      });
      
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
      expect(localStorageMock.setItem).toHaveBeenNthCalledWith(1, 'test-key', '"update-1"');
      expect(localStorageMock.setItem).toHaveBeenNthCalledWith(2, 'test-key', '"update-2"');
    });
  });

  describe('Cleanup and safety mechanisms', () => {
    it('should persist pending values on unmount', () => {
      const { result, unmount } = renderHook(() => useLocalStorage('test-key', 'initial'));
      
      // Create rapid updates to trigger debouncing
      act(() => {
        result.current[1]('update-1');
      });
      
      act(() => {
        result.current[1]('update-2');
      });
      
      // Clear the mock to isolate unmount behavior
      localStorageMock.setItem.mockClear();
      
      // Unmount should persist pending value
      unmount();
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"update-2"');
    });

    it('should set up beforeunload listener', () => {
      renderHook(() => useLocalStorage('test-key', 'initial'));
      
      expect(addEventListenerMock).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });

    it('should clean up beforeunload listener on unmount', () => {
      const { unmount } = renderHook(() => useLocalStorage('test-key', 'initial'));
      
      unmount();
      
      expect(removeEventListenerMock).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });

    it('should persist pending values on beforeunload', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
      
      // Create pending update
      act(() => {
        result.current[1]('update-1');
      });
      
      act(() => {
        result.current[1]('pending-update');
      });
      
      // Get the beforeunload handler
      const beforeUnloadHandler = addEventListenerMock.mock.calls.find(
        call => call[0] === 'beforeunload'
      )?.[1];
      
      expect(beforeUnloadHandler).toBeDefined();
      
      // Clear mocks to isolate beforeunload behavior
      localStorageMock.setItem.mockClear();
      
      // Trigger beforeunload
      act(() => {
        beforeUnloadHandler();
      });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"pending-update"');
    });
  });

  describe('Edge cases', () => {
    it('should handle SSR (no window) gracefully', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Intentionally deleting window for SSR testing
      delete global.window;
      
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
      
      expect(result.current[0]).toBe('default');
      
      // Restore window
      global.window = originalWindow;
    });

    it('should not crash with null/undefined values', () => {
      const { result } = renderHook(() => useLocalStorage<string | null>('test-key', null));
      
      act(() => {
        result.current[1](null);
      });
      
      expect(result.current[0]).toBe(null);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', 'null');
    });

    it('should handle rapid updates correctly without race conditions', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 0));
      
      // Simulate very rapid updates (like from multiple event handlers)
      act(() => {
        for (let i = 1; i <= 10; i++) {
          result.current[1](prev => prev + 1);
        }
      });
      
      // State should reflect all updates
      expect(result.current[0]).toBe(10);
      
      // Should have persisted first update immediately
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '1');
      
      // Advance timer to persist final value
      act(() => {
        jest.advanceTimersByTime(150);
      });
      
      // Should persist the final value
      expect(localStorageMock.setItem).toHaveBeenLastCalledWith('test-key', '10');
    });
  });
});
