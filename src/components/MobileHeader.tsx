import React from 'react';
import { Menu, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { COLORS, ORGANIZATION, ROUTES } from '@/src/lib/constants';

export function MobileHeader() {
  return (
    <header 
      className="md:hidden flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 sticky top-0 z-40 w-full"
      style={{
        backgroundColor: COLORS.SURFACE,
        borderBottomColor: COLORS.BORDER,
        borderBottomWidth: 1,
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div 
          className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border flex-shrink-0"
          style={{
            backgroundColor: COLORS.SURFACE_VARIANT,
            borderColor: COLORS.BORDER,
          }}
        >
          <img src="/logo.png" alt={ORGANIZATION.NAME} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-[11px] sm:text-[12px] font-bold tracking-[0.1em] text-white leading-tight truncate">{ORGANIZATION.NAME}</h1>
          <p className="text-[7px] sm:text-[8px] uppercase tracking-[0.15em] font-medium truncate" style={{ color: COLORS.PRIMARY }}>
            {ORGANIZATION.TAGLINE}
          </p>
        </div>
      </div>

      <Link href={ROUTES.DASHBOARD_PROFILE} className="flex-shrink-0 ml-2">
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border transition-all hover:scale-105"
          style={{
            backgroundColor: COLORS.SURFACE_VARIANT,
            borderColor: COLORS.BORDER,
            color: COLORS.ON_SURFACE_VARIANT,
          }}
        >
          <User size={18} />
        </motion.div>
      </Link>
    </header>
  );
}
