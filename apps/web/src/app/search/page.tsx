'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  compare_price?: number | null;
  stock: number;
  is_active: boolean;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/products?search=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.products || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#173B8F] mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
          Search Products
        </h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B8F] focus:border-transparent outline-none text-lg"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#173B8F] text-white p-2 rounded-lg hover:bg-[#081A3A] transition"
            >
              <Search size={20} />
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#173B8F] mx-auto"></div>
            <p className="mt-4 text-[#171A21]">Searching...</p>
          </div>
        )}

        {!loading && hasSearched && (
          <div>
            <p className="text-gray-600 mb-6">
              {results.length} {results.length === 1 ? 'result' : 'results'} found for "{query}"
            </p>

            {results.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-[#171A21] mb-4">No products found matching your search.</p>
                <Link
                  href="/products"
                  className="text-[#173B8F] hover:underline"
                >
                  Browse all products instead
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group"
                  >
                    <div className="aspect-square bg-gray-200">
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">📦</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#171A21] mb-2 group-hover:text-[#173B8F] transition line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#173B8F]">${product.price.toFixed(2)}</span>
                        <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {!hasSearched && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Enter a search term to find products</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Electronics', 'Clothing', 'Home', 'Sports'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    handleSearch(suggestion);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-[#173B8F] hover:text-[#173B8F] transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
