'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Settings2, ShoppingCart, Truck, BarChart3, Settings, LogOut, Plus,
  ShieldCheck, Loader2, Factory, MessageSquare
} from 'lucide-react';
import { cn, formatPrice } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'motion/react';

export function AdminSidebar() {
  const { signOut, profile } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();


  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Settings2, label: 'Parts Inventory', path: '/admin/products' },
    { icon: Factory, label: 'Brands', path: '/admin/brands' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Truck, label: 'Suppliers', path: '/admin/suppliers' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: MessageSquare, label: 'Feedback', path: '/admin/feedback' },
  ];

  return (
    <>
      <aside className="w-[260px] bg-[#0E0E0F] border-r border-[#1F1F21] flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-8 pb-6 flex flex-col items-center border-b border-[#1F1F21] relative overflow-hidden group">
          <div className="absolute inset-0 bg-radial-gradient from-[#FF6B4A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <img src="/logo.png" alt="GECAIN" className="w-24 h-24 object-contain mb-4 relative z-10 drop-shadow-[0_0_15px_rgba(255,107,74,0.1)]" />
          <h1 className="text-[13px] font-bold tracking-[0.15em] text-white relative z-10">GECAIN</h1>
          <p className="text-[8px] text-[#888] uppercase tracking-[0.25em] mt-1.5 relative z-10">MOTOR SHOP &amp; ACCESORIES</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.path === '/admin'
                ? pathname === '/admin' || pathname === '/admin/'
                : pathname.startsWith(item.path);

              return (
                <motion.div key={item.path} whileTap={{ scale: 0.97 }} transition={{ duration: 0.08, ease: 'easeOut' }} className="w-full">
                  <Link
                    href={item.path}
                    onClick={() => {}}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded transition-all duration-200 text-[11px] font-bold uppercase tracking-[0.15em]",
                      isActive
                        ? "bg-[#222] text-white border-r-2 border-[#FF6B4A]"
                        : "text-[#666] hover:text-[#aaa] hover:bg-[#151515]"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive ? "text-[#FF6B4A]" : "text-[#777]")} />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <div className="mt-8">
            <motion.button
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.08, ease: 'easeOut' }}
              onClick={() => {
                router.push('/admin/products');
              }}
              className="w-full bg-[#FF6B4A] text-white py-3 rounded-lg font-bold text-[10px] tracking-[0.2em] shadow-[0_4px_15px_rgba(255,107,74,0.2)] hover:shadow-[0_6px_20px_rgba(255,107,74,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] uppercase"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Add New Part
            </motion.button>
          </div>
        </div>

        <div className="p-4 bg-[#141414] border-t border-[#2a2a2a]">
          {profile && (
            <div className="mb-4 p-3 rounded-xl bg-[#1d1d1d] border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF6B4A] border border-white/10 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                {profile.full_name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white truncate">{profile.full_name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                  <p className="text-[9px] text-[#FF6B4A] font-bold uppercase tracking-widest">Operator</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Link
              href="/admin/settings"
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-[11px] font-bold uppercase tracking-widest",
                pathname === '/admin/settings' ? "bg-[#252525] text-white" : "text-[#777] hover:text-[#ccc] hover:bg-[#202020]"
              )}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.08, ease: 'easeOut' }}
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-[11px] font-bold uppercase tracking-widest text-[#777] hover:text-rose-400 hover:bg-rose-500/5 disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#FF6B4A]" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              {isLoggingOut ? 'Leaving...' : 'Sign Out'}
            </motion.button>
          </div>
        </div>
      </aside>

    </>
  );
}
