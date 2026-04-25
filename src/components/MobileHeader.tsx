import React, { useState } from 'react';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { COLORS, ORGANIZATION, ROUTES } from '@/src/lib/constants';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
      setIsLoggingOut(false);
      setMenuOpen(false);
    }
  };

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

      {/* Profile Menu */}
      <div className="flex-shrink-0 ml-2 relative">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border transition-all hover:scale-105"
          style={{
            backgroundColor: COLORS.SURFACE_VARIANT,
            borderColor: COLORS.BORDER,
            color: COLORS.ON_SURFACE_VARIANT,
          }}
        >
          <User size={18} />
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-[#2a2a2a] rounded-lg shadow-lg z-50"
            >
              <Link 
                href={ROUTES.DASHBOARD_PROFILE}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#222] transition-colors border-b border-[#2a2a2a]"
              >
                <User size={16} />
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors",
                  isLoggingOut && "opacity-50 cursor-not-allowed"
                )}
              >
                <LogOut size={16} />
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
