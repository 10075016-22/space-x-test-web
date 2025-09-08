import { useState, useCallback, useMemo } from 'react';
import { debounce } from '@/lib/utils';

interface UseDebouncedSearchOptions {
  delay?: number;
  minLength?: number;
}

export function useDebouncedSearch<T>(
  searchFunction: (query: string) => Promise<T>,
  options: UseDebouncedSearchOptions = {}
) {
  const { delay = 300, minLength = 2 } = options;
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función de búsqueda memoizada
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < minLength) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchResults = await searchFunction(searchQuery);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [searchFunction, minLength]);

  // Función debounced memoizada
  const debouncedSearch = useMemo(
    () => debounce(performSearch, delay),
    [performSearch, delay]
  );

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    debouncedSearch(newQuery);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    query,
    results,
    loading,
    error,
    updateQuery,
    clearSearch,
  };
}
