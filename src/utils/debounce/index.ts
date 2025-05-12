'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook for debouncing an input value.
 * @param input - The input value to debounce.
 * @param delay - The debounce delay in milliseconds (default: 300ms).
 * @returns The debounced input value.
 */
export const useDebounceInput = (input: string, delay = 300): string => {
  const [debouncedValue, setDebouncedValue] = useState(input);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(input), delay);

    return () => clearTimeout(timer);
  }, [input, delay]);

  return debouncedValue;
};
