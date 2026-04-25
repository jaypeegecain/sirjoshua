import React, { useState } from 'react';
import { ShoppingCart, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { cn, normalizeStatus, formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';

interface PartCardProps {
  part: {
    id: string;
    sku: string;
    name: string;
    category: string;
    brand: string;
    price: number;
    stock: number;
    status: string;
    image_url: string;
    description: string;
  };
}

export function PartCard({ part }: PartCardProps) {
  const { addItem, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = isInCart(part.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (part.stock === 0) return;
    addItem({
      id: part.id,
      name: part.name,
      brand: part.brand,
      price: part.price,
      stock: part.stock,
      image_url: part.image_url,
      sku: part.sku,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 800);
  };

  return (
    <div className="group bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden hover:border-primary-container/50 transition-all duration-300 flex flex-col h-full">
      <div className="aspect-square relative overflow-hidden bg-surface-container-highest">
        <img 
          src={part.image_url || 'https://picsum.photos/seed/motor/400/400'} 
          alt={part.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
          <span className={cn(
            "px-2 py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm",
            normalizeStatus(part.status) === 'in-stock' ? "bg-emerald-500/20 text-emerald-400" :
            normalizeStatus(part.status) === 'low-stock' ? "bg-amber-500/20 text-amber-400" :
            "bg-rose-500/20 text-rose-400"
          )}>
            {part.status || 'unknown'}
          </span>
          {part.brand === 'Brembo' && (
            <span className="bg-primary-container/20 text-primary-container px-2 py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm">
              <ShieldCheck className="w-3 h-3" />
              Premium
            </span>
          )}
        </div>
        {inCart && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
              <Check className="w-3 h-3" /> In Cart
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
        <div className="mb-1">
          <span className="text-[9px] sm:text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{part.brand}</span>
        </div>
        <h3 className="font-headline font-bold text-sm sm:text-base lg:text-lg mb-2 group-hover:text-primary-container transition-colors line-clamp-1">
          {part.name}
        </h3>
        <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 mb-4 flex-1">
          {part.description || 'High-quality motor part for optimal performance.'}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-outline-variant">
          <div>
            <p className="text-[8px] sm:text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Price</p>
            <p className="text-lg sm:text-xl font-headline font-bold text-primary-container">{formatPrice(part.price)}</p>
          </div>
          <div className="flex gap-1.5 sm:gap-2">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link 
                href={`/dashboard/catalog/${part.id}`}
                className="p-2 sm:p-2.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors flex items-center justify-center min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px]"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </motion.div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={part.stock === 0}
              className={cn(
                "p-2 sm:p-2.5 rounded-lg shadow-lg transition-all min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center",
                justAdded 
                  ? "bg-emerald-500 text-white scale-110" 
                  : inCart 
                    ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    : "primary-gradient text-on-primary shadow-primary-container/20 hover:scale-105",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {justAdded ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
