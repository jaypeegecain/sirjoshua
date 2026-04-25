'use client';

import { useState } from 'react';
import { useCart } from '@/src/context/CartContext';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { EmptyState } from '@/src/components/EmptyState';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { Trash2, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!user) {
      alert('Please log in to checkout.');
      return;
    }
    setIsCheckingOut(true);
    try {
      const orderNumber = `ORD-${Date.now()}`;
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: profile?.full_name || user.email,
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          shipping_address: profile?.address || 'Default Address',
          phone_number: profile?.phone_number || 'N/A'
        })
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));
      
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;
      
      // Attempt to decrement stock
      for (const item of items) {
         const { data: pData } = await supabase.from('products').select('stock').eq('id', item.id).single();
         if (pData) {
            await supabase.from('products').update({ stock: Math.max(0, pData.stock - item.quantity) }).eq('id', item.id);
         }
      }
      
      clearCart();
      setCheckoutSuccess(true);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Checkout Success', href: '#', active: true }]} />
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center border border-gray-300 dark:border-gray-700">
          <div className="flex justify-center mb-4 text-emerald-500">
            <CheckCircle className="h-16 w-16" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Your order has been placed successfully.</p>
          <Link href="/dashboard/order-history">
             <motion.button 
               whileTap={{ scale: 0.95 }}
               className="bg-[#FF6B4A] text-white px-6 py-2 rounded-lg hover:bg-[#E55A3A] font-semibold"
             >
               View Orders
             </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Cart', href: '#', active: true }]} />
        <EmptyState
          title="Your cart is empty"
          description="Start shopping to add items to your cart"
          icon="ShoppingCart"
          action={{ label: 'Continue Shopping', href: '/dashboard/catalog' }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Cart', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="opacity-90">{items.length} item(s) in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex gap-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
              <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                <p className="text-[#FF6B4A] font-bold mt-2">₱{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-4">
            <h3 className="font-bold text-lg">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (10%):</span>
                <span>₱{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-700 pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-[#FF6B4A]">₱{total.toFixed(2)}</span>
              </div>
            </div>
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-[#FF6B4A] text-white py-2 rounded-lg hover:bg-[#E55A3A] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCheckingOut ? <LoadingSpinner size="sm" /> : 'Proceed to Checkout'}
            </motion.button>
            <Link href="/dashboard/catalog" className="w-full">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                className="w-full border border-gray-300 dark:border-gray-700 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </motion.button>
            </Link>
            {items.length > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={clearCart}
                className="w-full text-sm text-red-600 hover:text-red-700 py-2"
              >
                Clear Cart
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
