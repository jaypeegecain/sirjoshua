'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { Search, Plus, X, Save, Trash2, User, Shield, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/src/lib/supabase';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'customer' });

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  function openEdit(user: any) {
    setEditingId(user.id);
    setForm({
      email: user.email || '',
      password: '', // Password cannot be edited from here
      full_name: user.full_name || '',
      role: user.role || 'customer'
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ email: '', password: '', full_name: '', role: 'customer' });
  }

  async function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        // UPDATE profile only (email/password require different flow)
        const { error } = await supabase
          .from('user_profiles')
          .update({ full_name: form.full_name, role: form.role })
          .eq('id', editingId);
        if (error) throw error;
        
        setUsers(users.map(u => u.id === editingId ? { ...u, full_name: form.full_name, role: form.role } : u));
        closeModal();
      } else {
        // CREATE new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: form.email.toLowerCase().trim(),
          password: form.password,
          options: { data: { full_name: form.full_name, role: form.role } }
        });
        if (authError) throw authError;

        // The profile is created automatically by a trigger usually, 
        // but if not, we wait or fetch.
        await fetchUsers();
        closeModal();
        alert('User created successfully! They will need to confirm their email before logging in.');
      }
    } catch (err: any) {
      alert('Failed to save user: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteUser(id: string, name: string) {
    if (!confirm(`Delete user "${name}"? This will remove their profile.`)) return;
    try {
      const { error } = await supabase.from('user_profiles').delete().eq('id', id);
      if (error) throw error;
      setUsers(users.filter(u => u.id !== id));
    } catch (err: any) {
      alert('Failed to delete user: ' + err.message);
    }
  }

  const filtered = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullScreen message="Loading users..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Users', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="opacity-90">Manage customer accounts and permissions</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
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
          <Plus className="h-4 w-4" /> Add User
        </motion.button>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-[#2A2A2E] rounded-xl p-12 flex flex-col items-center justify-center text-gray-500">
          <User className="w-10 h-10 mb-3 text-[#333]" />
          <p className="font-medium">No users found</p>
          <p className="text-sm mt-1">Click "Add User" to create a new account</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((user: any) => (
            <div key={user.id} className="border border-[#2A2A2E] rounded-xl p-4 bg-[#1A1A1C] hover:border-[#FF6B4A]/50 transition-colors group flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 flex items-center justify-center text-[#FF6B4A] font-bold text-sm">
                  {(user.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-sm">{user.full_name || 'Unnamed User'}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${user.role === 'admin' ? 'bg-[#FF6B4A]/10 text-[#FF6B4A] border border-[#FF6B4A]/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                      {user.role || 'customer'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(user)}
                  className="p-2 rounded text-[#FF6B4A]/50 hover:text-[#FF6B4A] hover:bg-[#FF6B4A]/10 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id, user.full_name || user.email)}
                  className="p-2 rounded text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-[#121213] border border-[#2A2A2E] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-[#2A2A2E] flex justify-between items-center bg-[#1A1A1C]">
                <div>
                  <h2 className="text-xl font-bold text-white">{editingId ? 'Edit User' : 'Add New User'}</h2>
                  <p className="text-xs text-gray-500 mt-1">{editingId ? 'Update user details.' : 'Create a new customer or admin account.'}</p>
                </div>
                <button onClick={closeModal} className="p-2 bg-[#2A2A2E] text-gray-400 hover:text-white rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Full Name</label>
                  <input required type="text" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                    placeholder="Juan Dela Cruz"
                  />
                </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Email Address</label>
                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      disabled={!!editingId}
                      className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors disabled:opacity-50"
                      placeholder="user@example.com"
                    />
                  </div>
                  {!editingId && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Password</label>
                      <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} minLength={6}
                        className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                        placeholder="Min. 6 characters"
                      />
                    </div>
                  )}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['customer', 'admin'].map(r => (
                      <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                        className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border ${form.role === r ? 'bg-[#FF6B4A] text-white border-[#FF6B4A]' : 'bg-[#1A1A1C] text-gray-400 border-[#2A2A2E] hover:border-[#FF6B4A]/50'}`}
                      >
                        {r === 'admin' ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                    Cancel
                  </button>
                  <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={saving} className="bg-[#FF6B4A] hover:bg-[#ff8a6b] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving...' : <><Save className="w-4 h-4" /> {editingId ? 'Update User' : 'Create User'}</>}
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
