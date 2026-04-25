import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Normalizes any status string to the "in-stock" / "low-stock" / "out-of-stock" format */
export function normalizeStatus(status: string | null | undefined): string {
  return (status ?? '').toLowerCase().trim().replace(/\s+/g, '-');
}

/** Formats a number as Philippine Peso with thousands separators */
export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0).replace('PHP', '₱').trim();
}
