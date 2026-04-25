/**
 * Application Constants & Configuration
 * Centralized location for all magic strings, numbers, and configuration values
 */

// ==================== BUSINESS RULES ====================
export const BUSINESS_CONFIG = {
  TAX_RATE: 0.1, // 10% tax
  SHIPPING_COST: 100, // PHP
  FREE_SHIPPING_THRESHOLD: 1000, // PHP
  LOW_STOCK_THRESHOLD: 10,
  CURRENCY: 'PHP',
  CURRENCY_SYMBOL: '₱',
} as const;

// ==================== UI COLORS & STYLING ====================
export const COLORS = {
  PRIMARY: '#FF6B4A',
  PRIMARY_LIGHT: '#FF8A6B',
  BACKGROUND: '#0E0E0F',
  SURFACE: '#1A1A1B',
  SURFACE_VARIANT: '#2A2A2B',
  ON_SURFACE: '#FFFFFF',
  ON_SURFACE_VARIANT: '#A0A0A0',
  ERROR: '#FF5252',
  SUCCESS: '#4CAF50',
  WARNING: '#FFC107',
  INFO: '#2196F3',
  BORDER: '#1F1F21',
  TEXT_MUTED: '#555555',
  TEXT_LIGHT: '#777777',
} as const;

// ==================== ORGANIZATION INFO ====================
export const ORGANIZATION = {
  NAME: 'GECAIN',
  FULL_NAME: 'GECAIN MOTOR SHOP',
  TAGLINE: 'MOTOR SHOP',
  DESCRIPTION: 'High-quality motorcycle parts and motor accessories management.',
  COPYRIGHT_YEAR: new Date().getFullYear(),
  CONTACT: {
    PHONE: '+63 2 1234 5678',
    EMAIL: 'support@gecain.com',
    ADDRESS: 'Motor City, Metro Manila, Philippines',
  },
} as const;

// ==================== ROUTES ====================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  NOT_FOUND: '/not-found',
  DASHBOARD_CATALOG: '/dashboard/catalog',
  DASHBOARD_CART: '/dashboard/cart',
  DASHBOARD_ORDERS: '/dashboard/orders',
  DASHBOARD_ORDER_HISTORY: '/dashboard/order-history',
  DASHBOARD_WISHLIST: '/dashboard/wishlist',
  DASHBOARD_SUPPORT: '/dashboard/support',
  DASHBOARD_FEEDBACK: '/dashboard/feedback',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_PRODUCT: (id: string) => `/dashboard/product/${id}`,
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_BRANDS: '/admin/brands',
  ADMIN_SUPPLIERS: '/admin/suppliers',
  ADMIN_USERS: '/admin/users',
  ADMIN_AUDIT: '/admin/audit',
  ADMIN_FEEDBACK: '/admin/feedback',
} as const;

// ==================== PAGE TITLES ====================
export const PAGE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/login': 'Login',
  '/register': 'Sign Up',
  '/dashboard': 'Dashboard',
  '/dashboard/catalog': 'Parts Catalog',
  '/dashboard/cart': 'My Shopping Cart',
  '/dashboard/orders': 'My Orders',
  '/dashboard/order-history': 'Order History',
  '/dashboard/wishlist': 'My Wishlist',
  '/dashboard/support': 'Support Center',
  '/dashboard/feedback': 'Send Feedback',
  '/dashboard/profile': 'My Profile',
  '/admin': 'Admin Dashboard',
  '/admin/products': 'Inventory Management',
  '/admin/orders': 'Order Management',
  '/admin/analytics': 'Business Analytics',
  '/admin/settings': 'System Settings',
  '/admin/brands': 'Brand Management',
  '/admin/suppliers': 'Supplier Network',
  '/admin/users': 'User Management',
  '/admin/audit': 'Audit Logs',
  '/admin/feedback': 'Customer Feedback',
} as const;

// ==================== TIMEOUTS & DELAYS ====================
export const TIMING = {
  AUTH_INIT_TIMEOUT: 5000, // ms
  DEBOUNCE_DELAY: 300, // ms
  ANIMATION_DURATION: 300, // ms
  TOAST_DURATION: 3000, // ms
  LOADING_SPINNER_MIN_TIME: 500, // ms
} as const;

// ==================== STORAGE KEYS ====================
export const STORAGE_KEYS = {
  CART: 'moto_cart',
  AUTH_TOKEN: 'moto_auth_token',
  USER_PREFERENCES: 'moto_user_prefs',
  THEME: 'moto_theme',
} as const;

// ==================== API & DATABASE ====================
export const API_CONFIG = {
  SUPABASE_BUCKET: 'product-images',
  IMAGE_CACHE_CONTROL: '3600', // 1 hour
  IMAGE_UPLOAD_FOLDER: 'general',
  MAX_UPLOAD_SIZE: 5242880, // 5MB
} as const;

// ==================== PRODUCT STATUS ====================
export const PRODUCT_STATUS = {
  IN_STOCK: 'in-stock',
  LOW_STOCK: 'low-stock',
  OUT_OF_STOCK: 'out-of-stock',
} as const;

// ==================== ORDER STATUS ====================
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

// ==================== USER ROLES ====================
export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
} as const;

// ==================== COUPON TYPES ====================
export const COUPON_TYPE = {
  FIXED: 'fixed',
  PERCENTAGE: 'percentage',
} as const;

// ==================== VALIDATION RULES ====================
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^[0-9+\-\s()]+$/,
  SKU_REGEX: /^[A-Z0-9\-]+$/,
} as const;

// ==================== PAGINATION ====================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_ITEMS_PER_PAGE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// ==================== ERROR MESSAGES ====================
export const ERROR_MESSAGES = {
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 8 characters.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  UNAUTHORIZED: 'You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found.',
  INTERNAL_SERVER_ERROR: 'Server error. Please try again later.',
  PROFILE_FETCH_ERROR: 'Failed to load profile. Please refresh.',
  PRODUCT_LOAD_ERROR: 'Failed to load products.',
  ORDER_LOAD_ERROR: 'Failed to load orders.',
  CART_ERROR: 'Failed to update cart.',
  CHECKOUT_ERROR: 'Failed to process checkout.',
  FEEDBACK_ERROR: 'Failed to submit feedback.',
} as const;

// ==================== SUCCESS MESSAGES ====================
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PRODUCT_ADDED: 'Product added successfully!',
  PRODUCT_UPDATED: 'Product updated successfully!',
  PRODUCT_DELETED: 'Product deleted successfully!',
  ORDER_PLACED: 'Order placed successfully!',
  FEEDBACK_SUBMITTED: 'Thank you for your feedback!',
  CART_CLEARED: 'Cart cleared successfully!',
  COUPON_APPLIED: 'Coupon applied successfully!',
} as const;

// ==================== DEMO CREDENTIALS (Development Only) ====================
// ⚠️ These should ONLY be used in development/demo environments
// Never hardcode credentials in production
export const DEMO_CREDENTIALS = {
  CUSTOMER_EMAIL: 'customer@gecain.com',
  CUSTOMER_PASSWORD: 'customer123',
  ADMIN_EMAIL: 'admin@gecain.com',
  ADMIN_PASSWORD: 'admin123',
} as const;

// ==================== FEATURE FLAGS ====================
export const FEATURES = {
  ENABLE_REAL_TIME_UPDATES: true,
  ENABLE_WISHLIST: true,
  ENABLE_FEEDBACK_SYSTEM: true,
  ENABLE_COUPON_SYSTEM: true,
  ENABLE_ANALYTICS: true,
  MAINTENANCE_MODE: false,
} as const;
