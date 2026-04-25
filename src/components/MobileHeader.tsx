import React from 'react';
import { Menu, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export function MobileHeader() {
  return (
    <header className="md:hidden flex items-center justify-between px-6 py-4 bg-[#0E0E0F] border-b border-[#1F1F21] sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A1A1B] border border-[#2A2A2B]">
          <img src="/logo.png" alt="GECAIN" className="w-5 h-5 object-contain" />
        </div>
        <div>
          <h1 className="text-[11px] font-bold tracking-[0.1em] text-white leading-tight">GECAIN</h1>
          <p className="text-[7px] text-[#FF6B4A] uppercase tracking-[0.15em] font-medium">MOTOR SHOP</p>
        </div>
      </div>

      <Link href="/dashboard/profile">
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1A1A1B] border border-[#2A2A2B] text-[#888]"
        >
          <User size={18} />
        </motion.div>
      </Link>
    </header>
  );
}
