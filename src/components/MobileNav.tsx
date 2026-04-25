import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Package, ShoppingCart, History, Heart
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';

export function MobileNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
    { icon: Package, label: 'Catalog', path: '/dashboard/catalog' },
    { icon: ShoppingCart, label: 'Cart', path: '/dashboard/cart', badge: totalItems > 0 ? totalItems : null },
    { icon: History, label: 'Orders', path: '/dashboard/orders' },
    { icon: Heart, label: 'Saved', path: '/dashboard/wishlist' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0E0E0F]/95 backdrop-blur-xl border-t border-[#1F1F21] px-1 sm:px-2 py-2 flex justify-around items-center z-50 pb-safe shadow-[0_-2px_12px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const isActive = item.path === '/dashboard' 
          ? pathname === '/dashboard' 
          : pathname.startsWith(item.path);

        return (
          <Link 
            key={item.path} 
            href={item.path} 
            className="relative flex flex-col items-center gap-0.5 flex-1 min-h-[56px] sm:min-h-[60px] justify-center"
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={cn(
                "p-2 sm:p-2.5 rounded-xl transition-colors duration-200 relative",
                isActive ? "text-[#FF6B4A] bg-[#FF6B4A]/10" : "text-[#555]"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B4A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#0E0E0F] min-w-[18px] h-[18px] flex items-center justify-center shadow-lg">
                  {item.badge}
                </span>
              )}
            </motion.div>
            <span className={cn(
              "text-[8px] sm:text-[9px] font-bold uppercase tracking-wider",
              isActive ? "text-white" : "text-[#444]"
            )}>
              {item.label}
            </span>
            
            {isActive && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#FF6B4A]"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
