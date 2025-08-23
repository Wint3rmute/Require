import { useState, Dispatch, SetStateAction, useCallback } from "react";

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
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, defaultValue);
  });

  /**
   * Enhanced setter that immediately persists data to localStorage.
   * 
   * CRITICAL FIX: This addresses a race condition where rapid state updates
   * (like double function calls in React dev mode) would cause data loss.
   * The original version only persisted in useEffect after render, which
   * created timing issues with fast successive updates.
   * 
   * COMPLEX BEHAVIOR:
   * 1. Handles both direct values and updater functions (SetStateAction<T>)
   * 2. Uses functional setState to avoid stale closure references
   * 3. Immediately persists to localStorage within the setState callback
   * 4. Type-safe handling of function vs value parameters
   */
  const setValueAndPersist = useCallback((valueOrFunction: SetStateAction<T>) => {
    setValue(prevValue => {
      // Type-safe resolution of SetStateAction<T> - handles both:
      // - Direct values: setProjects(newArray)
      // - Updater functions: setProjects(prev => [...prev, newItem])
      const newValue = typeof valueOrFunction === 'function' 
        ? (valueOrFunction as (prevState: T) => T)(prevValue)
        : valueOrFunction;
      
      // IMMEDIATE PERSISTENCE: Critical for preventing data loss
      // This ensures localStorage is updated synchronously with state,
      // preventing race conditions in rapid successive updates
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
      
      return newValue;
    });
  }, [key]);

  return [value, setValueAndPersist];
};
