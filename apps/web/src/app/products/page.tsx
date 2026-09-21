'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { getApiClient } from '@uumiees/api';
import type { Product } from '@uumiees/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const initClient = () => {
    const api = getApiClient();
    const token = localStorage.getItem('token');
    if (token) api.setToken(token);
    return api;
  };

  const fetchProducts = useCallback(async () => {
    try {
      const api = initClient();
      const data = await api.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const addToCart = async (product: Product) => {
    try {
      const api = initClient();
      const sessionId = localStorage.getItem('sessionToken') || undefined;
      await api.addToCart(
        { product_id: product.id, quantity: 1, price: product.price },
        sessionId
      );
      alert('Added to cart!');
    } catch (err) {
      alert('Failed to add to cart');
    }
  };

  const addToWishlist = async (productId: number) => {
    try {
      const api = initClient();
      await api.addToWishlist({ product_id: productId });
      alert('Added to wishlist!');
    } catch (err) {
      alert('Failed to add to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#173B8F] mx-auto"></div>
          <p className="mt-4 text-[#171A21]">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-2 bg-[#173B8F] text-white rounded-lg hover:bg-[#081A3A] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#173B8F] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Products
          </h1>
          <p className="text-[#171A21]">Discover our premium collection</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#171A21]">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group"
              >
                <div className="relative aspect-square bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-4xl">📦</span>
                  </div>
                  {product.is_featured && (
                    <span className="absolute top-2 left-2 bg-[#D4AF37] text-white text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Link
                      href={`/products/${product.id}`}
                      className="px-4 py-2 bg-white text-[#173B8F] rounded-lg font-medium hover:bg-[#173B8F] hover:text-white transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-[#171A21] mb-2 hover:text-[#173B8F] transition line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < 4 ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">(4.0)</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold text-[#173B8F]">${product.price.toFixed(2)}</span>
                      {product.compare_price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${product.compare_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-[#173B8F] text-white rounded-lg hover:bg-[#081A3A] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={16} className="mr-1" />
                      Add
                    </button>
                    <button
                      onClick={() => addToWishlist(product.id)}
                      className="px-3 py-2 border border-[#173B8F] text-[#173B8F] rounded-lg hover:bg-[#173B8F] hover:text-white transition"
                    >
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
