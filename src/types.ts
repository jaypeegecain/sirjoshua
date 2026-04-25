// ==================== USER TYPES ====================
export type UserRole = 'admin' | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  phone_number?: string | null;
  address?: string | null;
  city?: string | null;
  zip_code?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ==================== PRODUCTS ====================
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
  created_at?: string;
  updated_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  category?: string | null;
  logo_url?: string | null;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  amount: number;
  type: 'fixed' | 'percentage';
  usage_limit?: number | null;
  used_count?: number | null;
  valid_from?: string;
  valid_until?: string;
  created_at?: string;
}

// ==================== ORDERS ====================
export interface Order {
  id: string;
  order_number?: string;
  customer_id: string;
  user_id?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  items_count: number;
  payment_method?: string | null;
  shipping_address?: string | null;
  items?: OrderItem[];
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  part_id?: string;
  quantity: number;
  price_at_purchase: number;
  products?: Part;
}

// ==================== REVIEWS & FEEDBACK ====================
export interface Review {
  id: string;
  part_id: string;
  user_name: string;
  user_role: string;
  rating: number;
  comment: string;
  date: string;
  created_at?: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  category?: string | null;
  status?: 'new' | 'reviewed' | 'resolved';
  created_at: string;
  updated_at?: string;
}

export interface SupportMessage {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at?: string;
}

// ==================== DASHBOARD STATS ====================
export interface DashboardStats {
  totalSales: number;
  totalUsers: number;
  totalProducts: number;
  pendingOrders: number;
  totalRevenue?: number;
  lowStockProducts?: number;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes?: Record<string, any>;
  created_at: string;
}

// ==================== API RESPONSES ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
