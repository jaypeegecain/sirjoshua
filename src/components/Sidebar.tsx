import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Package, ShoppingCart, History, HelpCircle,
  LogOut, Heart, Loader2, User, MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';

export function Sidebar() {
  const { user, profile, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const { totalItems } = useCart();
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
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Parts Catalog', path: '/dashboard/catalog' },
    { icon: ShoppingCart, label: 'My Cart', path: '/dashboard/cart', badge: totalItems > 0 ? totalItems : null },
    { icon: History, label: 'My Orders', path: '/dashboard/orders' },
    { icon: Heart, label: 'Wishlist', path: '/dashboard/wishlist' },
    { icon: HelpCircle, label: 'Support Center', path: '/dashboard/support' },
    { icon: MessageSquare, label: 'Feedback', path: '/dashboard/feedback' },
  ];

  return (
    <aside className="hidden md:flex w-[260px] bg-[#0E0E0F] border-r border-[#1F1F21] flex-col h-screen sticky top-0 shrink-0">
      <div className="p-8 pb-4 flex flex-col items-center border-b border-[#1F1F21] mb-4 relative overflow-hidden group">
        <div className="absolute inset-0 bg-radial-gradient from-[#FF6B4A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <img src="/logo.png" alt="GECAIN" className="w-20 h-20 object-contain mb-4 relative z-10 drop-shadow-[0_0_15px_rgba(255,107,74,0.1)]" />
        <h1 className="text-[13px] font-bold tracking-[0.15em] text-white relative z-10">GECAIN</h1>
        <p className="text-[8px] text-[#888] uppercase tracking-[0.25em] mt-1.5 relative z-10">MOTOR SHOP & ACCESORIES</p>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto no-scrollbar">
        <div className="text-[9px] font-bold text-[#444] uppercase tracking-[0.2em] px-4 mb-4">Navigation</div>
        {navItems.map((item) => {
          const isActive = item.path === '/dashboard' 
            ? pathname === '/dashboard' 
            : pathname.startsWith(item.path);

          return (
            <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.08, ease: 'easeOut' }} key={item.path}>
              <Link
                href={item.path}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded transition-all duration-200 text-[11px] font-bold uppercase tracking-[0.15em] group",
                  isActive 
                    ? "bg-[#222] text-white border-r-2 border-[#FF6B4A]" 
                    : "text-[#666] hover:text-[#aaa] hover:bg-[#151515]"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-[#FF6B4A]" : "text-[#555]")} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#FF6B4A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-[0_2px_8px_rgba(255,107,74,0.4)]">
                    {item.badge}
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="p-6 pt-0">
        <div className="space-y-1 border-t border-[#2a2a2a] pt-6">
          <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.08, ease: 'easeOut' }}>
            <Link
              href="/dashboard/profile"
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-md transition-all duration-200 text-[11px] font-bold uppercase tracking-[0.15em]",
                pathname === '/dashboard/profile' ? "bg-[#222] text-white" : "text-[#666] hover:text-[#aaa] hover:bg-[#151515]"
              )}
            >
              <User className="w-4 h-4 text-[#555]" />
              Account Profile
            </Link>
          </motion.div>
          
          <motion.button 
            type="button"
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.08, ease: 'easeOut' }}
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-md transition-all duration-200 text-[11px] font-bold uppercase tracking-[0.15em] text-[#888] hover:text-[#ccc] hover:bg-[#202020] mt-2 group disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#FF6B4A]" />
            ) : (
              <LogOut className="w-4 h-4 text-[#555] group-hover:text-error" />
            )}
            <span className="group-hover:text-error transition-colors">{isLoggingOut ? 'Signing out...' : 'System Logout'}</span>
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
