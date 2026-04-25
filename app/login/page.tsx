'use client';

import { useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roleTab, setRoleTab] = useState<'customer' | 'admin'>('customer');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      window.location.href = roleTab === 'admin' ? '/admin' : '/dashboard';
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E0E0F] px-4 font-sans">
      <div className="w-full max-w-[400px]">
        
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-10 relative group">
          <div className="absolute inset-0 bg-radial-gradient from-[#FF6B4A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="bg-[#151515] p-4 rounded-xl border border-white/5 mb-6 shadow-2xl relative z-10">
            <img src="/logo.png" alt="GECAIN" className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,107,74,0.15)]" />
          </div>
          <h1 className="text-[22px] font-bold tracking-[0.25em] text-white relative z-10 uppercase mb-2">
            GECAIN
          </h1>
          <p className="text-[10px] text-[#777] uppercase tracking-[0.3em] relative z-10 font-medium">
            Motor Shop & Accesories
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-[#121213] border border-[#1F1F21] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF6B4A] to-transparent opacity-50" />

          {/* Role Toggle */}
          <div className="flex p-1.5 bg-[#1A1A1A] rounded-xl mb-8 border border-white/5">
            <button 
              type="button"
              className={cn("flex-1 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-lg transition-all", roleTab === 'customer' ? 'bg-[#FF6B4A] text-white shadow-[0_4px_12px_rgba(255,107,74,0.25)]' : 'text-[#666] hover:text-[#aaa]')}
              onClick={() => {
                setRoleTab('customer');
                setEmail('customer@gecain.com');
                setPassword('customer123');
              }}
            >
              Customer
            </button>
            <button 
              type="button"
              className={cn("flex-1 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-lg transition-all", roleTab === 'admin' ? 'bg-[#FF6B4A] text-white shadow-[0_4px_12px_rgba(255,107,74,0.25)]' : 'text-[#666] hover:text-[#aaa]')}
              onClick={() => {
                setRoleTab('admin');
                setEmail('operator@gecain.com');
                setPassword('admin123');
              }}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-error/10 border border-error/20 text-error text-[11px] font-medium p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#555]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@gecain.com"
                  className="w-full pl-10 pr-4 py-3 border border-[#2A2A2A] rounded-xl bg-[#0A0A0A] text-white text-sm focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A]/50 transition-colors placeholder:text-[#444]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">
                Security Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#555]" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-[#2A2A2A] rounded-xl bg-[#0A0A0A] text-white text-sm focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A]/50 transition-colors placeholder:text-[#444]"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6B4A] text-white py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-[#ff7a5c] transition-colors shadow-[0_4px_15px_rgba(255,107,74,0.2)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Authenticating...' : `Log In As ${roleTab}`}
              </motion.button>
            </div>
          </form>

          {/* Create Account Link */}
          <div className="mt-8 pt-6 border-t border-[#1F1F21] text-center">
            <p className="text-[#666] text-xs">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#FF6B4A] font-bold hover:text-white transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
