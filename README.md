# JabsOn PRO - POS & Inventory Management System

## Overview
JabsOn is a premium, full-stack POS and inventory management SaaS platform built specifically for Georgian businesses. The entire UI is in Georgian language. It is a **single-page application (SPA)** built with Next.js App Router where all page views are rendered client-side via a `activePage` state variable — there is **no file-based routing** for internal pages.

---

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with CSS custom properties (design tokens in `globals.css`)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Database Schema**: Supabase (PostgreSQL) — SQL schema provided at `scripts/jabson-schema.sql`
- **State**: React `useState` (all client-side demo data, no database connected yet)

---

## Architecture

### Routing (SPA pattern)
All navigation is handled by `app/page.tsx` which holds `activePage` state and renders the appropriate page component via a `switch` statement. The sidebar calls `onNavigate(pageId)` to change this state.

```
app/page.tsx          → Main SPA controller (holds activePage state)
  ├── Sidebar          → Left navigation (dark theme, fixed position)
  ├── TopBar           → Top header (search, dark mode toggle, notifications)
  ├── CommandPalette   → Ctrl+K quick search overlay
  └── {ActivePage}     → Dynamic page component based on activePage
```

### Page IDs (used in sidebar navigation and page.tsx switch):
| Page ID | Component | Description |
|---------|-----------|-------------|
| `dashboard` | `DashboardPage` | Main dashboard with stats, charts, recent sales |
| `pos` | `POSPage` | Point of sale with product grid, cart, payment, receipt |
| `inventory` | `InventoryPage` | Product list with CRUD, barcode, stock management |
| `categories` | `CategoriesPage` | Category CRUD with color picker, product count |
| `sales` | `SalesPage` | Sales history with receipt viewer, filters |
| `purchases` | `PlaceholderPage` | Placeholder (not yet built) |
| `distributor-orders` | `DistributorOrdersPage` | Distributor order intake + admin/cashier notifications |
| `customers` | `CustomersPage` | Customer CRM with loyalty points, purchase history |
| `suppliers` | `SuppliersPage` | Supplier management |
| `adjustments` | `AdjustmentsPage` | Inventory adjustments (add/subtract stock with reasons) |
| `transfers` | `TransfersPage` | Stock transfers between branches |
| `alerts` | `AlertsPage` | Low stock and out-of-stock alerts |
| `accounting` | `PlaceholderPage` | Placeholder (not yet built) |
| `reports` | `ReportsPage` | Revenue/cost/profit line chart + category bar chart |
| `cash-register` | `PlaceholderPage` | Placeholder (not yet built) |
| `rsge` | `RsGePage` | RS.GE tax integration (auth + sync) |
| `waybills` | `PlaceholderPage` | Placeholder (not yet built) |
| `invoices` | `PlaceholderPage` | Placeholder (not yet built) |
| `audit-log` | `AuditLogPage` | System audit trail with JSON diff |
| `company` | `PlaceholderPage` | Placeholder (not yet built) |
| `settings` | `SettingsPage` | Tabbed settings (general, company, POS, security, team) |

---

## File Structure

```
app/
  page.tsx              → SPA router (activePage state + switch rendering)
  layout.tsx            → Root layout (Geist fonts, metadata)
  globals.css           → Design tokens, dark mode, @media print styles

components/jabson/
  sidebar.tsx           → Dark sidebar with nav sections, branch switcher, user footer
  topbar.tsx            → Top header with search trigger, dark mode, notifications dropdown
  command-palette.tsx   → Ctrl+K overlay with page navigation + product search

components/jabson/pages/
  dashboard-page.tsx    → Stats cards, revenue line chart, recent sales table
  pos-page.tsx          → Product grid (left) + cart panel (right), payment modal, receipt modal
  inventory-page.tsx    → Product table with inline editing, add product modal, stock badge
  categories-page.tsx   → Category grid with CRUD modal, color picker
  sales-page.tsx        → Sales table with receipt detail modal
  customers-page.tsx    → Customer list with add/view modal, loyalty points
  suppliers-page.tsx    → Supplier list
  adjustments-page.tsx  → Inventory adjustment log with add adjustment modal
  transfers-page.tsx    → Stock transfer between branches
  alerts-page.tsx       → Low stock & out-of-stock alerts
  reports-page.tsx      → Revenue/cost/profit chart + category breakdown
  audit-log-page.tsx    → System activity log with JSON changes
  settings-page.tsx     → Tabbed settings (5 tabs)
  rsge-page.tsx         → RS.GE integration (auth form + sync controls + log)
  distributor-orders-page.tsx → Distributor order system with real-time notifications
  placeholder-page.tsx  → Generic "coming soon" placeholder

lib/
  demo-data.ts          → All demo/mock data (products, categories, customers, sales, etc.)
  utils.ts              → cn() utility

scripts/
  jabson-schema.sql     → Full Supabase PostgreSQL schema (19 tables, triggers, RLS, indexes, seed data)
```

