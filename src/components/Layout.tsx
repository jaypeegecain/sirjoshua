import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { MobileNav } from './MobileNav';
import { motion, AnimatePresence } from 'motion/react';
import { COLORS, ORGANIZATION } from '@/src/lib/constants';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className="flex flex-col md:flex-row min-h-screen text-gray-300 font-sans"
      style={{
        backgroundColor: COLORS.BACKGROUND,
      }}
    >
      <MobileHeader />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 overflow-y-auto custom-scrollbar pb-24 md:pb-10">
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

              {/* Footer - Responsive Grid */}
              <footer className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div>
                  <h4 className="text-[#A0A0A0] font-bold text-sm md:text-base lg:text-lg tracking-tight mb-2 flex items-center gap-1">
                    {ORGANIZATION.NAME}<span className="text-white"> {ORGANIZATION.TAGLINE}</span>
                  </h4>
                  <p className="text-xs md:text-sm text-[#555] leading-relaxed pr-2 md:pr-4">
                    {ORGANIZATION.DESCRIPTION}
                  </p>
                </div>
                <div>
                  <h5 className="text-[8px] md:text-[9px] font-bold tracking-[0.2em] text-[#FF6B4A] uppercase mb-3 md:mb-4">Portals & Links</h5>
                  <ul className="space-y-2 text-[10px] md:text-[11px] font-medium text-[#777]">
                    <li className="hover:text-white cursor-pointer transition-colors">Catalog Support</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Technical Docs</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Shipping Updates</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-[8px] md:text-[9px] font-bold tracking-[0.2em] text-[#FF6B4A] uppercase mb-3 md:mb-4">Legal Control</h5>
                  <ul className="space-y-2 text-[10px] md:text-[11px] font-medium text-[#777]">
                    <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Compliance Audit</li>
                  </ul>
                </div>
                <div className="text-right flex flex-col sm:flex-col items-start sm:items-end justify-between gap-3">
                  <p className="text-[9px] md:text-[10px] text-[#555] leading-tight">
                    &copy; {ORGANIZATION.COPYRIGHT_YEAR} {ORGANIZATION.FULL_NAME}. All rights reserved.
                  </p>
                  <div className="flex gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center text-[10px] text-gray-500 hover:bg-[#2A2A2A] transition-colors cursor-pointer">G</span>
                    <span className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center text-[10px] text-gray-500 hover:bg-[#2A2A2A] transition-colors cursor-pointer">S</span>
                  </div>
                </div>
              </footer>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
