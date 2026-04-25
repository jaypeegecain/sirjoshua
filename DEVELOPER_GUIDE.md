# 🚀 Quick Reference Guide
**Motor Parts Management System - Developer Guide**

---

## 📍 Key Files & Their Purpose

### Configuration
- `src/lib/constants.ts` - All app configuration, colors, messages, routes
- `.env.local` - Environment variables (create from `.env.example`)
- `next.config.ts` - Next.js build configuration
- `tsconfig.json` - TypeScript configuration

### Type Definitions
- `src/types.ts` - All TypeScript interfaces (16+ interfaces)

### Core Logic
- `src/lib/database.ts` - Database operations
- `src/lib/hooks.ts` - Custom React hooks
- `src/lib/utils.ts` - Utility functions
- `src/lib/supabase.ts` - Supabase client initialization

### State Management
- `src/context/AuthContext.tsx` - Authentication state
- `src/context/CartContext.tsx` - Shopping cart state

### Components
- `src/components/` - Reusable UI components
- `app/` - Next.js pages

---

## 🎨 Using Constants

### Colors
```typescript
import { COLORS } from '@/src/lib/constants';

// Usage
style={{ color: COLORS.PRIMARY }}  // #FF6B4A
style={{ backgroundColor: COLORS.BACKGROUND }}  // #0E0E0F
```

### Routes
```typescript
import { ROUTES } from '@/src/lib/constants';

// Usage
router.push(ROUTES.DASHBOARD)  // /dashboard
router.push(ROUTES.ADMIN_PRODUCTS)  // /admin/products
router.push(ROUTES.DASHBOARD_PRODUCT('123'))  // /dashboard/product/123
```

### Business Rules
```typescript
import { BUSINESS_CONFIG } from '@/src/lib/constants';

const taxAmount = total * BUSINESS_CONFIG.TAX_RATE  // 0.1
const shippingCost = BUSINESS_CONFIG.SHIPPING_COST  // 100
const freeShippingThreshold = BUSINESS_CONFIG.FREE_SHIPPING_THRESHOLD  // 1000
```

### Messages
```typescript
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/src/lib/constants';

// Usage
setSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS)
setError(ERROR_MESSAGES.INVALID_CREDENTIALS)
```

---

## 🔐 Environment Setup

### Create `.env.local`
```bash
# Copy from .env.example
cp .env.example .env.local

# Add your values
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### For Scripts
```bash
# Add to .env.local for admin scripts
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🧪 Running Commands

```bash
# Development
npm run dev
# Visit http://localhost:3000

# Build
npm run build

# Production
npm start

# Linting
npm run lint

# Clean
npm run clean
```

---

## 🔑 Using AuthContext

```typescript
import { useAuth } from '@/src/context/AuthContext';

export default function MyComponent() {
  const { user, profile, isAdmin, loading, error, signIn, signOut } = useAuth();

  const handleLogin = async () => {
    const { success, error } = await signIn('user@example.com', 'password');
    if (!success) {
      console.error(error);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user && <p>Hello {user.email}</p>}
    </div>
  );
}
```

---

## 🛒 Using CartContext

```typescript
import { useCart } from '@/src/context/CartContext';

export default function CartPage() {
  const { items, totalPrice, addItem, removeItem, clearCart } = useCart();

  return (
    <div>
      <p>Total: ${totalPrice}</p>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
}
```

---

## 🪝 Custom Hooks

### useFetch
```typescript
import { useFetch } from '@/src/lib/hooks';

const { data, loading, error, refetch } = useFetch(
  () => fetchProducts(),
  [],  // dependencies
  { onSuccess: (data) => console.log('Success!') }
);
```

### useAsync
```typescript
import { useAsync } from '@/src/lib/hooks';

const { data, loading, error } = useAsync(() => fetchProducts(), []);
```

### usePagination
```typescript
import { usePagination } from '@/src/lib/hooks';

const { currentPage, totalPages, currentItems, nextPage, prevPage } = 
  usePagination(items, 10);
```

### useDebounce
```typescript
import { useDebounce } from '@/src/lib/hooks';

const debouncedSearchTerm = useDebounce(searchTerm, 300);
```

---

## 📝 Form Pattern

