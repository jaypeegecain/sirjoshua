'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { useCart } from '@/src/context/CartContext';
import { Part } from '@/src/types';
import { supabase } from '@/src/lib/supabase';
import { ShoppingCart, Star, Truck } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchPart() {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;
        setPart(data);
      } catch (error) {
        console.error('Error fetching part:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPart();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen message="Loading product..." />;
  if (!part) return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Catalog', href: '/dashboard/catalog' },
        { label: part.name, href: '#', active: true }
      ]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg h-96">
          <img src={part.image_url} alt={part.name} className="w-full h-full object-cover rounded-lg" />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">SKU: {part.sku}</p>
            <h1 className="text-3xl font-bold mb-2">{part.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{part.brand}</p>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
              <span className="text-sm text-gray-500">(124 reviews)</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-4 rounded-lg">
            <p className="text-4xl font-bold">₱{part.price}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{part.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span>Quantity:</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2">−</button>
                <span className="px-6 py-2 border-l border-r border-gray-300 dark:border-gray-700">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2">+</button>
              </div>
            </div>

            <button
              onClick={() => addItem(part, quantity)}
              className="w-full bg-[#FF6B4A] text-white py-3 rounded-lg hover:bg-[#E55A3A] font-semibold flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-300 dark:border-gray-700">
            <div className="flex gap-3">
              <Truck className="h-5 w-5 text-[#FF6B4A] flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over ₱500</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm">Stock: {part.stock > 0 ? part.stock : 'Out of Stock'}</p>
              <p className={`text-xs ${part.status === 'in-stock' ? 'text-green-600' : 'text-red-600'}`}>
                {part.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
