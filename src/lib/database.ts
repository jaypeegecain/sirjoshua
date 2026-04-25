import { supabase } from './supabase';


export async function uploadImage(file: File, folder: string = 'general'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) throw error;


  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return publicUrl;
}


export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function fetchCoupons() {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createProduct(product: {
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  status: string;
  description: string;
  image_url: string;
  specifications: Record<string, string>;
}) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
}


export async function fetchBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function createBrand(brand: { name: string; description?: string; logo_url?: string }) {
  const { data, error } = await supabase
    .from('brands')
    .insert(brand)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBrand(id: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('brands')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBrand(id: string) {
  const { error } = await supabase
    .from('brands')
    .delete()
    .eq('id', id);
  if (error) throw error;
}



export async function fetchSuppliers() {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function createSupplier(supplier: {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  category?: string;
  logo_url?: string;
  status?: string;
}) {
  const { data, error } = await supabase
    .from('suppliers')
    .insert(supplier)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSupplier(id: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('suppliers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSupplier(id: string) {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ==================== ORDERS ====================

export async function fetchOrders(userId?: string) {
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price_at_purchase,
        product_id,
        products (name, sku)
      )
    `)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchOrderById(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price_at_purchase,
        product_id,
        products (name, sku, price, image_url)
      )
    `)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createOrder(order: {
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  user_id?: string;
  shipping_address?: string;
  phone_number?: string;
  payment_method?: string;
  payment_status?: string;
  discount_amount?: number;
}, items: { product_id: string; quantity: number; price_at_purchase: number }[]) {
  // Insert order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();
  if (orderError) throw orderError;

  // Insert order items
  if (items.length > 0) {
    const orderItems = items.map(item => ({
      ...item,
      order_id: orderData.id
    }));
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    if (itemsError) throw itemsError;

    // Decrement inventory stock
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();
      
      if (product) {
        const newStock = Math.max(0, (product.stock || 0) - item.quantity);
        await supabase
          .from('products')
          .update({ 
            stock: newStock,
            status: newStock === 0 ? 'Out of Stock' : newStock <= 10 ? 'Low Stock' : 'In Stock'
          })
          .eq('id', item.product_id);
      }
    }
  }

  return orderData;
}

export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ==================== REVIEWS ====================

export async function fetchReviewsByProduct(productId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createReview(review: {
  product_id: string;
  user_name: string;
  user_role?: string;
  rating: number;
  comment: string;
}) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ==================== SUPPORT MESSAGES ====================

export async function fetchSupportMessages() {
  const { data, error } = await supabase
    .from('support_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createSupportMessage(message: {
  customer_name: string;
  email: string;
  subject: string;
  message: string;
  user_id?: string;
}) {
  const { data, error } = await supabase
    .from('support_messages')
    .insert(message)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMessageStatus(id: string, status: 'New' | 'Read' | 'Resolved') {
  const { data, error } = await supabase
    .from('support_messages')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ==================== ACTIVITY LOG ====================

export async function fetchActivityLog(limit = 5) {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

// ==================== STATS ====================

export async function fetchDashboardStats() {
  // Total inventory (sum of all stock)
  const { data: products } = await supabase
    .from('products')
    .select('stock, status');

  const totalStock = products?.reduce((sum, p) => sum + (p.stock || 0), 0) || 0;
  const lowStockCount = products?.filter(p =>
    p.status === 'low-stock' || p.status === 'Low Stock' || (p.stock > 0 && p.stock <= 10)
  ).length || 0;

  // Active orders count
  const { count: activeOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .not('status', 'eq', 'Completed');

  // Total orders
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  return {
    totalStock,
    activeOrders: activeOrders || 0,
    lowStockCount,
    totalOrders: totalOrders || 0,
    totalProducts: products?.length || 0
  };
}

// ==================== AUTH ====================

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ==================== COUPONS ====================

export async function validateCoupon(code: string) {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Invalid coupon code');
  
  // Check expiration
  if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
    throw new Error('This coupon has expired');
  }

  // Check usage limit
  if (data.max_uses && data.used_count >= data.max_uses) {
    throw new Error('This coupon has reached its usage limit');
  }

  return data;
}

export async function incrementCouponUsage(couponCode: string) {
  const { error } = await supabase.rpc('increment_coupon_usage', { coupon_code: couponCode });
  if (error) throw error;
}

// Real-time subscription functions
export function subscribeToProductUpdates(
  productId: string,
  callback: (product: any) => void
) {
  const subscription = supabase
    .channel(`product:${productId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'products',
        filter: `id=eq.${productId}`
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return subscription;
}

export function subscribeToAllProducts(callback: (product: any) => void) {
  const subscription = supabase
    .channel('products:all')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'products'
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return subscription;
}

export function subscribeToOrderUpdates(
  orderId: string,
  callback: (order: any) => void
) {
  const subscription = supabase
    .channel(`order:${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return subscription;
}

export function subscribeToOrdersByUser(
  userId: string,
  callback: (order: any) => void
) {
  const subscription = supabase
    .channel(`user:${userId}:orders`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return subscription;
}

export async function unsubscribe(subscription: any) {
  await supabase.removeChannel(subscription);
}