```typescript
'use client';
import { useState } from 'react';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, TIMING } from '@/src/lib/constants';

interface State {
  loading: boolean;
  success: boolean;
  error: string | null;
}

export default function MyForm() {
  const [state, setState] = useState<State>({
    loading: false,
    success: false,
    error: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!isValid) {
      setState({ loading: false, success: false, error: 'Invalid input' });
      setTimeout(() => setState(prev => ({ ...prev, error: null })), TIMING.TOAST_DURATION);
      return;
    }

    // Submit
    setState({ loading: true, success: false, error: null });
    try {
      await submitData();
      setState({ loading: false, success: true, error: null });
      setTimeout(() => setState(prev => ({ ...prev, success: false })), TIMING.TOAST_DURATION);
    } catch (err) {
      setState({ loading: false, success: false, error: ERROR_MESSAGES.GENERIC_ERROR });
      setTimeout(() => setState(prev => ({ ...prev, error: null })), TIMING.TOAST_DURATION);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {state.error && <div className="error">{state.error}</div>}
      {state.success && <div className="success">Done!</div>}
      <button disabled={state.loading}>{state.loading ? 'Loading...' : 'Submit'}</button>
    </form>
  );
}
```

---

## 🔄 Type Safety Pattern

```typescript
// 1. Define types in src/types.ts
export interface MyData {
  id: string;
  name: string;
  value: number;
}

// 2. Use in components
import { MyData } from '@/src/types';

export default function Component() {
  const [data, setData] = useState<MyData | null>(null);
  
  return <div>{data?.name}</div>;
}
```

---

## 🚨 Error Handling

```typescript
import { ERROR_MESSAGES } from '@/src/lib/constants';

try {
  await riskyOperation();
} catch (err) {
  const message = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;
  setError(message);
}
```

---

## 📊 Database Operations

```typescript
import { fetchProducts, updateProduct, deleteProduct } from '@/src/lib/database';

// Read
const products = await fetchProducts();

// Update
await updateProduct(id, { name: 'New Name' });

// Delete
await deleteProduct(id);
```

---

## 🔌 API Response Pattern

```typescript
import { ApiResponse } from '@/src/types';

async function myApiCall(): Promise<ApiResponse<MyData>> {
  try {
    const response = await fetch('/api/endpoint');
    const data: ApiResponse<MyData> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    };
  }
}
```

---

## 🎯 TODO: API Integration

### Feedback Form
Located: `app/dashboard/feedback/page.tsx`
```typescript
// TODO: Replace with actual API call
// const response = await fetch('/api/feedback', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ rating, feedback, category })
// });
```

### Settings Form
Located: `app/admin/settings/page.tsx`
```typescript
// TODO: Replace with actual API call
// const response = await fetch('/api/admin/settings', {
//   method: 'PUT',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(settings)
// });
```

---

## 🧹 Best Practices

1. **Always use constants** - Don't hard-code values
2. **Use proper types** - Define interfaces for all data
3. **Handle errors** - Always show user feedback
4. **Clean up** - Use return in useEffect for cleanup
5. **Use 'use client'** - Mark interactive components
6. **Validate input** - Check before sending to API
7. **Show loading** - Disable buttons during async ops
8. **Mock when needed** - Use setTimeout for testing

---

## 🚀 Deployment

### Production Build
```bash
npm run build  # Must pass with 0 errors
npm start      # Runs production build
```

### Environment Variables
Create `.env.production` with same variables as `.env.local`

### Security
- Keep `.env.local` out of git
- Never commit API keys
- Use NEXT_PUBLIC_* only for public keys
- Use SUPABASE_SERVICE_ROLE_KEY only on backend

---

## 📚 File Tree

```
motorpartsmanagementsystem/
├── app/                          # Next.js pages
│   ├── admin/                    # Admin routes
│   ├── dashboard/                # User dashboard
│   ├── login/
│   ├── register/
│   └── layout.tsx
├── src/
│   ├── lib/
│   │   ├── constants.ts          # 🌟 App configuration
│   │   ├── database.ts           # Database operations
│   │   ├── hooks.ts              # Custom hooks
│   │   ├── supabase.ts           # Supabase client
│   │   └── utils.ts              # Utilities
│   ├── context/
│   │   ├── AuthContext.tsx       # Authentication
│   │   └── CartContext.tsx       # Shopping cart
│   ├── components/               # UI components
│   ├── types.ts                  # 🌟 Type definitions
│   └── index.css                 # Global styles
├── public/                        # Static assets
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
└── README.md                     # Documentation
```

---

## ✅ Checklist for New Features

- [ ] Define types in `src/types.ts`
- [ ] Add constants in `src/lib/constants.ts` (if needed)
- [ ] Create/update component
- [ ] Add form validation
- [ ] Add error handling
- [ ] Add loading state
- [ ] Add success/error messages
- [ ] Add comments for TODO items
- [ ] Test with `npm run dev`
- [ ] Verify build: `npm run build`

---

**Last Updated**: April 25, 2026  
**Version**: 1.0  
**Status**: ✅ PRODUCTION READY
