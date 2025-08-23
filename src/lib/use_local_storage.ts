import { useState, Dispatch, SetStateAction, useCallback, useRef, useEffect } from "react";

function getStorageValue<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved) as T;
    } catch (e) {
      console.error("Failed to parse JSON from localStorage", e);
      return defaultValue;
    }
  }
  return defaultValue;
}

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  // Smart debouncing: automatically debounce rapid updates
  const DEBOUNCE_MS = 150; // Internal implementation detail
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingValueRef = useRef<T | null>(null);
  const lastUpdateRef = useRef<number>(0);
  
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, defaultValue);
  });

  // Force persist any pending value
  const forcePersist = useCallback(() => {
    if (pendingValueRef.current !== null && typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(pendingValueRef.current));
      pendingValueRef.current = null;
    }
  }, [key]);

  // Clear timeout and force persist on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      forcePersist();
    };
  }, [forcePersist]);

  // Force persist on page unload
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleBeforeUnload = () => {
      forcePersist();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [forcePersist]);

  /**
   * Smart setter with automatic debouncing detection.
   * 
   * INTELLIGENT DEBOUNCING:
   * - Detects rapid successive updates (within 150ms)
   * - First update: immediate persistence for responsiveness
   * - Rapid follow-ups: debounced to reduce localStorage writes
   * - Always persists on component unmount and page unload
   * - No API changes - completely internal optimization
   */
  const setValueAndPersist = useCallback((valueOrFunction: SetStateAction<T>) => {
    setValue(prevValue => {
      const newValue = typeof valueOrFunction === 'function' 
        ? (valueOrFunction as (prevState: T) => T)(prevValue)
        : valueOrFunction;
      
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateRef.current;
      
      // Smart debouncing logic
      if (timeSinceLastUpdate > DEBOUNCE_MS || lastUpdateRef.current === 0) {
        // First update or sufficient gap - persist immediately
        if (typeof window !== "undefined") {
          localStorage.setItem(key, JSON.stringify(newValue));
        }
        // Clear any pending debounced persist since we just persisted
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          pendingValueRef.current = null;
        }
      } else {
        // Rapid update - debounce it
        pendingValueRef.current = newValue;
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          if (typeof window !== "undefined" && pendingValueRef.current !== null) {
            localStorage.setItem(key, JSON.stringify(pendingValueRef.current));
            pendingValueRef.current = null;
          }
        }, DEBOUNCE_MS);
      }
      
      lastUpdateRef.current = now;
      return newValue;
    });
  }, [key]);

  return [value, setValueAndPersist];
};
