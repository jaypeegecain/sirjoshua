'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { User, Mail, Phone, MapPin, Save, CheckCircle, AlertCircle, Pencil, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProfilePage() {
  const { user, profile: authProfile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    full_name: '',
    phone_number: '',
    address: '',
    city: '',
    zip_code: '',
  });

  useEffect(() => {
    if (authProfile) {
      setForm({
        full_name: authProfile.full_name || '',
        phone_number: (authProfile as any).phone_number || '',
        address: (authProfile as any).address || '',
        city: (authProfile as any).city || '',
        zip_code: (authProfile as any).zip_code || '',
      });
      setLoading(false);
    } else if (user) {
      setForm(prev => ({ ...prev, full_name: user.user_metadata?.full_name || '' }));
      setLoading(false);
    }
  }, [authProfile, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: form.full_name,
          phone_number: form.phone_number,
          address: form.address,
          city: form.city,
          zip_code: form.zip_code,
        })
        .eq('id', user!.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Profile update failed:', err);
      setErrorMsg(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values from authProfile
    setForm({
      full_name: authProfile?.full_name || '',
      phone_number: (authProfile as any)?.phone_number || '',
      address: (authProfile as any)?.address || '',
      city: (authProfile as any)?.city || '',
      zip_code: (authProfile as any)?.zip_code || '',
    });
    setIsEditing(false);
    setErrorMsg('');
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading profile..." />;

  const initials = (form.full_name || user?.email || 'U')[0].toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Profile', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-2xl">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="opacity-90 mt-1">Manage your account information</p>
      </div>

      {/* Feedback Alerts */}
      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium p-4 rounded-xl flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 shrink-0" /> {successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium p-4 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0" /> {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="md:col-span-1">
          <div className="bg-[#1A1A1C] border border-[#2A2A2E] p-6 rounded-2xl text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FF6B4A] to-[#ff8a6b] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold shadow-[0_0_30px_rgba(255,107,74,0.3)]">
              {initials}
            </div>
            <p className="font-bold text-white text-lg">{form.full_name || 'No name set'}</p>
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            <div className="mt-3">
              <span className={`text-[9px] px-3 py-1 rounded-full uppercase font-bold tracking-widest ${
                authProfile?.role === 'admin' ? 'bg-[#FF6B4A]/10 text-[#FF6B4A] border border-[#FF6B4A]/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {authProfile?.role || 'customer'}
              </span>
            </div>
          </div>
        </div>

        {/* Info Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSave}>
            <div className="bg-[#1A1A1C] border border-[#2A2A2E] rounded-2xl p-6 space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white tracking-wide">Account Information</h2>
                {!isEditing ? (
                  <motion.button type="button" whileTap={{ scale: 0.95 }} transition={{ duration: 0.08 }}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-[#FF6B4A] hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </motion.button>
                ) : (
                  <motion.button type="button" whileTap={{ scale: 0.95 }} transition={{ duration: 0.08 }}
                    onClick={handleCancel}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </motion.button>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Full Name
                </label>
                {isEditing ? (
                  <input type="text" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                    placeholder="Your full name"
                  />
                ) : (
                  <p className="text-gray-300 text-sm px-1">{form.full_name || <span className="text-gray-600 italic">Not set</span>}</p>
                )}
              </div>

              {/* Email (read-only) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <p className="text-gray-500 text-sm px-1">{user?.email}
                  <span className="ml-2 text-[9px] uppercase text-[#444] font-bold tracking-wider">(cannot change)</span>
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest flex items-center gap-1.5">
                  <Phone className="w-3 h-3" /> Phone Number
                </label>
                {isEditing ? (
                  <input type="tel" value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                    placeholder="09XX-XXX-XXXX"
                  />
                ) : (
                  <p className="text-gray-300 text-sm px-1">{form.phone_number || <span className="text-gray-600 italic">Not set</span>}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Address
                </label>
                {isEditing ? (
                  <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                    placeholder="Street address"
                  />
                ) : (
                  <p className="text-gray-300 text-sm px-1">{form.address || <span className="text-gray-600 italic">Not set</span>}</p>
                )}
              </div>

              {/* City & Zip */}
              {isEditing && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">City</label>
                    <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                      placeholder="Manila"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">ZIP Code</label>
                    <input type="text" value={form.zip_code} onChange={e => setForm({ ...form, zip_code: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#2A2A2E] rounded-xl bg-[#0A0A0B] text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
                      placeholder="1000"
                    />
                  </div>
                </div>
              )}

              {/* Save Button */}
              {isEditing && (
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.08 }}
                  disabled={saving}
                  className="w-full bg-[#FF6B4A] hover:bg-[#ff8a6b] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-2 shadow-[0_4px_15px_rgba(255,107,74,0.3)] transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="h-4 w-4" /> Save Changes</>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
