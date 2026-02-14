/* ═══════════════════════════════════════════════════════════════════
   POWERPLAY THEME SYSTEM
   Extracted from: portal.getpowerplay.in
   Last Updated: 2026-02-14
   ═══════════════════════════════════════════════════════════════════ */

// ─── COLOR PALETTE ───────────────────────────────────────────────
export const colors = {
    // Primary Brand
    primary: {
        navy: '#1E3A8A',   // Deep Navy – Headers, Sidebar, Primary buttons
        blue: '#2563EB',   // Bright Blue – Links, Active states, CTAs
        lightBlue: '#3B82F6', // Medium Blue – Hover states
        paleBlue: '#DBEAFE',  // Pale Blue – Selected row highlights
    },

    // Accent
    accent: {
        orange: '#F97316',   // Construction Orange – Active tab borders, Alerts
        amber: '#F59E0B',   // Amber – Warnings
        green: '#22C55E',   // Green – Success, Completed status
        red: '#EF4444',   // Red – Errors, Overdue, Overruns
    },

    // Neutral (The Backbone)
    neutral: {
        white: '#FFFFFF',
        gray50: '#F9FAFB',   // Page background
        gray100: '#F3F4F6',   // Card backgrounds, Table headers
        gray200: '#E5E7EB',   // Borders
        gray300: '#D1D5DB',   // Disabled borders
        gray400: '#9CA3AF',   // Placeholder text
        gray500: '#6B7280',   // Secondary text
        gray600: '#4B5563',   // Body text
        gray700: '#374151',   // Headings
        gray800: '#1F2937',   // Strong headings
        gray900: '#111827',   // Sidebar text
        black: '#000000',
    },

    // Status
    status: {
        todo: '#E5E7EB',
        inProgress: '#3B82F6',
        completed: '#22C55E',
        overdue: '#EF4444',
        onHold: '#F59E0B',
    },
} as const;

// ─── TYPOGRAPHY ──────────────────────────────────────────────────
export const typography = {
    fontFamily: {
        primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    fontSize: {
        xs: '0.625rem',  // 10px – Timestamps, tiny labels
        sm: '0.75rem',   // 12px – Table cells, secondary info
        base: '0.8125rem', // 13px – Default body text (DENSE)
        md: '0.875rem',  // 14px – Form labels, card text
        lg: '1rem',      // 16px – Section headers
        xl: '1.125rem',  // 18px – Page titles
        '2xl': '1.5rem',   // 24px – KPI values
        '3xl': '2rem',     // 32px – Hero stats
    },
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    lineHeight: {
        tight: 1.2,
        normal: 1.4,
        relaxed: 1.6,
    },
} as const;

// ─── SPACING ─────────────────────────────────────────────────────
export const spacing = {
    sidebar: {
        width: '240px',
        collapsed: '64px',
    },
    header: {
        height: '56px',
    },
    card: {
        padding: '16px',
        gap: '12px',
        radius: '4px',     // Sharp – NOT rounded like consumer apps
    },
    table: {
        headerPadding: '8px 12px',
        cellPadding: '6px 12px', // Dense rows
        rowHeight: '36px',
    },
    page: {
        padding: '24px',
        gap: '16px',
    },
} as const;

// ─── SHADOWS ─────────────────────────────────────────────────────
export const shadows = {
    card: '0 1px 3px rgba(0,0,0,0.08)',
    dropdown: '0 4px 12px rgba(0,0,0,0.12)',
    sidebar: '2px 0 8px rgba(0,0,0,0.06)',
    header: '0 1px 3px rgba(0,0,0,0.06)',
    modal: '0 20px 60px rgba(0,0,0,0.2)',
} as const;

// ─── BREAKPOINTS ─────────────────────────────────────────────────
export const breakpoints = {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
} as const;

// ─── TRANSITIONS ─────────────────────────────────────────────────
export const transitions = {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease-in-out',
} as const;

// ─── SIDEBAR NAV ITEMS ───────────────────────────────────────────
export const sidebarNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/admin' },
    { id: 'projects', label: 'Projects', icon: 'FolderKanban', href: '/admin/projects' },
    { id: 'tasks', label: 'Tasks', icon: 'ListTodo', href: '/admin/tasks' },
    { id: 'materials', label: 'Materials', icon: 'Package', href: '/admin/inventory' },
    { id: 'indents', label: 'Indents', icon: 'ClipboardList', href: '/admin/indents' },
    { id: 'reports', label: 'Reports', icon: 'BarChart3', href: '/admin/reports' },
    { id: 'drawings', label: 'Drawings', icon: 'FileImage', href: '/admin/drawings' },
    { id: 'attendance', label: 'Attendance', icon: 'Users', href: '/admin/attendance' },
    { id: 'billing', label: 'Billing', icon: 'Receipt', href: '/admin/billing' },
    { id: 'settings', label: 'Settings', icon: 'Settings', href: '/admin/settings' },
] as const;
