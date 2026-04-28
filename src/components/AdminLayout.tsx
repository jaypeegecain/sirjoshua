import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor } from 'lucide-react';

export function AdminLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex min-h-screen bg-[#0A0A0B] text-gray-300 font-sans selection:bg-[#FF6B4A]/30 relative flex-col">
      {/* Desktop-Only Gate — blocks access on screens below 1024px */}
      <div className="fixed inset-0 z-[9999] bg-[#0A0A0B] flex flex-col items-center justify-center p-8 text-center lg:hidden">
        <div className="w-20 h-20 rounded-2xl bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 flex items-center justify-center mb-6">
          <Monitor className="w-10 h-10 text-[#FF6B4A]" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Desktop Only</h1>
        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
          The Admin Console is optimized for desktop workstations. Please access this page from a device with a screen width of at least 1024px.
        </p>
        <div className="mt-8 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-pulse" />
          <span className="text-[10px] text-[#FF6B4A] font-bold uppercase tracking-widest">GECAIN Command Center</span>
        </div>
      </div>

      {/* Top Strategy Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF8C70] via-[#FF6B4A] to-[#FF5A33] shadow-[0_0_15px_rgba(255,107,74,0.3)] z-[100]" />
      
      <div className="flex flex-1 min-h-0">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-10 overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1">
                {children}
              </div>

              <footer className="mt-16 pt-8 border-t border-white/5 grid grid-cols-4 gap-8">
                <div>
                  <h4 className="text-[#A0A0A0] font-bold text-lg tracking-tight mb-2 flex items-center gap-1">
                    GECAIN<span className="text-white"> MOTOR SHOP</span>
                  </h4>
                  <p className="text-xs text-[#555] leading-relaxed pr-4">
                    The ultimate destination for precision motorcycle parts and premium accessories.
                    Engineered for reliability and absolute control over your fleet's logistics.
                  </p>
                </div>
                <div>
                  <h5 className="text-[9px] font-bold tracking-[0.2em] text-[#FF6B4A] uppercase mb-4">Internal Links</h5>
                  <ul className="space-y-2 text-[11px] font-medium text-[#777]">
                    <motion.li whileTap={{ x: 5 }} className="hover:text-white cursor-pointer transition-colors">OEM Documentation</motion.li>
                    <motion.li whileTap={{ x: 5 }} className="hover:text-white cursor-pointer transition-colors">Supplier Portal</motion.li>
                    <motion.li whileTap={{ x: 5 }} className="hover:text-white cursor-pointer transition-colors">Shipping Info</motion.li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-[9px] font-bold tracking-[0.2em] text-[#FF6B4A] uppercase mb-4">Legal Control</h5>
                  <ul className="space-y-2 text-[11px] font-medium text-[#777]">
                    <motion.li whileTap={{ x: 5 }} className="hover:text-white cursor-pointer transition-colors">Privacy Policy</motion.li>
                    <motion.li whileTap={{ x: 5 }} className="hover:text-white cursor-pointer transition-colors">Terms of Service</motion.li>
                    <motion.li whileTap={{ x: 5 }} className="hover:text-white cursor-pointer transition-colors">Compliance Audit</motion.li>
                  </ul>
                </div>
                <div className="text-right flex items-start justify-end gap-3">
                  <p className="text-[10px] text-[#555] max-w-[150px] leading-tight flex-1 text-right">
                    &copy; 2026 GECAIN MOTOR SHOP & ACCESORIES. Built for the high-stakes environment.
                  </p>
                  {
                  }
                  <div className="flex gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center text-[10px] text-gray-500">G</span>
                    <span className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center text-[10px] text-gray-500">D</span>
                  </div>
                </div>
              </footer>
            </motion.div>
          </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
