import React from 'react';
import { cn } from '../lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace('-', ' ');
  
  const getStatusStyles = () => {
    switch (normalizedStatus) {
      case 'in stock':
      case 'delivered':
      case 'operational':
        return "bg-emerald-500/20 text-emerald-400";
      case 'low stock':
      case 'processing':
      case 'warning':
        return "bg-amber-500/20 text-amber-400";
      case 'out of stock':
      case 'cancelled':
      case 'error':
        return "bg-rose-500/20 text-rose-400";
      case 'shipped':
      case 'pending':
        return "bg-tertiary-container/20 text-tertiary-container";
      default:
        return "bg-surface-container-highest text-on-surface-variant";
    }
  };

  return (
    <span className={cn(
      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center justify-center",
      getStatusStyles(),
      className
    )}>
      {normalizedStatus}
    </span>
  );
}
