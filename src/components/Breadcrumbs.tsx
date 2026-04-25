'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { motion } from 'motion/react';

export interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-on-surface-variant" />}
          {item.active ? (
            <span className="text-on-surface font-medium">{item.label}</span>
          ) : (
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                href={item.href}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {item.label}
              </Link>
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
