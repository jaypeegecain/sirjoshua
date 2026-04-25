'use client';

import { useState, useEffect } from 'react';
import { PartCard } from '@/src/components/PartCard';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { EmptyState } from '@/src/components/EmptyState';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { Search, Filter } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { Part } from '@/src/types';
import { motion } from 'motion/react';

export default function CatalogPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchParts() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setParts(data || []);
        setFilteredParts(data || []);
      } catch (error) {
        console.error('Error fetching parts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchParts();
  }, []);

  useEffect(() => {
    let filtered = parts;

    if (searchTerm) {
      filtered = filtered.filter(part =>
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(part => part.category === selectedCategory);
    }

    setFilteredParts(filtered);
  }, [searchTerm, selectedCategory, parts]);

  const categories = Array.from(new Set(parts.map(p => p.category)));

  if (loading) return <LoadingSpinner fullScreen message="Loading parts catalog..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Catalog', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Parts Catalog</h1>
        <p className="opacity-90">Browse our extensive collection of automotive parts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search parts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5" />
              <h3 className="font-semibold">Categories</h3>
            </div>
            <div className="space-y-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg ${!selectedCategory ? 'bg-[#FF6B4A] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                All Categories
              </motion.button>
              {categories.map(category => (
                <motion.button
                  key={category}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg ${selectedCategory === category ? 'bg-[#FF6B4A] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          {filteredParts.length === 0 ? (
            <EmptyState
              title="No parts found"
              description="Try adjusting your search or filter criteria"
              icon="Package"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParts.map(part => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
