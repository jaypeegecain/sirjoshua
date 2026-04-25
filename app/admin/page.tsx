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
    pendingOrders: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: usersCount },
          { count: productsCount },
          { data: orders }
        ] = await Promise.all([
          supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('total_amount, status')
        ]);

        const totalSales = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
        const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;

        setStats({
          totalSales,
          totalUsers: usersCount || 0,
          products: productsCount || 0,
          pendingOrders
        });

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-2 text-sm text-gray-500">No recent orders</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
          <div className="space-y-2 text-sm">
            <p>Daily active users: 234</p>
            <p>Average order value: ₱2,345</p>
            <p>Inventory alerts: 5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
