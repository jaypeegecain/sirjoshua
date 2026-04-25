'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { EmptyState } from '@/src/components/EmptyState';
import { MessageCircle } from 'lucide-react';

import { supabase } from '@/src/lib/supabase';

export default function AdminFeedbackPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  async function fetchFeedback() {
    try {
      const { data, error } = await supabase.from('support_messages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner fullScreen message="Loading feedback..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Feedback', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Customer Feedback</h1>
        <p className="opacity-90">Review customer feedback and ratings</p>
      </div>

      {messages.length === 0 ? (
        <EmptyState title="No feedback" description="Customer feedback will appear here" icon="MessageCircle" />
      ) : (
        <div className="space-y-4">
          {messages.map((msg: any) => (
            <div key={msg.id} className="border border-gray-300 dark:border-[#2A2A2E] rounded-xl p-5 bg-white dark:bg-[#1A1A1C] hover:border-[#FF6B4A]/50 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 dark:text-white">{msg.subject}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${msg.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                   {msg.status || 'New'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{msg.message}</p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#2A2A2E] flex justify-between text-xs text-gray-500">
                <span>From: {msg.customer_name} ({msg.email})</span>
                <span>{new Date(msg.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
