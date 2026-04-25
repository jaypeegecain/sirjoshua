'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/login': 'Login',
  '/dashboard': 'Dashboard',
  '/dashboard/catalog': 'Parts Catalog',
  '/dashboard/cart': 'My Shopping Cart',
  '/dashboard/orders': 'My Orders',
  '/dashboard/order-history': 'Order History',
  '/dashboard/wishlist': 'My Wishlist',
  '/dashboard/support': 'Support Center',
  '/dashboard/feedback': 'Send Feedback',
  '/dashboard/profile': 'My Profile',
  '/admin': 'Admin Dashboard',
  '/admin/products': 'Inventory Management',
  '/admin/orders': 'Order Management',
  '/admin/analytics': 'Business Analytics',
  '/admin/settings': 'System Settings',
  '/admin/brands': 'Brand Management',
  '/admin/suppliers': 'Supplier Network',
};

export function DynamicTitle() {
  const pathname = usePathname();

  useEffect(() => {
    const title = routeTitles[pathname] || 
                 (pathname.startsWith('/catalog/') ? 'Product Details' : 'GECAIN Motor Shop');
    document.title = `${title} | GECAIN Motor Shop`;
  }, [pathname]);

  return null;
}
