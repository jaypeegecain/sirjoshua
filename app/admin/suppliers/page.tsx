'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { Search, Plus, X, Save, Trash2, Truck, Phone, Mail, MapPin, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/src/lib/supabase';

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', contact_person: '', email: '', phone: '', address: '' });

  useEffect(() => { fetchSuppliers(); }, []);

  async function fetchSuppliers() {
    try {
      const { data, error } = await supabase.from('suppliers').select('*').order('name');
      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  }

  function openEdit(supplier: any) {
    setEditingId(supplier.id);
    setForm({
      name: supplier.name,
      contact_person: supplier.contact_person || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || ''
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ name: '', contact_person: '', email: '', phone: '', address: '' });
  }

  async function handleSaveSupplier(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const { data, error } = await supabase.from('suppliers').update(form).eq('id', editingId).select().single();
        if (error) throw error;
        setSuppliers(suppliers.map(s => s.id === editingId ? data : s).sort((a, b) => a.name.localeCompare(b.name)));
      } else {
        const { data, error } = await supabase.from('suppliers').insert([form]).select().single();
        if (error) throw error;
        setSuppliers([...suppliers, data].sort((a, b) => a.name.localeCompare(b.name)));
      }
      closeModal();
    } catch (err: any) {
      alert('Failed to save supplier: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSupplier(id: string, name: string) {
    if (!confirm(`Delete supplier "${name}"? This cannot be undone.`)) return;
    try {
      const { error } = await supabase.from('suppliers').delete().eq('id', id);
      if (error) throw error;
      setSuppliers(suppliers.filter(s => s.id !== id));
    } catch (err: any) {
      alert('Failed to delete supplier: ' + err.message);
    }
  }

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.contact_person || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullScreen message="Loading suppliers..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Suppliers', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Supplier Management</h1>
        <p className="opacity-90">Manage your suppliers and vendors</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#2A2A2E] rounded-lg bg-[#1A1A1C] text-white focus:outline-none focus:border-[#FF6B4A] transition-colors"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF6B4A] text-white px-6 py-2 rounded-lg hover:bg-[#E55A3A] font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Supplier
        </motion.button>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-[#2A2A2E] rounded-xl p-12 flex flex-col items-center justify-center text-gray-500">
          <Truck className="w-10 h-10 mb-3 text-[#333]" />
          <p className="font-medium">No suppliers found</p>
          <p className="text-sm mt-1">Click "Add Supplier" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((supplier: any) => (
            <div key={supplier.id} className="border border-[#2A2A2E] rounded-xl p-5 bg-[#1A1A1C] hover:border-[#FF6B4A]/50 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-[#FF6B4A]" />
                  </div>
                  <h3 className="font-bold text-white text-lg">{supplier.name}</h3>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(supplier)}
                    className="p-1.5 rounded text-[#FF6B4A]/50 hover:text-[#FF6B4A] hover:bg-[#FF6B4A]/10 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSupplier(supplier.id, supplier.name)}
                    className="p-1.5 rounded text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5 text-sm pl-13">
                {supplier.contact_person && (
                  <p className="text-gray-400 flex items-center gap-2"><span className="text-[#555]">👤</span> {supplier.contact_person}</p>
                )}
                {supplier.email && (
                  <p className="text-gray-400 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#555]" /> {supplier.email}</p>
                )}
                {supplier.phone && (
                  <p className="text-gray-400 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#555]" /> {supplier.phone}</p>
                )}
                {supplier.address && (
                  <p className="text-gray-400 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#555]" /> {supplier.address}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Supplier Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-[#121213] border border-[#2A2A2E] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-[#2A2A2E] flex justify-between items-center bg-[#1A1A1C]">
                <div>
                  <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                  <p className="text-xs text-gray-500 mt-1">{editingId ? 'Update supplier details.' : 'Enter the supplier details.'}</p>
                </div>
                <button onClick={closeModal} className="p-2 bg-[#2A2A2E] text-gray-400 hover:text-white rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveSupplier} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Company Name</label>
                  <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                    placeholder="e.g. Parts World Co."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Contact Person</label>
                  <input type="text" value={form.contact_person} onChange={e => setForm({ ...form, contact_person: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                    placeholder="e.g. Maria Santos"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                      placeholder="supplier@email.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Phone</label>
                    <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                      placeholder="09XX-XXX-XXXX"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Address</label>
                  <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                    placeholder="Warehouse address..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                    Cancel
                  </button>
                  <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={saving} className="bg-[#FF6B4A] hover:bg-[#ff8a6b] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving...' : <><Save className="w-4 h-4" /> {editingId ? 'Update Supplier' : 'Save Supplier'}</>}
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
