'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CarWithImages } from '@/types/car';
import { Search, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Basic debounce function
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      clearTimeout(timeout);
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CarWithImages[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`/api/cars/search?query=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Failed to fetch search results:', error);
        setResults([]);
      }
      setIsLoading(false);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetch(query);
  }, [query, debouncedFetch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', query);
    
    // If we are not on the cars page, navigate to it. Otherwise, just push the new params.
    if (pathname !== '/cars') {
      router.push(`/cars?${params.toString()}`);
    } else {
      // This will update the URL without a full page reload in Next.js 13+ App Router
      window.history.pushState(null, '', `?${params.toString()}`);
      // We might need a way to signal the parent page to re-fetch data.
      // For now, we'll rely on the user seeing the URL change and the page content updating if the page is dynamic.
      // A better approach for instant updates on the same page would involve state management.
      // Let's do a full navigation to ensure the server component re-renders with new search props.
      router.push(`/cars?${params.toString()}`);
    }
    setIsFocused(false);
  };

  const showResults = isFocused && (results.length > 0 || isLoading);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search by Make, Model, Stock #..."
          className="w-full pl-12 pr-10 py-3 text-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 shadow-lg"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        )}
        {isLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-spin" size={20} />}
      </form>

      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in-fast">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {results.map((car) => (
              <li key={car.id}>
                <Link href={`/cars/${car.id}`} onClick={() => setIsFocused(false)} className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Image
                    src={car.images[0]?.url || '/placeholder.png'}
                    alt={`${car.make} ${car.model}`}
                    width={80}
                    height={60}
                    className="w-20 h-15 object-cover rounded-md"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{car.year} {car.make} {car.model}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Stock #: {car.stockNumber}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
