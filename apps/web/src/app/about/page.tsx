import Link from 'next/link';
import { Heart, Users, Award, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      <div className="bg-[#173B8F] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            About Uumiee's
          </h1>
          <p className="text-xl opacity-90">
            Premium shopping experience for the whole family
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-[#171A21] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Story
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Uumiee's is a family-owned business dedicated to providing premium products
              and exceptional service to families everywhere. What started as a small family
              venture has grown into a trusted destination for quality products.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that shopping should be more than just a transaction—it should be
              an experience. That's why we've carefully curated our selection to offer
              products that combine quality, value, and style.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#171A21] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Values
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Heart className="text-[#D4AF37] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-[#171A21]">Family First</h3>
                  <p className="text-gray-600 text-sm">Every product is chosen with families in mind</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Users className="text-[#D4AF37] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-[#171A21]">Community Focus</h3>
                  <p className="text-gray-600 text-sm">Building relationships that last</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Award className="text-[#D4AF37] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-[#171A21]">Quality Promise</h3>
                  <p className="text-gray-600 text-sm">Only the best for our customers</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Shield className="text-[#D4AF37] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-[#171A21]">Trust & Safety</h3>
                  <p className="text-gray-600 text-sm">Your security is our priority</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-[#171A21] mb-6 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Why Choose Uumiee's?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#173B8F] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-semibold text-[#171A21] mb-2">Curated Selection</h3>
              <p className="text-gray-600 text-sm">Hand-picked products for quality and value</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#173B8F] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-semibold text-[#171A21] mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Quick and reliable shipping options</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#173B8F] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="font-semibold text-[#171A21] mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Always here to help you</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#171A21] mb-4">Ready to Start Shopping?</h2>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-[#173B8F] text-white rounded-lg font-medium hover:bg-[#081A3A] transition"
          >
            Explore Our Products
          </Link>
        </div>
      </div>
    </div>
  );
}
