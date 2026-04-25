'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { EmptyState } from '@/src/components/EmptyState';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { StatCard } from '@/src/components/StatCard';
import { Order } from '@/src/types';
import { Package, CheckCircle, Clock } from 'lucide-react';

import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/context/AuthContext';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  if (loading) return <LoadingSpinner fullScreen message="Loading orders..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Orders', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="opacity-90">View and manage your orders</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Orders" value={orders.length} icon={Package} color="primary" />
        <StatCard label="Completed" value={orders.filter(o => o.status === 'completed').length} icon={CheckCircle} color="secondary" />
        <StatCard label="Pending" value={orders.filter(o => o.status === 'pending').length} icon={Clock} color="tertiary" />
      </div>

      {orders.length === 0 ? (
        <EmptyState title="No orders yet" description="You haven't placed any orders" icon="Package" />
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center bg-white dark:bg-[#1A1A1C] hover:border-[#FF6B4A]/50 transition-colors group">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white group-hover:text-[#FF6B4A] transition-colors">{order.id}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                    order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-[#FF6B4A]/10 text-[#FF6B4A]'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">₱{order.total_amount.toLocaleString()}</p>
                <p className="text-[10px] text-gray-600 uppercase tracking-tighter mt-1">{order.items_count} items • {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <button className="px-4 py-2 border border-[#FF6B4A]/20 text-[#FF6B4A] rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#FF6B4A] hover:text-white transition-all">
                Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
