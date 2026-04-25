/**
 * Responsive Design System
 * Centralized responsive utility classes and mobile-first patterns
 * Ensures consistent alignment across all devices: mobile (320px+), tablet (768px+), desktop (1024px+)
 */

// Add this to src/lib/constants.ts

export const RESPONSIVE = {
  // Touch Target Sizes (minimum 44px for iOS/Android accessibility)
  TOUCH_TARGET: 'min-h-[44px] min-w-[44px]', // Safe touch area
  BUTTON_TOUCH: 'py-2.5 px-4', // 44px minimum height with padding
  ICON_BUTTON: 'w-9 h-9', // 36px (can be 44px with padding)
  SMALL_ICON: 'w-4 h-4', // For icon usage
  
  // Spacing Scales
  SPACING: {
    XS: '0.25rem', // 4px
    SM: '0.5rem', // 8px
    MD: '1rem', // 16px
    LG: '1.5rem', // 24px
    XL: '2rem', // 32px
    XXL: '2.5rem', // 40px
  },

  // Padding Patterns (mobile-first)
  PADDING: {
    CONTAINER: 'px-4 md:px-6 lg:px-8', // Responsive container padding
    SECTION: 'p-4 md:p-6 lg:p-8', // Section padding
    CARD: 'p-3 md:p-4 lg:p-6', // Card padding
    COMPACT: 'p-2 md:p-3 lg:p-4', // Compact padding
  },

  // Gap Patterns for flex/grid
  GAP: {
    TIGHT: 'gap-2 md:gap-3 lg:gap-4', // Tight spacing
    NORMAL: 'gap-3 md:gap-4 lg:gap-6', // Normal spacing
    LOOSE: 'gap-4 md:gap-6 lg:gap-8', // Loose spacing
  },

  // Responsive Font Sizes
  TEXT: {
    TINY: 'text-xs md:text-xs lg:text-sm', // 12px -> 14px
    SMALL: 'text-sm md:text-sm lg:text-base', // 14px -> 16px
    BASE: 'text-base md:text-base lg:text-lg', // 16px -> 18px
    LARGE: 'text-lg md:text-xl lg:text-2xl', // 18px -> 20px -> 24px
    XL: 'text-xl md:text-2xl lg:text-3xl', // 20px -> 24px -> 30px
    HEADING: 'text-2xl md:text-3xl lg:text-4xl', // 24px -> 30px -> 36px
  },

  // Responsive Width Patterns
  WIDTH: {
    FULL: 'w-full', // Always full width
    SIDEBAR: 'w-64 lg:w-72 xl:w-80', // Responsive sidebar
    MODAL: 'w-full sm:w-96 md:w-full lg:w-2xl', // Modal responsive
    CONTAINER: 'w-full max-w-screen-lg mx-auto', // Centered container
  },

  // Responsive Grid Patterns
  GRID: {
    AUTO: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', // Auto grid
    TWO: 'grid-cols-1 md:grid-cols-2', // 2 columns
    THREE: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', // 3 columns
    FOUR: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5', // 4+ columns
  },

  // Responsive Display (show/hide by breakpoint)
  DISPLAY: {
    MOBILE_ONLY: 'block md:hidden', // Show on mobile only
    TABLET_UP: 'hidden md:block', // Hide on mobile
    DESKTOP_ONLY: 'hidden lg:block', // Show on desktop only
  },

  // Safe Area (for notch/safe zones on iOS/Android)
  SAFE_AREA: {
    TOP: 'pt-safe', // Safe area top padding
    BOTTOM: 'pb-safe', // Safe area bottom padding (for nav bar, etc)
    SIDES: 'px-safe', // Safe area side padding
  },

  // Breakpoint-specific padding for main content
  MAIN_PADDING: 'p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10',

  // Footer & Nav bar sizing
  FOOTER_HEIGHT: 'h-24 md:h-32 lg:h-40', // Responsive footer
  NAV_HEIGHT: 'h-16 md:h-20', // Navigation bar height
  MOBILE_NAV_HEIGHT: 'h-20', // Mobile bottom nav

  // Common responsive classes
  CARD_GRID: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6',
  FLEX_CENTER: 'flex items-center justify-center',
  FLEX_BETWEEN: 'flex items-center justify-between',
  FLEX_START: 'flex items-start justify-start',
} as const;

// Usage Examples:
// Button: <button className={`${RESPONSIVE.TOUCH_TARGET} ${RESPONSIVE.BUTTON_TOUCH}`}>
// Container: <div className={RESPONSIVE.PADDING.CONTAINER}>
// Grid: <div className={`grid ${RESPONSIVE.GRID.FOUR} ${RESPONSIVE.GAP.NORMAL}`}>
// Text: <h1 className={RESPONSIVE.TEXT.HEADING}>
// Sidebar: <aside className={RESPONSIVE.WIDTH.SIDEBAR}>
