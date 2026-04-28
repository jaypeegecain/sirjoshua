'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Part } from '@/src/types';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { Trash2, Plus, Edit, X, Save } from 'lucide-react';
import { useConfirm } from '@/src/components/ConfirmationDialog';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { Brand } from '@/src/types';

export default function AdminProductsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const { confirm } = useConfirm();
  const searchParams = useSearchParams();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
    image_url: '',
    description: ''
  });

  function openEdit(part: Part) {
    setEditingId(part.id);
    setNewProduct({
      sku: part.sku || '',
      name: part.name || '',
      brand: (part as any).brand || '',
      category: part.category || '',
      price: String(part.price || ''),
      stock: String(part.stock || ''),
      image_url: part.image_url || '',
      description: part.description || ''
    });
    setIsAddModalOpen(true);
  }

  useEffect(() => {
    fetchParts();
    fetchBrands();
    
    const action = searchParams.get('action');
    const brandParam = searchParams.get('brand');
    
    if (action === 'new') {
      setNewProduct(prev => ({ ...prev, brand: brandParam || '' }));
      setIsAddModalOpen(true);
      window.history.replaceState({}, '', '/admin/products');
    }
  }, [searchParams]);

  async function fetchBrands() {
    try {
      const { data, error } = await supabase.from('brands').select('*').order('name');
      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  }

  async function fetchParts() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setParts(data || []);
    } catch (error) {
      console.error('Error fetching parts:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
       title: 'Delete Product?',
       message: 'Are you sure you want to delete this product? This action cannot be undone.',
       isDangerous: true
    });
    if (!isConfirmed) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setParts(parts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete part:', error);
      alert('Failed to delete product.');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const productData = {
        sku: newProduct.sku,
        name: newProduct.name,
        brand: newProduct.brand,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        image_url: newProduct.image_url || 'https://via.placeholder.com/300',
        description: newProduct.description,
        status: parseInt(newProduct.stock, 10) > 0 ? 'in-stock' : 'out-of-stock'
      };

      if (editingId) {
        // UPDATE existing
        const { data, error } = await supabase.from('products').update(productData).eq('id', editingId).select().single();
        if (error) throw error;
        setParts(parts.map(p => p.id === editingId ? data : p));
      } else {
        // INSERT new
        const { data, error } = await supabase.from('products').insert([productData]).select().single();
        if (error) throw error;
        setParts([data, ...parts]);
      }

      setIsAddModalOpen(false);
      setEditingId(null);
      setNewProduct({ sku: '', name: '', brand: '', category: '', price: '', stock: '', image_url: '', description: '' });
    } catch (err: any) {
      console.error('Error saving product:', err);
      alert('Failed to save product: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading inventory..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Inventory', href: '#', active: true }]} />
      
      <div className="flex justify-between items-center bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <div>
          <h1 className="text-3xl font-bold mb-2">Parts Inventory</h1>
          <p className="opacity-90">Manage your product catalog</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-white text-[#FF6B4A] px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {parts.map(part => (
          <div key={part.id} className="border border-gray-300 dark:border-[#2A2A2E] rounded-xl p-5 flex flex-row items-center justify-between bg-white dark:bg-[#1A1A1C] hover:border-[#FF6B4A]/50 hover:shadow-[0_0_15px_rgba(255,107,74,0.1)] transition-all group">
            <div className="flex items-center gap-5">
              <img src={part.image_url} alt={part.name} className="w-14 h-14 rounded-lg object-cover border border-[#2A2A2E]" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white tracking-wide text-sm mb-1">{part.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-mono bg-[#2A2A2E] px-2 py-0.5 rounded text-[10px] text-[#A0A0A0]">{part.sku}</span>
                  <span>{part.category}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="font-bold text-[#FF6B4A]">₱{part.price.toLocaleString()}</p>
                <div className="flex items-center gap-2 justify-end mt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${part.stock > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                     {part.stock > 0 ? `${part.stock} IN STOCK` : 'OUT OF STOCK'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 border-l border-[#2A2A2E] pl-6">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => openEdit(part)}
                  className="w-8 h-8 flex items-center justify-center rounded bg-[#252528] text-gray-400 hover:text-white hover:bg-[#303035] transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(part.id)} 
                  className="w-8 h-8 flex items-center justify-center rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        ))}
        {parts.length === 0 && (
          <div className="col-span-full border border-dashed border-[#2A2A2E] rounded-xl p-12 flex flex-col items-center justify-center text-gray-500 bg-[#1A1A1C]/50">
            <p className="font-medium">No products found.</p>
            <p className="text-sm mt-1">Click &quot;Add Product&quot; to populate your inventory.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#121213] border border-[#2A2A2E] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-[#2A2A2E] flex justify-between items-center bg-[#1A1A1C]">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                  <p className="text-xs text-gray-500 mt-1">{editingId ? 'Update the details of this product.' : 'Fill in the details to add a part to the inventory.'}</p>
                </div>
                <button 
                  onClick={() => { setIsAddModalOpen(false); setEditingId(null); setNewProduct({ sku: '', name: '', brand: '', category: '', price: '', stock: '', image_url: '', description: '' }); }}
                  className="p-2 bg-[#2A2A2E] text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <form id="add-product-form" onSubmit={handleSaveProduct} className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Product Name</label>
                    <input 
                      required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                      placeholder="e.g. High-Performance Brake Pads"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Brand</label>
                    <select 
                      required value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                    >
                      <option value="" disabled>Select a brand</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.name}>{brand.name}</option>
                      ))}
                      {/* Fallback if brand from product is not in the list (e.g. legacy data) */}
                      {newProduct.brand && !brands.find(b => b.name === newProduct.brand) && (
                        <option value={newProduct.brand}>{newProduct.brand}</option>
                      )}
                    </select>
                    {brands.length === 0 && (
                      <p className="text-[10px] text-rose-500 mt-1 pl-1">No brands found. Manage them in Admin &gt; Brands.</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Category</label>
                    <input 
                      required type="text" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                      placeholder="e.g. Brakes"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">SKU</label>
                    <input 
                      required type="text" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors font-mono"
                      placeholder="BRM-PAD-001"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Price (₱)</label>
                    <input 
                      required type="number" min="0" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Initial Stock</label>
                    <input 
                      required type="number" min="0" step="1" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                      placeholder="100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Image URL</label>
                    <input 
                      type="url" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Description</label>
                    <textarea 
                      required rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors resize-none"
                      placeholder="Describe the product features and specifications..."
                    />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-[#2A2A2E] bg-[#1A1A1C] flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsAddModalOpen(false); setEditingId(null); setNewProduct({ sku: '', name: '', brand: '', category: '', price: '', stock: '', image_url: '', description: '' }); }}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  form="add-product-form"
                  disabled={saving}
                  className="bg-[#FF6B4A] hover:bg-[#ff8a6b] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(255,107,74,0.3)] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : <><Save className="w-4 h-4" /> {editingId ? 'Update Product' : 'Save Product'}</>}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
