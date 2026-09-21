'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#173B8F]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Uumiees
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition ${
                  pathname === link.href
                    ? 'text-[#173B8F]'
                    : 'text-[#171A21] hover:text-[#173B8F]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-[#171A21] hover:text-[#173B8F] transition">
              <Search size={20} />
            </button>
            <Link href="/cart" className="p-2 text-[#171A21] hover:text-[#173B8F] transition relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
            {isLoggedIn ? (
              <div className="relative group">
                <button className="p-2 text-[#171A21] hover:text-[#173B8F] transition">
                  <User size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <Link href="/account" className="block px-4 py-2 text-sm text-[#171A21] hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-[#171A21] hover:bg-gray-100">
                    My Orders
                  </Link>
                  <Link href="/wishlist" className="block px-4 py-2 text-sm text-[#171A21] hover:bg-gray-100">
                    Wishlist
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-[#173B8F] text-white rounded-lg text-sm font-medium hover:bg-[#081A3A] transition"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#171A21]"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-sm font-medium ${
                  pathname === link.href ? 'text-[#173B8F]' : 'text-[#171A21]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2" />
            <div className="flex items-center space-x-4">
              <button className="p-2 text-[#171A21]">
                <Search size={20} />
              </button>
              <Link href="/cart" className="p-2 text-[#171A21]">
                <ShoppingCart size={20} />
              </Link>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="text-sm text-red-600">
                  Logout
                </button>
              ) : (
                <Link href="/auth/login" className="text-sm text-[#173B8F]">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
