'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

interface WishlistItem {
  id: number;
  product_id: number;
  variant_id: number | null;
  created_at: string;
  product?: {
    id: number;
    name: string;
    price: number;
    image_url: string | null;
  };
  variant?: {
    id: number;
    name: string;
    price: number;
  } | null;
}

export default function FavoritesPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      setWishlist(data.items || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }

      await fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const addToCart = async (productId: number, variantId?: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          variant_id: variantId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#173B8F] mx-auto"></div>
          <p className="mt-4 text-[#171A21]">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#173B8F] mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          My Favorites
        </h1>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Heart className="mx-auto text-gray-300 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-[#171A21] mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save items you love by clicking the heart icon.</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-[#173B8F] text-white rounded-lg font-medium hover:bg-[#081A3A] transition"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <Link href={`/products/${item.product_id}`}>
                  <div className="aspect-square bg-gray-200">
                    {item.product?.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${item.product_id}`}>
                    <h3 className="font-semibold text-[#171A21] mb-2 hover:text-[#173B8F] transition line-clamp-2">
                      {item.product?.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-[#173B8F] mb-3">
                    ${(item.variant?.price || item.product?.price || 0).toFixed(2)}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(item.product_id, item.variant_id || undefined)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-[#173B8F] text-white rounded-lg hover:bg-[#081A3A] transition"
                    >
                      <ShoppingCart size={16} className="mr-1" />
                      Add
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="px-3 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 size={16} />
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