---

## Design System

### Color Palette
- **Primary**: `#16a34a` (green-600) — used for CTAs, active states, brand
- **Sidebar**: `#0f1724` (dark navy) — dark sidebar background
- **Background**: `#f9fafb` (light) / `#111827` (dark)
- **Cards**: `#ffffff` (light) / `#1f2937` (dark)
- **Destructive**: `#dc2626` (red)
- **Chart colors**: green, blue, amber, violet, red

### Dark Mode
Implemented via `className="dark"` on `<html>` element, toggled by `darkMode` state in `page.tsx`. All colors use CSS custom properties that swap between `:root` and `.dark` selectors.

### Print Styles (`@media print`)
Comprehensive print CSS is included in `globals.css`. When `window.print()` is called:
- **Hidden**: sidebar, topbar, buttons, inputs, modals, tooltips, command palette
- **Visible**: main content area, tables (formatted for A4), charts
- **Receipt mode**: `[data-print-receipt]` attribute forces 80mm thermal receipt layout
- **Utility classes**: `.no-print` / `[data-no-print]` to hide specific elements, `.print-only` / `.print-header` for print-only elements, `.page-break` for forced page breaks

---

## Key Features

### 1. POS System (`pos-page.tsx`)
- Product grid with category filter and barcode/name search
- Cart with quantity controls, promo code support (`JABSON10` for 10% off)
- 3 payment methods: cash, card, bank transfer
- Cash payment with change calculation
- Receipt modal with print button
- VAT 18% auto-calculation

### 2. Inventory Management (`inventory-page.tsx`)
- Full product CRUD (add, edit, view)
- Fields: name, barcode, SKU, category, price, cost, stock, unit, min stock level, POS visibility
- Stock status badges (in stock / low / out of stock)
- Search + category filter

### 3. Categories (`categories-page.tsx`)
- Category CRUD with color picker (8 preset colors)
- Auto product count per category
- Visual grid cards with color indicators

### 4. Inventory Adjustments (`adjustments-page.tsx`)
- Add/subtract stock with reason tracking
- Reasons: manual adjustment, damage, expired, return, count correction
- Full adjustment history log

### 5. Distributor Orders (`distributor-orders-page.tsx`)
- Distributors can create orders by selecting products + quantities
- Auto-calculated totals with delivery date
- Status workflow: pending -> confirmed -> delivered (or cancelled)
- **Real-time notifications**: when a new order is created, both admin and cashier get toast notification + it appears in the topbar notification dropdown
- Order detail view with item breakdown

### 6. RS.GE Integration (`rsge-page.tsx`)
- Authentication form: company tax ID (saidentifikacio kodi), service username, service password
- Connection status indicator (connected/disconnected)
- Sync controls for: waybills, invoices, product import, VAT data
- Auto-sync toggle with interval setting
- Sync history log with success/error status

### 7. Customers (`customers-page.tsx`)
- Customer CRUD with phone, address, loyalty points
- Purchase history per customer
- Total spent tracking

### 8. Reports (`reports-page.tsx`)
- Revenue / Cost / Profit line chart (monthly)
- Category breakdown bar chart
- Date range filter

### 9. Audit Log (`audit-log-page.tsx`)
- Full system activity log
- Shows user, action, entity, and JSON diff of changes
- Timestamped entries

### 10. Settings (`settings-page.tsx`)
- 5 tabs: General, Company, POS, Security, Team
- Currency, language, timezone settings
- Company profile (name, tax ID, address)
- POS config (receipt format, auto-print, sound)
- Security (2FA, session timeout)
- Team member management

### 11. Command Palette (`command-palette.tsx`)
- Ctrl+K keyboard shortcut
- Search across all pages + products
- Keyboard navigation (arrow keys + enter)

