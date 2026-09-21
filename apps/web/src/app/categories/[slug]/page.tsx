'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  compare_price?: number | null;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategoryProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/categories/${params.slug}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }

      const data = await response.json();
      setCategory(data.category);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    if (params.slug) {
      void fetchCategoryProducts();
    }
  }, [fetchCategoryProducts, params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#173B8F] mx-auto"></div>
          <p className="mt-4 text-[#171A21]">Loading category...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/categories"
          className="inline-flex items-center text-[#173B8F] hover:underline mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Categories
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#173B8F] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {category?.name}
          </h1>
          {category?.description && (
            <p className="text-[#171A21]">{category.description}</p>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#171A21]">No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
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
    </div>
  );
}
