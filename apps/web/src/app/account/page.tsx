'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, MapPin, CreditCard, Settings, LogOut, Package, Heart } from 'lucide-react';

interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const accountSections = [
    {
      title: 'My Orders',
      icon: Package,
      href: '/orders',
      description: 'View your order history and tracking',
    },
    {
      title: 'Wishlist',
      icon: Heart,
      href: '/favorites',
      description: 'View your saved items',
    },
    {
      title: 'Addresses',
      icon: MapPin,
      href: '/account/addresses',
      description: 'Manage your shipping addresses',
    },
    {
      title: 'Payment Methods',
      icon: CreditCard,
      href: '/account/payment',
      description: 'Manage your payment options',
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/account/settings',
      description: 'Account preferences and security',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#173B8F] mx-auto"></div>
          <p className="mt-4 text-[#171A21]">Loading account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#173B8F] mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          My Account
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-[#173B8F] rounded-full flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#171A21]">{user?.name || 'User'}</h2>
              <p className="text-gray-600">{user?.email || ''}</p>
              {user?.phone && <p className="text-gray-600">{user.phone}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {accountSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex items-center space-x-4"
            >
              <div className="w-12 h-12 bg-[#F4F5F7] rounded-lg flex items-center justify-center">
                <section.icon className="text-[#173B8F]" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#171A21]">{section.title}</h3>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 rounded-lg p-4 flex items-center justify-center space-x-2 hover:bg-red-100 transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
