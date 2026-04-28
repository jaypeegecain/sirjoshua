'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { BarChart3, TrendingUp } from 'lucide-react';

import { supabase } from '@/src/lib/supabase';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .order('created_at', { ascending: true });
      
      if (error) throw error;

      // Group by date
      const grouped = (orders || []).reduce((acc: any, order) => {
        const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        acc[date] = (acc[date] || 0) + Number(order.total_amount);
        return acc;
      }, {});

      const chartData = Object.entries(grouped).map(([date, amount]) => ({ date, amount }));
      setSalesData(chartData.slice(-7)); // Last 7 days/entries
      setTotalRevenue((orders || []).reduce((sum, o) => sum + Number(o.total_amount), 0));
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner fullScreen message="Loading analytics..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Analytics', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="opacity-90">Business performance metrics and insights</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1A1A1C] p-6 rounded-xl border border-gray-300 dark:border-[#2A2A2E]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-[#FF6B4A]" />
              <h2 className="text-xl font-bold dark:text-white">Sales Trend</h2>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Last 7 Days</p>
          </div>
          
          <div className="h-48 flex items-end gap-2 px-2">
            {salesData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm italic">No sales data available</div>
            ) : (
              salesData.map((d, i) => {
                const max = Math.max(...salesData.map(sd => sd.amount as number));
                const height = max > 0 ? (d.amount / max) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-[#FF6B4A]/10 rounded-t-lg relative group-hover:bg-[#FF6B4A]/20 transition-colors" style={{ height: `${height}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2A2A2E] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ₱{d.amount.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase truncate w-full text-center">{d.date}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1C] p-6 rounded-xl border border-gray-300 dark:border-[#2A2A2E]">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-5 w-5 text-[#FF6B4A]" />
            <h2 className="text-xl font-bold dark:text-white">Revenue Overview</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Lifetime Revenue</p>
              <p className="text-4xl font-black text-[#FF6B4A]">₱{totalRevenue.toLocaleString()}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#121213] border border-gray-100 dark:border-[#2A2A2E]">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Growth Rate</p>
                <p className="text-xl font-bold text-emerald-500">+12.5%</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#121213] border border-gray-100 dark:border-[#2A2A2E]">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Target Pace</p>
                <p className="text-xl font-bold text-blue-500">92%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
