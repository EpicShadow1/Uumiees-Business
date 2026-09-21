'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  Headphones,
  Gift,
  ChevronRight,
  ArrowRight,
  Crown,
  Star,
  Heart,
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  image_url?: string | null;
}

interface FeaturedProduct {
  id: number;
  name: string;
  price: number;
  compare_price?: number | null;
  is_featured: boolean;
  primary_image?: string | null;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [productsRes, categoriesRes] = await Promise.all([
          fetch('http://localhost:3000/api/products/featured?limit=8', { headers }).catch(() => null),
          fetch('http://localhost:3000/api/categories/tree', { headers }).catch(() => null),
        ]);

        if (productsRes?.ok) {
          const data = await productsRes.json();
          setFeaturedProducts(Array.isArray(data) ? data : data.products || []);
        } else {
          setFeaturedProducts(getMockProducts());
        }

        if (categoriesRes?.ok) {
          const data = await categoriesRes.json();
          setCategories(Array.isArray(data) ? data.slice(0, 6) : (data.categories || []).slice(0, 6));
        } else {
          setCategories(getMockCategories());
        }
      } catch {
        setFeaturedProducts(getMockProducts());
        setCategories(getMockCategories());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#081A3A] via-[#173B8F] to-[#173B8F]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#D4AF37] blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#4A6FB5] blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#E0C45C]">
                <Crown size={16} className="text-[#D4AF37]" />
                <span className="text-sm font-semibold">Premium Collection 2025</span>
              </div>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Where Luxury
                <br />
                Meets
                <span className="text-[#D4AF37]"> Family</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
                Discover a world of handpicked premium products for every member of your family.
                Quality craftsmanship, unbeatable value, and service that makes you feel at home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-[#D4AF37] hover:bg-[#B8952F] text-white font-bold rounded-xl shadow-[0_4px_24px_rgba(212,175,55,0.4)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  Shop Collection
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/categories"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  Explore Categories
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-[#4A6FB5] to-[#173B8F] flex items-center justify-center text-white text-sm font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} className="fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                    <span className="ml-2 font-semibold">4.9/5</span>
                  </div>
                  <p className="text-sm text-white/70">Loved by 10,000+ families</p>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative z-10 aspect-square rounded-3xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur border border-white/20 p-8 shadow-2xl">
                <div className="absolute inset-8 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-9xl">🛍️</div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Curated Just For You
                      </p>
                      <p className="text-white/70">Premium picks for every lifestyle</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -left-6 px-4 py-3 bg-white rounded-2xl shadow-xl flex items-center gap-3 animate-float">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <ShoppingBag size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Free Shipping</p>
                    <p className="text-sm font-bold text-[#171A21]">Orders $100+</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 px-4 py-3 bg-white rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Exclusive</p>
                    <p className="text-sm font-bold text-[#171A21]">Member Deals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FFFDF7] to-transparent" />
      </section>

      {/* VALUE PROPS */}
      <section className="relative -mt-12 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Truck, title: 'Free Delivery', desc: 'On orders over $100', color: 'from-blue-500 to-indigo-600' },
            { icon: ShieldCheck, title: 'Secure Payment', desc: '100% protected checkout', color: 'from-emerald-500 to-teal-600' },
            { icon: Headphones, title: '24/7 Support', desc: 'Always here to help', color: 'from-amber-500 to-orange-600' },
            { icon: Gift, title: 'Gift Wrapping', desc: 'Premium packaging', color: 'from-rose-500 to-pink-600' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                <item.icon className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-lg text-[#171A21] mb-1">{item.title}</h3>
              <p className="text-sm text-[#6B7280]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm mb-2">
              Browse Collection
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#171A21]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Shop by Category
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden md:inline-flex items-center gap-2 font-semibold text-[#173B8F] hover:text-[#081A3A] transition-colors"
          >
            View All
            <ChevronRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-[#EFF4FF] to-[#DCE7FF] relative overflow-hidden">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-5xl">
                    {['👗', '📱', '🏠', '⚽', '💄', '🎮'][i % 6]}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-[#171A21] group-hover:text-[#173B8F] transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="md:hidden mt-8 text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 font-semibold text-[#173B8F]"
          >
            View All Categories
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#F4F5F7] to-[#FFFDF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <Sparkles size={14} className="text-[#D4AF37]" />
                <span className="text-xs font-bold text-[#977826] uppercase tracking-wider">
                  Handpicked For You
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#171A21]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Featured Products
              </h2>
              <p className="mt-3 text-[#6B7280] text-lg max-w-xl">
                Our most loved items, curated by our team for quality and style.
              </p>
            </div>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-2 font-semibold text-[#173B8F] hover:text-[#081A3A] transition-colors"
            >
              Shop All
              <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-white rounded-2xl mb-4" />
                  <div className="h-4 bg-white rounded w-3/4 mb-2" />
                  <div className="h-4 bg-white rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-[0_10px_30px_-5px_rgba(23,59,143,0.15)] hover:-translate-y-1 transition-all duration-300"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-square bg-[#F4F5F7] overflow-hidden">
                      {product.primary_image ? (
                        <img
                          src={product.primary_image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl text-[#9CA3AF]">
                          📦
                        </div>
                      )}
                      {product.compare_price && product.compare_price > product.price && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#1F8A5B] text-white text-xs font-bold">
                          {Math.round((1 - product.price / product.compare_price) * 100)}% OFF
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-[#171A21] mb-2 line-clamp-2 min-h-[2.5rem] hover:text-[#173B8F] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < 4 ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'}
                        />
                      ))}
                      <span className="ml-2 text-xs text-[#6B7280]">(4.0)</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-[#173B8F]">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.compare_price && product.compare_price > product.price && (
                            <span className="text-sm text-[#9CA3AF] line-through">
                              ${product.compare_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        className="w-10 h-10 rounded-full bg-[#173B8F]/5 hover:bg-[#173B8F]/10 flex items-center justify-center text-[#173B8F] transition-colors"
                        aria-label="Add to wishlist"
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
      </section>

      {/* CTA BANNER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#173B8F] via-[#173B8F] to-[#081A3A] p-10 md:p-16">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#D4AF37] blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-6">
              <p className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm">
                Limited Time
              </p>
              <h2
                className="text-3xl md:text-5xl font-bold leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Join the Uumiee's Family & Save 20%
              </h2>
              <p className="text-white/80 text-lg max-w-md">
                Sign up for our newsletter today and receive an exclusive discount on your first order.
                Plus, be the first to know about new arrivals and member-only offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-4 rounded-xl bg-white/10 backdrop-blur border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                <button className="px-8 py-4 bg-[#D4AF37] hover:bg-[#B8952F] text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
                  Get 20% Off
                </button>
              </div>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-40 h-40 rounded-3xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 backdrop-blur" />
                <div className="relative w-72 h-72 rounded-3xl bg-white/10 backdrop-blur border border-white/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-7xl font-black text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      20%
                    </div>
                    <p className="text-white font-bold text-2xl mt-2">OFF</p>
                    <p className="text-white/60 text-sm mt-1">your first order</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 px-5 py-3 bg-white rounded-2xl shadow-xl">
                  <p className="text-xs text-gray-500">Use code</p>
                  <p className="text-lg font-black text-[#173B8F]">UUMIEES20</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 bg-[#F4F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Happy Families' },
              { value: '500+', label: 'Premium Products' },
              { value: '50+', label: 'Countries Served' },
              { value: '4.9★', label: 'Average Rating' },
            ].map((stat, i) => (
              <div key={i}>
                <p
                  className="text-4xl md:text-5xl font-bold text-[#173B8F] mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {stat.value}
                </p>
                <p className="text-[#6B7280] font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function getMockProducts(): FeaturedProduct[] {
  return [
    { id: 1, name: 'Premium Leather Crossbody Bag', price: 89.99, compare_price: 129.99, is_featured: true },
    { id: 2, name: 'Smart Watch Series 5 Pro', price: 299.0, compare_price: null, is_featured: true },
    { id: 3, name: 'Organic Cotton T-Shirt Set', price: 45.5, compare_price: 59.99, is_featured: true },
    { id: 4, name: 'Ceramic Cookware Collection (5-Piece)', price: 189.0, compare_price: 249.0, is_featured: true },
    { id: 5, name: 'Minimalist Desk Lamp', price: 64.99, compare_price: null, is_featured: true },
    { id: 6, name: 'Running Shoes Ultra Cushion', price: 129.99, compare_price: 159.99, is_featured: true },
    { id: 7, name: 'Silk Pillowcase Twin Pack', price: 49.99, compare_price: null, is_featured: true },
    { id: 8, name: 'Wireless Noise Cancelling Headphones', price: 249.0, compare_price: 329.0, is_featured: true },
  ];
}

function getMockCategories(): Category[] {
  return [
    { id: 1, name: 'Fashion', slug: 'fashion' },
    { id: 2, name: 'Electronics', slug: 'electronics' },
    { id: 3, name: 'Home & Living', slug: 'home-living' },
    { id: 4, name: 'Sports', slug: 'sports' },
    { id: 5, name: 'Beauty', slug: 'beauty' },
    { id: 6, name: 'Kids', slug: 'kids' },
  ];
}
