'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return <LoadingSpinner fullScreen message="Loading analytics..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Analytics', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="opacity-90">Business performance metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1A1A1C] p-6 rounded-xl border border-gray-300 dark:border-[#2A2A2E]">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-5 w-5 text-[#FF6B4A]" />
            <h2 className="text-xl font-bold dark:text-white">Sales Trend</h2>
          </div>
          <p className="text-gray-500 text-sm">Chart will display here</p>
        </div>

        <div className="bg-white dark:bg-[#1A1A1C] p-6 rounded-xl border border-gray-300 dark:border-[#2A2A2E]">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-5 w-5 text-[#FF6B4A]" />
            <h2 className="text-xl font-bold dark:text-white">Growth</h2>
          </div>
          <p className="text-gray-500 text-sm">Growth metrics will display here</p>
        </div>
      </div>
    </div>
  );
}
