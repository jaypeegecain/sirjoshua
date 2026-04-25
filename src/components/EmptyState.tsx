'use client';

import React from 'react';
import { LucideIcon, Package, Heart, FileText, MessageCircle, Truck, Tag, Users, ShoppingCart } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon | string;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

const iconMap: Record<string, LucideIcon> = {
  Package,
  Heart,
  FileText,
  MessageCircle,
  Truck,
  Tag,
  Users,
  ShoppingCart,
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  let IconComponent: LucideIcon | undefined;

  if (typeof icon === 'string') {
    IconComponent = iconMap[icon];
  } else if (icon) {
    IconComponent = icon;
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {IconComponent && (
        <div className="bg-[#FF6B4A]/10 p-4 rounded-full mb-4">
          <IconComponent className="w-8 h-8 text-[#FF6B4A]" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm mb-6">{description}</p>
      {action && (
        action.href ? (
          <a
            href={action.href}
            className="px-4 py-2 bg-[#FF6B4A] text-white rounded-lg font-medium hover:bg-[#E55A3A] transition-colors"
          >
            {action.label}
          </a>
        ) : (
          <button
            onClick={action.onClick}
            className="px-4 py-2 bg-[#FF6B4A] text-white rounded-lg font-medium hover:bg-[#E55A3A] transition-colors"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
