'use client';

import { useState, useEffect } from 'react';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { EmptyState } from '@/src/components/EmptyState';
import { PartCard } from '@/src/components/PartCard';
import { supabase } from '@/src/lib/supabase';
import { Part } from '@/src/types';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        // Initialize an empty wishlist or get IDs from local storage if implemented later
        const savedIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (savedIds.length === 0) {
          setLoading(false);
          return;
        }
        const { data } = await supabase.from('products').select('*').in('id', savedIds);
        setWishlist(data || []);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  if (loading) return <LoadingSpinner fullScreen message="Loading wishlist..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Wishlist', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="opacity-90">{wishlist.length} item(s) saved</p>
      </div>

      {wishlist.length === 0 ? (
        <EmptyState
          title="Wishlist is empty"
          description="Save your favorite items to your wishlist"
          icon="Heart"
          action={{ label: 'Browse Catalog', href: '/dashboard/catalog' }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(part => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      )}
    </div>
  );
}
