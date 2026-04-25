'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { StatCard } from '@/src/components/StatCard';
import { PartCard } from '@/src/components/PartCard';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { supabase } from '@/src/lib/supabase';
import { Part } from '@/src/types';
import Link from 'next/link';
import { ShoppingBag, Clock, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function DashboardPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('products').select('*').limit(6);
        if (error) throw error;
        setParts(data || []);
      } catch (error) {
        console.error('Error fetching featured parts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (loading) return <LoadingSpinner fullScreen message="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to Motor Parts</h1>
        <p className="opacity-90">Your one-stop shop for quality automotive parts and accessories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Orders" value="12" icon={ShoppingBag} trend={{ value: 15, isUp: true }} color="primary" />
        <StatCard label="Pending Orders" value="1" icon={Clock} color="secondary" />
        <StatCard label="Saved Items" value="8" icon={Heart} color="tertiary" />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Featured Parts</h2>
          <motion.div whileTap={{ x: 5 }}>
            <Link href="/dashboard/catalog" className="text-[#FF6B4A] hover:text-[#E55A3A] font-semibold">
              View All →
            </Link>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parts.map(part => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      </div>
    </div>
  );
}
