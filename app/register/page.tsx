'use client';

import { useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signUp(email, password, fullName);
      setSuccess(true);
      // Wait a moment before redirecting
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E0E0F] px-4 font-sans py-12">
      <div className="w-full max-w-[400px]">
        
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8 relative group">
          <div className="absolute inset-0 bg-radial-gradient from-[#FF6B4A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="bg-[#151515] p-3 rounded-xl border border-white/5 mb-4 shadow-2xl relative z-10">
            <img src="/logo.png" alt="GECAIN" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(255,107,74,0.15)]" />
          </div>
          <h1 className="text-lg font-bold tracking-[0.25em] text-white relative z-10 uppercase mb-1">
            GECAIN
          </h1>
          <p className="text-[9px] text-[#777] uppercase tracking-[0.3em] relative z-10 font-medium">
            Create Account
          </p>
        </div>

        {/* Register Form Container */}
        <div className="bg-[#121213] border border-[#1F1F21] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF6B4A] to-transparent opacity-50" />

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#FF6B4A]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF6B4A]/20">
                <User className="w-8 h-8 text-[#FF6B4A]" />
              </div>
              <h2 className="text-white font-bold tracking-widest uppercase mb-2">Registration Successful</h2>
              <p className="text-[#888] text-xs">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-error/10 border border-error/20 text-error text-[11px] font-medium p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-[#555]" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="w-full pl-10 pr-4 py-3 border border-[#2A2A2A] rounded-xl bg-[#0A0A0A] text-white text-sm focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A]/50 transition-colors placeholder:text-[#444]"
                    required
                  />
                </div>
              </div>
              
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
                    placeholder="customer@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-[#2A2A2A] rounded-xl bg-[#0A0A0A] text-white text-sm focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A]/50 transition-colors placeholder:text-[#444]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">
                  Password
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
                    minLength={6}
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
                  {loading ? 'Registering...' : 'Create Account'}
                </motion.button>
              </div>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-[#1F1F21] text-center">
            <p className="text-[#666] text-xs">
              Already have an account?{' '}
              <Link href="/login" className="text-[#FF6B4A] font-bold hover:text-white transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
