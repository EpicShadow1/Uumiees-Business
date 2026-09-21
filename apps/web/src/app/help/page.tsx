import Link from 'next/link';
import { ShoppingBag, Truck, CreditCard, Package, MessageSquare } from 'lucide-react';

export default function HelpPage() {
  const helpCategories = [
    {
      title: 'Getting Started',
      icon: ShoppingBag,
      items: [
        { title: 'How to create an account', href: '#' },
        { title: 'How to browse products', href: '#' },
        { title: 'How to add items to cart', href: '#' },
        { title: 'How to checkout', href: '#' },
      ],
    },
    {
      title: 'Orders & Shipping',
      icon: Truck,
      items: [
        { title: 'Track your order', href: '#' },
        { title: 'Shipping information', href: '#' },
        { title: 'Delivery times', href: '#' },
        { title: 'International shipping', href: '#' },
      ],
    },
    {
      title: 'Payments & Billing',
      icon: CreditCard,
      items: [
        { title: 'Payment methods', href: '#' },
        { title: 'Billing questions', href: '#' },
        { title: 'Refund policy', href: '#' },
        { title: 'Discount codes', href: '#' },
      ],
    },
    {
      title: 'Returns & Exchanges',
      icon: Package,
      items: [
        { title: 'Return policy', href: '#' },
        { title: 'How to return an item', href: '#' },
        { title: 'Exchange process', href: '#' },
        { title: 'Return shipping', href: '#' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#173B8F] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Help Center
          </h1>
          <p className="text-[#171A21]">Find answers to common questions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {helpCategories.map((category) => (
            <div key={category.title} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <category.icon className="text-[#173B8F]" size={24} />
                <h2 className="text-xl font-bold text-[#171A21]">{category.title}</h2>
              </div>
              <ul className="space-y-2">
                {category.items.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="text-[#173B8F] hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <MessageSquare className="mx-auto text-[#173B8F] mb-4" size={48} />
          <h2 className="text-2xl font-bold text-[#171A21] mb-2">Still need help?</h2>
          <p className="text-gray-600 mb-6">Our support team is here to assist you</p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-[#173B8F] text-white rounded-lg font-medium hover:bg-[#081A3A] transition"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
