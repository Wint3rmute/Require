import { useState, useEffect, Dispatch, SetStateAction, useCallback } from "react";

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

  const setValueAndPersist = useCallback((valueOrFunction: SetStateAction<T>) => {
    setValue(prevValue => {
      const newValue = typeof valueOrFunction === 'function' 
        ? (valueOrFunction as (prevState: T) => T)(prevValue)
        : valueOrFunction;
      
      // Immediately persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
      
      return newValue;
    });
  }, [key]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValueAndPersist];
};
