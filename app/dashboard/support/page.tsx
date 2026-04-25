'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react';

export default function SupportPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const supportTopics = [
    { id: '1', title: 'Shipping & Delivery', description: 'Track your order and shipping information' },
    { id: '2', title: 'Returns & Refunds', description: 'Process returns or request refunds' },
    { id: '3', title: 'Technical Issues', description: 'Report website or app problems' },
    { id: '4', title: 'Product Questions', description: 'Ask about our products' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Support', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Customer Support</h1>
        <p className="opacity-90">We're here to help. Get in touch with our support team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
          <Phone className="h-8 w-8 text-[#FF6B4A] mx-auto mb-2" />
          <p className="font-semibold mb-1">Call Us</p>
          <p className="text-sm text-gray-500">+63 2 1234 5678</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
          <Mail className="h-8 w-8 text-[#FF6B4A] mx-auto mb-2" />
          <p className="font-semibold mb-1">Email Us</p>
          <p className="text-sm text-gray-500">support@motorparts.com</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
          <MessageCircle className="h-8 w-8 text-[#FF6B4A] mx-auto mb-2" />
          <p className="font-semibold mb-1">Live Chat</p>
          <p className="text-sm text-gray-500">Available 9AM-6PM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#FF6B4A]" />
            Common Topics
          </h2>
          <div className="space-y-2">
            {supportTopics.map(topic => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedTopic === topic.id
                    ? 'bg-[#FF6B4A] text-white border-[#FF6B4A]'
                    : 'border-gray-300 dark:border-gray-700 hover:border-[#FF6B4A]'
                }`}
              >
                <p className="font-semibold">{topic.title}</p>
                <p className="text-sm opacity-75">{topic.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Send Message</h2>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            />
            <textarea
              placeholder="Your message..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 min-h-24"
            />
            <button className="w-full bg-[#FF6B4A] text-white py-2 rounded-lg hover:bg-[#E55A3A] font-semibold">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
