'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { StatCard } from '@/src/components/StatCard';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { BarChart3, Users, Package, ShoppingCart } from 'lucide-react';

import { supabase } from '@/src/lib/supabase';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalUsers: 0,
    products: 0,
    pendingOrders: 0,
    avgOrderValue: 0,
    lowStockItems: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: usersCount },
          { data: products },
          { data: orders },
          { data: recentOrdersData }
        ] = await Promise.all([
          supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('stock'),
          supabase.from('orders').select('total_amount, status'),
          supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        const totalSales = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
        const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
        const avgOrderValue = orders && orders.length > 0 ? totalSales / orders.length : 0;
        const lowStockItems = products?.filter(p => p.stock > 0 && p.stock <= 5).length || 0;

        setStats({
          totalSales,
          totalUsers: usersCount || 0,
          products: products?.length || 0,
          pendingOrders,
          avgOrderValue,
          lowStockItems
        });
        setRecentOrders(recentOrdersData || []);

      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner fullScreen message="Loading admin console..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Admin Console</h1>
        <p className="opacity-90">Manage your business operations</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard 
          label="Total Sales" 
          value={`₱${stats.totalSales.toLocaleString()}`} 
          icon={ShoppingCart}
        />
        <StatCard 
          label="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          icon={Users}
        />
        <StatCard 
          label="Products" 
          value={stats.products.toLocaleString()} 
          icon={Package}
        />
        <StatCard 
          label="Pending Orders" 
          value={stats.pendingOrders.toLocaleString()} 
          icon={BarChart3}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1A1A1C] p-6 rounded-xl border border-gray-300 dark:border-[#2A2A2E] shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#FF6B4A]" />
            Recent Orders
          </h2>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm italic">No recent orders found</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-[#121213] border border-gray-100 dark:border-[#2A2A2E] group hover:border-[#FF6B4A]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF6B4A]/10 flex items-center justify-center text-[#FF6B4A] font-bold text-xs">
                      #{order.order_number?.slice(-3) || '??'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{order.customer_name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{order.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#FF6B4A]">₱{order.total_amount.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1C] p-6 rounded-xl border border-gray-300 dark:border-[#2A2A2E] shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#FF6B4A]" />
            Quick Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#121213] border border-gray-100 dark:border-[#2A2A2E]">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Avg. Order Value</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">₱{stats.avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#121213] border border-gray-100 dark:border-[#2A2A2E]">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Inventory Alerts</p>
              <p className={`text-lg font-bold ${stats.lowStockItems > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {stats.lowStockItems} Items Low
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#121213] border border-gray-100 dark:border-[#2A2A2E]">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Users</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#121213] border border-gray-100 dark:border-[#2A2A2E]">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Conversion Rate</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">3.2%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