### 12. Notifications (`topbar.tsx`)
- Dropdown with unread indicator
- Types: stock alert (red), sale (green), distributor order (amber), system (blue)
- "Mark all read" action

---

## Database Schema (`scripts/jabson-schema.sql`)

### Tables (19 total):
1. `branches` — multi-branch support
2. `users` — team members with roles (admin/manager/cashier/accountant)
3. `company_settings` — company profile, tax info, currency
4. `categories` — product categories with color
5. `products` — full product catalog (price, cost, stock, barcode, SKU, etc.)
6. `customers` — CRM with loyalty
7. `suppliers` — supplier management
8. `sales` — sale transactions
9. `sale_items` — line items per sale
10. `inventory_adjustments` — stock adjustments with reasons
11. `stock_transfers` — branch-to-branch transfer headers
12. `stock_transfer_items` — transfer line items
13. `purchase_orders` — purchase orders from suppliers
14. `purchase_order_items` — PO line items
15. `audit_log` — system audit trail
16. `notifications` — push notifications
17. `promo_codes` — discount codes
18. `daily_stats` — aggregated daily metrics
19. `distributor_orders` + `distributor_order_items` — distributor order system

### Key Features in Schema:
- **Triggers**: auto `updated_at`, stock auto-deduction on sale, customer stats auto-update, receipt number generator
- **RLS**: Row Level Security enabled on all tables
- **Indexes**: on all foreign keys and frequently queried columns
- **Seed data**: demo products, categories, customers, sales for immediate testing

---

## What's NOT Yet Built (Placeholders)

These pages show a "coming soon" placeholder and need implementation:
- `purchases` — Purchase order management
- `accounting` — Bookkeeping / GL
- `cash-register` — Cash register / drawer management
- `waybills` — RS.GE waybill generation
- `invoices` — RS.GE invoice generation
- `company` — Company profile page (partially in settings)

---

## Recommendations for Next Steps

### High Priority
1. **Supabase Integration** — Connect the demo data to real Supabase tables using the provided SQL schema. Replace all `useState` demo data with SWR fetching from API routes.
2. **Authentication** — Add Supabase Auth with role-based access (admin, manager, cashier). The schema already has a `users` table with `role` field.
3. **Barcode Scanner** — Add real barcode scanning in POS using the Web Serial API or a USB barcode scanner input handler. The product data already has `barcode` fields.
4. **Receipt Printing** — Wire the "print" button in POS to `window.print()` with the `[data-print-receipt]` attribute. Print CSS is already configured for 80mm thermal paper.
5. **RS.GE API Integration** — Replace the demo auth/sync with actual RS.GE REST API calls for waybill and invoice management.

### Medium Priority
6. **Purchase Orders** — Build the purchases page with supplier selection, PO creation, and stock auto-increase on receiving.
7. **Cash Register Management** — Opening/closing shifts, cash counting, drawer reconciliation.
8. **Multi-branch Real-time Sync** — Use Supabase Realtime to sync inventory changes across branches instantly.
9. **Waybill Generation** — RS.GE waybill creation with product selection, transport details, and PDF generation.
10. **Export to Excel/PDF** — Add actual export functionality to the sales, inventory, and reports pages.

### Nice to Have (Premium)
11. **AI-Powered Demand Forecasting** — Use sales history to predict stock needs and auto-generate purchase orders.
12. **Customer SMS/Email Notifications** — Send receipts via SMS, loyalty point updates, promo codes.
13. **Offline Mode** — Service Worker + IndexedDB for POS functionality during internet outages, with sync-on-reconnect.
14. **Mobile POS App** — React Native version for tablet-based POS at checkout.
15. **Accounting Module** — Double-entry bookkeeping with chart of accounts, journal entries, P&L, and balance sheet.
16. **Employee Time Tracking** — Clock in/out, shift scheduling, overtime calculation.
17. **Kitchen/Order Display** — For restaurant mode: orders displayed on kitchen screen in real-time.
18. **Webhook System** — Allow external services to subscribe to events (new sale, low stock, etc.).
19. **White-label Support** — Custom branding per company (logo, colors, domain).
20. **Multi-currency Support** — USD/EUR alongside GEL with auto exchange rate.

---

## Environment Variables (for Supabase integration)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Running Locally
```bash
pnpm install
pnpm dev
```

The app runs as a demo with mock data. No database connection required for the demo.
