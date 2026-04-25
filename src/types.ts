export interface Part {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  image_url: string;
  description: string;
  specifications: Record<string, string>;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface Order {
  id: string;
  order_number?: string;
  customer_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  items_count: number;
  payment_method?: string;
  shipping_address?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  part_id: string;
  quantity: number;
  price_at_purchase: number;
}

export interface Review {
  id: string;
  part_id: string;
  user_name: string;
  user_role: string;
  rating: number;
  comment: string;
  date: string;
}
