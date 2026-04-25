import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  image_url: string;
  sku: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  activeCoupon: { code: string; amount: number; type: 'fixed' | 'percentage' } | null;
  addItem: (product: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  getItemQuantity: (id: string) => number;
  applyCoupon: (coupon: { code: string; amount: number; type: 'fixed' | 'percentage' }) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('moto_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [activeCoupon, setActiveCoupon] = useState<{ code: string; amount: number; type: 'fixed' | 'percentage' } | null>(null);

  useEffect(() => {
    localStorage.setItem('moto_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Omit<CartItem, 'quantity'>, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => 
          i.id === product.id 
            ? { ...i, quantity: Math.min(i.quantity + qty, i.stock) } 
            : i
        );
      }
      return [...prev, { ...product, quantity: Math.min(qty, product.stock) }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(i => 
      i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
    ));
  };

  const clearCart = () => {
    setItems([]);
    setActiveCoupon(null);
  };

  const applyCoupon = (coupon: { code: string; amount: number; type: 'fixed' | 'percentage' }) => {
    setActiveCoupon(coupon);
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  const isInCart = (id: string) => items.some(i => i.id === id);
  const getItemQuantity = (id: string) => items.find(i => i.id === id)?.quantity || 0;

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  const discountAmount = activeCoupon 
    ? activeCoupon.type === 'percentage' 
      ? (totalPrice * (activeCoupon.amount / 100)) 
      : activeCoupon.amount 
    : 0;

  const finalPrice = Math.max(0, totalPrice - discountAmount);

  return (
    <CartContext.Provider value={{ 
      items, totalItems, totalPrice, discountAmount, finalPrice, activeCoupon,
      addItem, removeItem, updateQuantity, clearCart,
      isInCart, getItemQuantity, applyCoupon, removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
