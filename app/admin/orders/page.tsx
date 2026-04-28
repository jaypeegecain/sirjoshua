'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { supabase } from '@/src/lib/supabase';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { EmptyState } from '@/src/components/EmptyState';
import { Search, Eye, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    setUpdating(orderId);
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  }

  async function openOrderDetails(order: any) {
    setSelectedOrder(order);
    setLoadingItems(true);
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*, products(name, image_url, sku)')
        .eq('order_id', order.id);
      if (error) throw error;
      setOrderItems(data || []);
    } catch (err) {
      console.error('Error fetching order items:', err);
      setOrderItems([]);
    } finally {
      setLoadingItems(false);
    }
  }

  const filtered = orders.filter(o =>
    (o.order_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullScreen message="Loading orders..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Orders', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="opacity-90">View and manage all customer orders</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order # or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#2A2A2E] rounded-lg bg-[#1A1A1C] text-white focus:outline-none focus:border-[#FF6B4A] transition-colors"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No orders" description="Orders will appear here" icon="Package" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((order: any) => (
            <div key={order.id} className="border border-[#2A2A2E] rounded-xl p-5 flex flex-row items-center justify-between bg-[#1A1A1C] hover:border-[#FF6B4A]/50 transition-colors group relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF6B4A] to-[#FF8A6B] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  Order {order.order_number}
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    disabled={updating === order.id}
                    className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold cursor-pointer outline-none border transition-colors ${
                      order.status === 'completed' || order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      order.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}
                  >
                    <option value="pending" className="bg-[#1A1A1C] text-amber-500">PENDING</option>
                    <option value="processing" className="bg-[#1A1A1C] text-blue-400">PROCESSING</option>
                    <option value="shipped" className="bg-[#1A1A1C] text-blue-400">SHIPPED</option>
                    <option value="delivered" className="bg-[#1A1A1C] text-emerald-500">DELIVERED</option>
                    <option value="completed" className="bg-[#1A1A1C] text-emerald-500">COMPLETED</option>
                    <option value="cancelled" className="bg-[#1A1A1C] text-rose-500">CANCELLED</option>
                  </select>
                  {updating === order.id && <span className="text-[10px] text-gray-500 animate-pulse">Saving...</span>}
                </h3>
                <p className="text-xs font-medium text-gray-500 mt-1">
                  Placed on {new Date(order.created_at).toLocaleDateString()} &bull; {order.customer_name} &bull; {order.phone_number}
                </p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Method: {order.payment_method} &bull; Payment: {order.payment_status}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold font-mono text-[#FF6B4A]">
                  ₱{(order.total_amount || 0).toLocaleString()}
                </p>
                <div className="mt-2 flex border-t border-[#2A2A2E] pt-2 md:border-none md:pt-0">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openOrderDetails(order)}
                    className="text-xs font-semibold uppercase tracking-wider text-[#FF6B4A] hover:text-white transition-colors flex items-center gap-1.5 ml-auto"
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </motion.button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-2xl bg-[#121213] border border-[#2A2A2E] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              
              <div className="p-6 border-b border-[#2A2A2E] flex justify-between items-start bg-[#1A1A1C]">
                <div>
                  <h2 className="text-xl font-bold text-white">Order {selectedOrder.order_number}</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-[#2A2A2E] text-gray-400 hover:text-white rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1A1A1C] rounded-xl p-4 border border-[#2A2A2E]">
                    <p className="text-[10px] text-[#666] uppercase tracking-widest font-bold mb-2">Customer</p>
                    <p className="text-white font-semibold text-sm">{selectedOrder.customer_name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{selectedOrder.phone_number}</p>
                  </div>
                  <div className="bg-[#1A1A1C] rounded-xl p-4 border border-[#2A2A2E]">
                    <p className="text-[10px] text-[#666] uppercase tracking-widest font-bold mb-2">Payment</p>
                    <p className="text-white font-semibold text-sm capitalize">{selectedOrder.payment_method}</p>
                    <p className={`text-xs mt-0.5 font-semibold ${selectedOrder.payment_status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {selectedOrder.payment_status?.toUpperCase()}
                    </p>
                  </div>
                  {selectedOrder.shipping_address && (
                    <div className="col-span-2 bg-[#1A1A1C] rounded-xl p-4 border border-[#2A2A2E]">
                      <p className="text-[10px] text-[#666] uppercase tracking-widest font-bold mb-2">Shipping Address</p>
                      <p className="text-white text-sm">{selectedOrder.shipping_address}</p>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div>
                  <p className="text-[10px] text-[#666] uppercase tracking-widest font-bold mb-3">Items Ordered</p>
                  {loadingItems ? (
                    <div className="flex items-center justify-center py-8 text-gray-500 gap-3">
                      <div className="w-5 h-5 border-2 border-[#FF6B4A]/30 border-t-[#FF6B4A] rounded-full animate-spin" />
                      Loading items...
                    </div>
                  ) : orderItems.length === 0 ? (
                    <div className="border border-dashed border-[#2A2A2E] rounded-xl p-8 text-center text-gray-500">
                      <Package className="w-8 h-8 mx-auto mb-2 text-[#333]" />
                      <p className="text-sm">No item details available</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orderItems.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-[#1A1A1C] rounded-xl border border-[#2A2A2E]">
                          {item.products?.image_url && (
                            <img src={item.products.image_url} alt={item.products?.name} className="w-12 h-12 rounded-lg object-cover border border-[#2A2A2E]" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{item.products?.name || 'Unknown Product'}</p>
                            {item.products?.sku && <p className="text-[10px] text-gray-500 font-mono">{item.products.sku}</p>}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[#FF6B4A] font-bold text-sm">₱{Number(item.price_at_purchase || item.unit_price || 0).toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-[#2A2A2E] bg-[#1A1A1C] flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[#666] uppercase tracking-widest font-bold">Order Total</p>
                  <p className="text-2xl font-bold font-mono text-[#FF6B4A]">₱{(selectedOrder.total_amount || 0).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="px-6 py-2.5 bg-[#2A2A2E] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
