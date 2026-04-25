'use client';

import { useState, useEffect } from 'react';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { EmptyState } from '@/src/components/EmptyState';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { Order } from '@/src/types';
import { Eye, Download } from 'lucide-react';
import { motion } from 'motion/react';

import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/context/AuthContext';

export default function OrderHistoryPage() {
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

  if (loading) return <LoadingSpinner fullScreen message="Loading order history..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Order History', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold">Order History</h1>
        <p className="opacity-90">View all your past orders</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState title="No orders" description="You haven't placed any orders yet" icon="Package" />
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div key={order.id} className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center bg-white dark:bg-[#1A1A1C] hover:border-[#FF6B4A]/50 transition-colors group">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white group-hover:text-[#FF6B4A] transition-colors">{order.id}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-[#FF6B4A]/10 text-[#FF6B4A]'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">₱{order.total_amount.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-[#FF6B4A] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <Eye className="h-5 w-5" />
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-[#FF6B4A] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <Download className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
