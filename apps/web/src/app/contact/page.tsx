'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: formData.subject,
          description: formData.message,
          category: 'General Inquiry',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit message');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Failed to submit message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[#171A21] mb-2">Message Sent!</h2>
          <p className="text-gray-600 mb-6">We'll get back to you as soon as possible.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2 bg-[#173B8F] text-white rounded-lg hover:bg-[#081A3A] transition"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#173B8F] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Contact Us
          </h1>
          <p className="text-[#171A21]">We'd love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#171A21] mb-4">Get in Touch</h2>
              <p className="text-gray-600 mb-6">
                Have questions about your order, our products, or anything else? We're here to help.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#F4F5F7] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-[#173B8F]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#171A21]">Email</h3>
                  <p className="text-gray-600">support@uumiees.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#F4F5F7] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-[#173B8F]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#171A21]">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#F4F5F7] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-[#173B8F]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#171A21]">Address</h3>
                  <p className="text-gray-600">123 Main Street, City, State 12345</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-[#171A21] mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#171A21] mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B8F] focus:border-transparent outline-none transition"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#171A21] mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B8F] focus:border-transparent outline-none transition"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#171A21] mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B8F] focus:border-transparent outline-none transition"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#171A21] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B8F] focus:border-transparent outline-none transition resize-none"
                  placeholder="Tell us more..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-[#173B8F] text-white rounded-lg font-medium hover:bg-[#081A3A] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={20} className="mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
