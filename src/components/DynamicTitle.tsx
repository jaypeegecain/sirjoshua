'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PAGE_TITLES, ORGANIZATION } from '@/src/lib/constants';

export function DynamicTitle() {
  const pathname = usePathname();

  useEffect(() => {
    // Get page title from constants, fallback to pathname
    const title = PAGE_TITLES[pathname] || 
                 (pathname.startsWith('/dashboard/product/') ? 'Product Details' : 'Page');
    document.title = `${title} | ${ORGANIZATION.FULL_NAME}`;
  }, [pathname]);

  return null;
}
