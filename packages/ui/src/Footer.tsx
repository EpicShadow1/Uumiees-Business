import * as React from 'react';
import { cn } from '@uumiees/utils';
import Link from 'next/link';
import { Heart, ShoppingBag, User, HelpCircle, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: 'All Products', href: '/products' },
      { label: 'Categories', href: '/categories' },
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Featured', href: '/products?featured=true' },
      { label: 'Sale', href: '/products?sale=true' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Info', href: '/help#shipping' },
      { label: 'Returns', href: '/help#returns' },
      { label: 'FAQ', href: '/help#faq' },
    ],
    account: [
      { label: 'My Account', href: '/account' },
      { label: 'Track Order', href: '/orders' },
      { label: 'Wishlist', href: '/favorites' },
      { label: 'Shopping Cart', href: '/cart' },
      { label: 'Login', href: '/auth/login' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/about#story' },
      { label: 'Careers', href: '/about#careers' },
      { label: 'Press', href: '/about#press' },
      { label: 'Blog', href: '/blog' },
    ],
  };

  return (
    <footer className={cn('bg-[#081A3A] text-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <span
                className="text-3xl font-bold text-[#D4AF37]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Uumiees
              </span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-sm leading-relaxed">
              Premium shopping experience for the whole family. Quality products, exceptional service,
              and unbeatable value since day one.
            </p>
            <div className="flex items-center gap-4 mb-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#D4AF37] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#D4AF37] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#D4AF37] transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Mail size={16} className="text-[#D4AF37]" />
                <span>support@uumiees.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <HelpCircle size={16} className="text-[#D4AF37]" />
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-[#D4AF37] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-[#D4AF37] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Account</h4>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-[#D4AF37] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-[#D4AF37] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Uumiee's. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
              Cookie Policy
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <ShoppingBag size={16} />
            <span>Secure Checkout</span>
            <span className="mx-1">•</span>
            <Heart size={16} className="text-[#C73E3A]" />
            <span>Made with care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
