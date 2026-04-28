'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { EmptyState } from '@/src/components/EmptyState';
import { Search, Plus, X, Save, Trash2, Tag, Edit } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/src/lib/supabase';
import { Brand } from '@/src/types';
import { RefreshCw } from 'lucide-react';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => { fetchBrands(); }, []);

  async function fetchBrands() {
    try {
      const { data, error } = await supabase.from('brands').select('*').order('name');
      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  }

  function openEdit(brand: any) {
    setEditingId(brand.id);
    setForm({ name: brand.name, description: brand.description || '' });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ name: '', description: '' });
  }

  async function handleSaveBrand(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const { data, error } = await supabase.from('brands').update({ name: form.name, description: form.description }).eq('id', editingId).select().single();
        if (error) throw error;
        setBrands(brands.map(b => b.id === editingId ? data : b).sort((a, b) => a.name.localeCompare(b.name)));
      } else {
        const { data, error } = await supabase.from('brands').insert([{ name: form.name, description: form.description }]).select().single();
        if (error) throw error;
        setBrands([...brands, data].sort((a, b) => a.name.localeCompare(b.name)));
      }
      closeModal();
    } catch (err: any) {
      alert('Failed to save brand: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteBrand(id: string, name: string) {
    if (!confirm(`Delete brand "${name}"? This cannot be undone.`)) return;
    try {
      const { error } = await supabase.from('brands').delete().eq('id', id);
      if (error) throw error;
      setBrands(brands.filter(b => b.id !== id));
    } catch (err: any) {
      alert('Failed to delete brand: ' + err.message);
    }
  }

  async function handleSyncBrands() {
    setSyncing(true);
    try {
      // Fetch all unique brand names from products
      const { data: productBrands, error: productError } = await supabase.from('products').select('brand');
      if (productError) throw productError;

      const uniqueBrands = Array.from(new Set(productBrands?.map(p => p.brand).filter(Boolean)));
      
      // Fetch existing brands to avoid duplicates
      const { data: existingBrands, error: existingError } = await supabase.from('brands').select('name');
      if (existingError) throw existingError;
      
      const existingNames = new Set(existingBrands?.map(b => b.name));
      const brandsToInsert = uniqueBrands.filter(name => !existingNames.has(name)).map(name => ({ name }));

      if (brandsToInsert.length === 0) {
        alert('All brands from products are already in the system.');
        return;
      }

      const { error: insertError } = await supabase.from('brands').insert(brandsToInsert);
      if (insertError) throw insertError;

      alert(`Successfully synced ${brandsToInsert.length} brands from products!`);
      fetchBrands();
    } catch (error: any) {
      alert('Sync failed: ' + error.message);
    } finally {
      setSyncing(false);
    }
  }

  const filtered = brands.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <LoadingSpinner fullScreen message="Loading brands..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Brands', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Brand Management</h1>
        <p className="opacity-90">Manage product brands</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#2A2A2E] rounded-lg bg-[#1A1A1C] text-white focus:outline-none focus:border-[#FF6B4A] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleSyncBrands}
            disabled={syncing}
            className="bg-[#1A1A1C] border border-[#2A2A2E] text-gray-400 px-4 py-2 rounded-lg hover:text-white hover:border-[#FF6B4A]/50 font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
            title="Populate brands from existing products"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} /> {syncing ? 'Syncing...' : 'Sync from Products'}
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FF6B4A] text-white px-6 py-2 rounded-lg hover:bg-[#E55A3A] font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Brand
          </motion.button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No brands found" description="Click 'Add Brand' to create one" icon="Tag" />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((brand: any) => (
            <div key={brand.id} className="border border-[#2A2A2E] rounded-xl p-5 bg-[#1A1A1C] hover:border-[#FF6B4A]/50 transition-colors group relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-[#FF6B4A]/10 flex items-center justify-center border border-[#FF6B4A]/20">
                    <Tag className="w-4 h-4 text-[#FF6B4A]" />
                  </div>
                  <h3 className="font-bold text-white text-lg">{brand.name}</h3>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(brand)}
                    className="p-1.5 rounded text-[#FF6B4A]/50 hover:text-[#FF6B4A] hover:bg-[#FF6B4A]/10 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(brand.id, brand.name)}
                    className="p-1.5 rounded text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 ml-12">{brand.description || 'No description provided.'}</p>
              <div className="mt-4 pt-4 border-t border-[#2A2A2E] flex justify-end">
                <Link 
                  href={`/admin/products?brand=${encodeURIComponent(brand.name)}&action=new`}
                  className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B4A] hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Brand Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-[#121213] border border-[#2A2A2E] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-[#2A2A2E] flex justify-between items-center bg-[#1A1A1C]">
                <div>
                  <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Brand' : 'Add New Brand'}</h2>
                  <p className="text-xs text-gray-500 mt-1">{editingId ? 'Update brand details.' : 'Create a brand to group your products.'}</p>
                </div>
                <button onClick={closeModal} className="p-2 bg-[#2A2A2E] text-gray-400 hover:text-white rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveBrand} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Brand Name</label>
                  <input
                    required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                    placeholder="e.g. Brembo"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Description</label>
                  <textarea
                    rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors resize-none"
                    placeholder="Short description of the brand..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                    Cancel
                  </button>
                  <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={saving} className="bg-[#FF6B4A] hover:bg-[#ff8a6b] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving...' : <><Save className="w-4 h-4" /> {editingId ? 'Update Brand' : 'Save Brand'}</>}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
