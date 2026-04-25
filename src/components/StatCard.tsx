import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';
}

export function StatCard({ label, value, icon: Icon, trend, color = 'primary' }: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary-container/10 text-primary-container",
    secondary: "bg-secondary-container/10 text-secondary",
    tertiary: "bg-tertiary-container/10 text-tertiary",
    error: "bg-error-container/10 text-error",
  };

  return (
    <div className={cn(
      "bg-surface-container-low border border-outline-variant rounded-2xl p-6 hover:border-outline transition-all group relative overflow-hidden",
      color === 'primary' && "border-t-2 border-t-primary"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            trend.isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
          )}>
            {trend.isUp ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-headline font-bold tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
