import React from 'react';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0B] text-gray-300 font-sans selection:bg-[#FF6B4A]/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-10 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
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

              {/* Footer */}
              <footer className="mt-16 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="text-[#A0A0A0] font-bold text-lg tracking-tight mb-2 flex items-center gap-1">
                    GECAIN<span className="text-white"> MOTOR SHOP</span>
                  </h4>
                  <p className="text-xs text-[#555] leading-relaxed pr-4">
                    Your premier source for high-quality motorcycle parts and motor accessories.
                    Built for performance, reliability, and precision on the road.
                  </p>
                </div>
                <div>
                  <h5 className="text-[9px] font-bold tracking-[0.2em] text-[#FF6B4A] uppercase mb-4">Portals & Links</h5>
                  <ul className="space-y-2 text-[11px] font-medium text-[#777]">
                    <li className="hover:text-white cursor-pointer transition-colors">Catalog Support</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Technical Docs</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Shipping Updates</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-[9px] font-bold tracking-[0.2em] text-[#FF6B4A] uppercase mb-4">Legal Control</h5>
                  <ul className="space-y-2 text-[11px] font-medium text-[#777]">
                    <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Compliance Audit</li>
                  </ul>
                </div>
                <div className="text-right flex items-start justify-end gap-3">
                  <p className="text-[10px] text-[#555] max-w-[150px] leading-tight flex-1 text-right">
                    &copy; 2026 GECAIN MOTOR SHOP & ACCESORIES. All rights reserved.
                  </p>
                  <div className="flex gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center text-[10px] text-gray-500">G</span>
                    <span className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center text-[10px] text-gray-500">S</span>
                  </div>
                </div>
              </footer>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
