'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCart, Heart, Star, Minus, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  compare_price?: number | null;
  stock: number;
  sku?: string | null;
  is_active: boolean;
  is_featured: boolean;
  weight?: number | null;
  dimensions?: string | null;
  created_at: string;
  updated_at: string;
}

interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string | null;
  is_primary: boolean;
  sort_order: number;
}

interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  options?: string;
  is_active: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProductDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/products/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }

      const data = await response.json();
      setProduct(data.product);
      setImages(data.images || []);
      setVariants(data.variants || []);

      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      void fetchProductDetails();
    }
  }, [fetchProductDetails, params.id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product?.id,
          variant_id: selectedVariant?.id,
          quantity,
          price: selectedVariant?.price || product?.price,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      alert('Added to cart!');
    } catch (err) {
      alert('Failed to add to cart');
    }
  };

  const addToWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product?.id,
          variant_id: selectedVariant?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to wishlist');
      }

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
          <p className="mt-4 text-[#171A21]">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Link
            href="/products"
            className="px-6 py-2 bg-[#173B8F] text-white rounded-lg hover:bg-[#081A3A] transition inline-flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const displayPrice = selectedVariant?.price || product.price;
  const displayStock = selectedVariant?.stock || product.stock;

  return (
    <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/products"
          className="inline-flex items-center text-[#173B8F] hover:underline mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={images.find(img => img.is_primary)?.image_url || images[0].image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-6xl">📦</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square bg-white rounded shadow cursor-pointer hover:ring-2 hover:ring-[#173B8F]"
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              {product.is_featured && (
                <span className="inline-block bg-[#D4AF37] text-white text-xs px-3 py-1 rounded mb-2">
                  Featured
                </span>
              )}
              <h1 className="text-3xl font-bold text-[#171A21] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {product.name}
              </h1>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < 4 ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">(4.0 out of 5)</span>
              </div>
            </div>

            <div className="border-t border-b py-4">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-[#173B8F]">${displayPrice.toFixed(2)}</span>
                {product.compare_price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.compare_price.toFixed(2)}
                  </span>
                )}
              </div>
              <p className={`text-sm mt-2 ${displayStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {displayStock > 0 ? `${displayStock} items in stock` : 'Out of stock'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#171A21] mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {variants.length > 0 && (
              <div>
                <h3 className="font-semibold text-[#171A21] mb-2">Variants</h3>
                <div className="grid grid-cols-2 gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg border-2 transition ${
                        selectedVariant?.id === variant.id
                          ? 'border-[#173B8F] bg-[#173B8F] text-white'
                          : 'border-gray-300 hover:border-[#173B8F]'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-[#171A21] mb-2">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <Minus size={16} />
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(displayStock, quantity + 1))}
                  disabled={quantity >= displayStock}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={addToCart}
                disabled={displayStock === 0}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-[#173B8F] text-white rounded-lg font-medium hover:bg-[#081A3A] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </button>
              <button
                onClick={addToWishlist}
                className="px-6 py-3 border-2 border-[#173B8F] text-[#173B8F] rounded-lg font-medium hover:bg-[#173B8F] hover:text-white transition"
              >
                <Heart size={20} />
              </button>
            </div>

            {product.sku && (
              <div className="text-sm text-gray-500">
                <span className="font-semibold">SKU:</span> {product.sku}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
