// Demo data for JABSON platform (no database required for demo)

export interface Product {
  id: string
  name: string
  sku: string
  barcode: string
  category: string
  categoryColor: string
  price: number
  costPrice: number
  stock: number
  minStock: number
  unit: string
  vatRate: number
  isActive: boolean
  posVisible: boolean
  image?: string
  updatedAt: string
}

export interface Sale {
  id: string
  receiptNumber: string
  customerName?: string
  items: SaleItem[]
  subtotal: number
  discount: number
  vatAmount: number
  total: number
  paymentMethod: 'cash' | 'card' | 'transfer'
  cashGiven?: number
  change?: number
  isReturn: boolean
  createdBy: string
  createdAt: string
}

export interface SaleItem {
  id: string
  productId: string
  name: string
  quantity: number
  price: number
  discount: number
  total: number
}

export interface Customer {
  id: string
  name: string
  tin?: string
  phone?: string
  email?: string
  address?: string
  balance: number
  totalSpent: number
  visitCount: number
  loyaltyPts: number
  createdAt: string
}

export interface Supplier {
  id: string
  name: string
  tin?: string
  phone?: string
  email?: string
  balance: number
  createdAt: string
}

export interface InventoryAdjustment {
  id: string
  productId: string
  productName: string
  qtyBefore: number
  qtyAfter: number
  qtyChange: number
  reason: string
  notes?: string
  createdBy: string
  createdAt: string
}

export interface StockTransfer {
  id: string
  fromBranch: string
  toBranch: string
  status: 'pending' | 'completed' | 'cancelled'
  items: { name: string; quantity: number }[]
  createdBy: string
  createdAt: string
}

export interface AuditLogEntry {
  id: string
  userEmail: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  tableName: string
  recordId: string
  oldData?: Record<string, unknown>
  newData?: Record<string, unknown>
  createdAt: string
}

export interface Notification {
  id: string
  type: 'stock_alert' | 'sale' | 'system' | 'transfer' | 'distributor_order'
  title: string
  body: string
  isRead: boolean
  createdAt: string
}

export const categories = [
  { id: 'cat-1', name: 'სასმელი', color: '#3b82f6', icon: 'wine' },
  { id: 'cat-2', name: 'საკვები', color: '#f59e0b', icon: 'utensils' },
  { id: 'cat-3', name: 'ტკბილეული', color: '#ec4899', icon: 'candy' },
  { id: 'cat-4', name: 'ჰიგიენა', color: '#8b5cf6', icon: 'sparkles' },
  { id: 'cat-5', name: 'საყოფაცხოვრებო', color: '#06b6d4', icon: 'home' },
  { id: 'cat-6', name: 'რძის პროდუქტი', color: '#22c55e', icon: 'milk' },
]

export const products: Product[] = [
  { id: 'p-1', name: 'კოკა-კოლა 0.5ლ', sku: 'SKU-001', barcode: '5449000000996', category: 'სასმელი', categoryColor: '#3b82f6', price: 2.50, costPrice: 1.80, stock: 145, minStock: 20, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-28' },
  { id: 'p-2', name: 'ფანტა 0.5ლ', sku: 'SKU-002', barcode: '5449000011527', category: 'სასმელი', categoryColor: '#3b82f6', price: 2.50, costPrice: 1.80, stock: 89, minStock: 20, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-28' },
  { id: 'p-3', name: 'ბორჯომი 0.5ლ', sku: 'SKU-003', barcode: '4860019001377', category: 'სასმელი', categoryColor: '#3b82f6', price: 1.80, costPrice: 1.20, stock: 200, minStock: 30, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-27' },
  { id: 'p-4', name: 'ნაბეღლავი 1ლ', sku: 'SKU-004', barcode: '4860019001384', category: 'სასმელი', categoryColor: '#3b82f6', price: 1.50, costPrice: 0.90, stock: 310, minStock: 50, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-27' },
  { id: 'p-5', name: 'ლაგერი ლუდი 0.5ლ', sku: 'SKU-005', barcode: '4860019002345', category: 'სასმელი', categoryColor: '#3b82f6', price: 3.50, costPrice: 2.40, stock: 78, minStock: 15, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-26' },
  { id: 'p-6', name: 'პური შავი', sku: 'SKU-006', barcode: '4860019003456', category: 'საკვები', categoryColor: '#f59e0b', price: 1.50, costPrice: 0.80, stock: 45, minStock: 10, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-28' },
  { id: 'p-7', name: 'ყველი იმერული 1კგ', sku: 'SKU-007', barcode: '4860019004567', category: 'რძის პროდუქტი', categoryColor: '#22c55e', price: 14.00, costPrice: 10.50, stock: 22, minStock: 5, unit: 'კგ', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-28' },
  { id: 'p-8', name: 'რძე 1ლ', sku: 'SKU-008', barcode: '4860019005678', category: 'რძის პროდუქტი', categoryColor: '#22c55e', price: 4.50, costPrice: 3.20, stock: 67, minStock: 15, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-28' },
  { id: 'p-9', name: 'შოკოლადი ბარამბო', sku: 'SKU-009', barcode: '4860019006789', category: 'ტკბილეული', categoryColor: '#ec4899', price: 3.20, costPrice: 2.10, stock: 156, minStock: 25, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-27' },
  { id: 'p-10', name: 'ჩიფსი ლეისი', sku: 'SKU-010', barcode: '4860019007890', category: 'საკვები', categoryColor: '#f59e0b', price: 4.80, costPrice: 3.50, stock: 93, minStock: 20, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-26' },
  { id: 'p-11', name: 'სარეცხი ფხვნილი 3კგ', sku: 'SKU-011', barcode: '4860019008901', category: 'საყოფაცხოვრებო', categoryColor: '#06b6d4', price: 18.00, costPrice: 13.50, stock: 8, minStock: 10, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-25' },
  { id: 'p-12', name: 'კბილის პასტა კოლგეიტი', sku: 'SKU-012', barcode: '4860019009012', category: 'ჰიგიენა', categoryColor: '#8b5cf6', price: 6.50, costPrice: 4.20, stock: 3, minStock: 10, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-25' },
  { id: 'p-13', name: 'მაკარონი სპაგეტი 500გ', sku: 'SKU-013', barcode: '4860019010123', category: 'საკვები', categoryColor: '#f59e0b', price: 3.00, costPrice: 1.90, stock: 120, minStock: 20, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-24' },
  { id: 'p-14', name: 'ზეთისხილის ზეთი 1ლ', sku: 'SKU-014', barcode: '4860019011234', category: 'საკვები', categoryColor: '#f59e0b', price: 22.00, costPrice: 16.00, stock: 34, minStock: 8, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-24' },
  { id: 'p-15', name: 'კარაქი 200გ', sku: 'SKU-015', barcode: '4860019012345', category: 'რძის პროდუქტი', categoryColor: '#22c55e', price: 7.80, costPrice: 5.60, stock: 42, minStock: 10, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-23' },
  { id: 'p-16', name: 'საპონი 100გ', sku: 'SKU-016', barcode: '4860019013456', category: 'ჰიგიენა', categoryColor: '#8b5cf6', price: 2.20, costPrice: 1.30, stock: 0, minStock: 15, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true, updatedAt: '2026-02-22' },
]

export const sales: Sale[] = [
  {
    id: 's-1', receiptNumber: 'RC-000142', customerName: 'გიორგი მაისურაძე',
    items: [
      { id: 'si-1', productId: 'p-1', name: 'კოკა-კოლა 0.5ლ', quantity: 3, price: 2.50, discount: 0, total: 7.50 },
      { id: 'si-2', productId: 'p-6', name: 'პური შავი', quantity: 2, price: 1.50, discount: 0, total: 3.00 },
    ],
    subtotal: 10.50, discount: 0, vatAmount: 1.89, total: 10.50,
    paymentMethod: 'cash', cashGiven: 20, change: 9.50, isReturn: false,
    createdBy: 'ნინო ბერიძე', createdAt: '2026-03-01T10:35:00Z'
  },
  {
    id: 's-2', receiptNumber: 'RC-000143',
    items: [
      { id: 'si-3', productId: 'p-7', name: 'ყველი იმერული 1კგ', quantity: 0.5, price: 14.00, discount: 0, total: 7.00 },
      { id: 'si-4', productId: 'p-8', name: 'რძე 1ლ', quantity: 2, price: 4.50, discount: 0, total: 9.00 },
      { id: 'si-5', productId: 'p-15', name: 'კარაქი 200გ', quantity: 1, price: 7.80, discount: 0, total: 7.80 },
    ],
    subtotal: 23.80, discount: 0, vatAmount: 4.28, total: 23.80,
    paymentMethod: 'card', isReturn: false,
    createdBy: 'ნინო ბერიძე', createdAt: '2026-03-01T11:22:00Z'
  },
  {
    id: 's-3', receiptNumber: 'RC-000144', customerName: 'ანა კვარაცხელია',
    items: [
      { id: 'si-6', productId: 'p-9', name: 'შოკოლადი ბარამბო', quantity: 5, price: 3.20, discount: 0, total: 16.00 },
      { id: 'si-7', productId: 'p-3', name: 'ბორჯომი 0.5ლ', quantity: 6, price: 1.80, discount: 0, total: 10.80 },
    ],
    subtotal: 26.80, discount: 2.68, vatAmount: 4.34, total: 24.12,
    paymentMethod: 'cash', cashGiven: 25, change: 0.88, isReturn: false,
    createdBy: 'დავით ქუთათელაძე', createdAt: '2026-03-01T13:15:00Z'
  },
  {
    id: 's-4', receiptNumber: 'RC-000145',
    items: [
      { id: 'si-8', productId: 'p-11', name: 'სარეცხი ფხვნილი 3კგ', quantity: 1, price: 18.00, discount: 0, total: 18.00 },
      { id: 'si-9', productId: 'p-12', name: 'კბილის პასტა კოლგეიტი', quantity: 2, price: 6.50, discount: 0, total: 13.00 },
    ],
    subtotal: 31.00, discount: 0, vatAmount: 5.58, total: 31.00,
    paymentMethod: 'transfer', isReturn: false,
    createdBy: 'ნინო ბერიძე', createdAt: '2026-03-01T14:50:00Z'
  },
  {
    id: 's-5', receiptNumber: 'RC-000146',
    items: [
      { id: 'si-10', productId: 'p-14', name: 'ზეთისხილის ზეთი 1ლ', quantity: 1, price: 22.00, discount: 0, total: 22.00 },
    ],
    subtotal: 22.00, discount: 0, vatAmount: 3.96, total: 22.00,
    paymentMethod: 'card', isReturn: false,
    createdBy: 'დავით ქუთათელაძე', createdAt: '2026-02-28T16:30:00Z'
  },
]

export const customers: Customer[] = [
  { id: 'c-1', name: 'გიორგი მაისურაძე', tin: '123456789', phone: '599123456', email: 'giorgi@mail.ge', balance: 0, totalSpent: 1250.80, visitCount: 45, loyaltyPts: 125, createdAt: '2025-06-15' },
  { id: 'c-2', name: 'ანა კვარაცხელია', phone: '555987654', email: 'ana@mail.ge', balance: 50.00, totalSpent: 3420.50, visitCount: 89, loyaltyPts: 342, createdAt: '2025-04-20' },
  { id: 'c-3', name: 'ნიკა გელაშვილი', tin: '987654321', phone: '577111222', balance: -120.00, totalSpent: 890.00, visitCount: 12, loyaltyPts: 89, createdAt: '2025-09-10' },
  { id: 'c-4', name: 'მარიამ ჯავახიშვილი', phone: '591456789', balance: 0, totalSpent: 560.30, visitCount: 23, loyaltyPts: 56, createdAt: '2025-11-05' },
  { id: 'c-5', name: 'შპს "დელტა"', tin: '404123456', phone: '322123456', email: 'info@delta.ge', address: 'თბილისი, რუსთაველის 12', balance: 850.00, totalSpent: 15600.00, visitCount: 120, loyaltyPts: 1560, createdAt: '2025-01-10' },
]

export const suppliers: Supplier[] = [
  { id: 'sup-1', name: 'შპს "გადამამუშავებელი"', tin: '100200300', phone: '322555111', email: 'info@supplier1.ge', balance: -2500.00, createdAt: '2025-03-15' },
  { id: 'sup-2', name: 'შპს "სასმელების დისტრიბუტორი"', tin: '100200301', phone: '322555222', balance: -800.00, createdAt: '2025-05-20' },
  { id: 'sup-3', name: 'იპ "ზვიად მეღვინეთხუცესი"', phone: '599777888', balance: 0, createdAt: '2025-07-10' },
]

export const inventoryAdjustments: InventoryAdjustment[] = [
  { id: 'adj-1', productId: 'p-12', productName: 'კბილის პასტა კოლგეიტი', qtyBefore: 15, qtyAfter: 3, qtyChange: -12, reason: 'damage', notes: 'დაზიანებული პარტია', createdBy: 'ნინო ბერიძე', createdAt: '2026-02-25T09:00:00Z' },
  { id: 'adj-2', productId: 'p-16', productName: 'საპონი 100გ', qtyBefore: 25, qtyAfter: 0, qtyChange: -25, reason: 'expiry', notes: 'ვადაგასული', createdBy: 'დავით ქუთათელაძე', createdAt: '2026-02-22T14:30:00Z' },
  { id: 'adj-3', productId: 'p-1', productName: 'კოკა-კოლა 0.5ლ', qtyBefore: 140, qtyAfter: 145, qtyChange: 5, reason: 'correction', notes: 'ინვენტარიზაციის შემდეგ', createdBy: 'ნინო ბერიძე', createdAt: '2026-02-20T11:00:00Z' },
]

export const stockTransfers: StockTransfer[] = [
  { id: 'tr-1', fromBranch: 'მთავარი მაღაზია', toBranch: 'ფილიალი #2 — ვაკე', status: 'completed', items: [{ name: 'კოკა-კოლა 0.5ლ', quantity: 50 }, { name: 'ფანტა 0.5ლ', quantity: 30 }], createdBy: 'ნინო ბერიძე', createdAt: '2026-02-27T10:00:00Z' },
  { id: 'tr-2', fromBranch: 'ფილიალი #2 — ვაკე', toBranch: 'მთავარი მაღაზია', status: 'pending', items: [{ name: 'ყველი იმერული 1კგ', quantity: 5 }], createdBy: 'დავით ქუთათელაძე', createdAt: '2026-03-01T08:00:00Z' },
]

export const auditLog: AuditLogEntry[] = [
  { id: 'al-1', userEmail: 'nino@jabson.ge', action: 'CREATE', tableName: 'products', recordId: 'p-16', newData: { name: 'საპონი 100გ', price: 2.20 }, createdAt: '2026-02-22T10:00:00Z' },
  { id: 'al-2', userEmail: 'nino@jabson.ge', action: 'UPDATE', tableName: 'products', recordId: 'p-1', oldData: { stock: 140 }, newData: { stock: 145 }, createdAt: '2026-02-20T11:00:00Z' },
  { id: 'al-3', userEmail: 'davit@jabson.ge', action: 'CREATE', tableName: 'sales', recordId: 's-3', newData: { total: 24.12, receipt: 'RC-000144' }, createdAt: '2026-03-01T13:15:00Z' },
  { id: 'al-4', userEmail: 'davit@jabson.ge', action: 'DELETE', tableName: 'inventory_adjustments', recordId: 'adj-old', oldData: { product: 'test', qty: 10 }, createdAt: '2026-02-19T09:30:00Z' },
  { id: 'al-5', userEmail: 'nino@jabson.ge', action: 'UPDATE', tableName: 'branch_settings', recordId: 'bs-1', oldData: { vat_payer: false }, newData: { vat_payer: true }, createdAt: '2026-02-18T15:00:00Z' },
]

export const notifications: Notification[] = [
  { id: 'n-1', type: 'stock_alert', title: 'მარაგი ამოიწურა', body: 'საპონი 100გ — 0 ც (მინ: 15)', isRead: false, createdAt: '2026-03-01T09:00:00Z' },
  { id: 'n-2', type: 'stock_alert', title: 'დაბალი მარაგი', body: 'კბილის პასტა კოლგეიტი — 3 ც (მინ: 10)', isRead: false, createdAt: '2026-03-01T09:00:00Z' },
  { id: 'n-3', type: 'stock_alert', title: 'დაბალი მარაგი', body: 'სარეცხი ფხვნილი 3კგ — 8 ც (მინ: 10)', isRead: false, createdAt: '2026-03-01T09:00:00Z' },
  { id: 'n-4', type: 'sale', title: 'ახალი გაყიდვა', body: 'RC-000144 — 24.12 ₾', isRead: true, createdAt: '2026-03-01T13:15:00Z' },
  { id: 'n-5', type: 'transfer', title: 'მოლოდინში გადატანა', body: 'ფილიალი #2 → მთავარი: ყველი იმერული 5კგ', isRead: false, createdAt: '2026-03-01T08:00:00Z' },
  { id: 'n-6', type: 'distributor_order', title: 'ახალი დისტრ. შეკვეთა', body: 'DO-2026-0087 — სასმელების დისტრიბუტორი — 600.00 ₾', isRead: false, createdAt: '2026-03-01T09:30:00Z' },
]

export const dailyStats = {
  todaySales: 111.42,
  todayOrders: 4,
  todayProfit: 28.65,
  avgCheck: 27.86,
  todaySalesChange: 12.5,
  todayOrdersChange: -8.3,
  todayProfitChange: 15.2,
  avgCheckChange: 5.8,
}

export const weeklySalesData = [
  { day: 'ორშ', sales: 580, orders: 23 },
  { day: 'სამ', sales: 720, orders: 28 },
  { day: 'ოთხ', sales: 650, orders: 25 },
  { day: 'ხუთ', sales: 890, orders: 34 },
  { day: 'პარ', sales: 1100, orders: 42 },
  { day: 'შაბ', sales: 1350, orders: 51 },
  { day: 'კვი', sales: 480, orders: 19 },
]

export const monthlySalesData = [
  { month: 'სექ', sales: 18500, expenses: 14200 },
  { month: 'ოქტ', sales: 21300, expenses: 15800 },
  { month: 'ნოე', sales: 19800, expenses: 14500 },
  { month: 'დეკ', sales: 28500, expenses: 19200 },
  { month: 'იან', sales: 22100, expenses: 16300 },
  { month: 'თებ', sales: 24800, expenses: 17100 },
]

export const topProducts = [
  { name: 'კოკა-კოლა 0.5ლ', quantity: 342, revenue: 855.00 },
  { name: 'ბორჯომი 0.5ლ', quantity: 289, revenue: 520.20 },
  { name: 'პური შავი', quantity: 256, revenue: 384.00 },
  { name: 'შოკოლადი ბარამბო', quantity: 198, revenue: 633.60 },
  { name: 'რძე 1ლ', quantity: 167, revenue: 751.50 },
]

export const paymentBreakdown = [
  { method: 'ნაღდი', value: 58, amount: 14380 },
  { method: 'ბარათი', value: 35, amount: 8680 },
  { method: 'გადარიცხვა', value: 7, amount: 1740 },
]

export const formatCurrency = (amount: number): string => {
  // Use fixed formatting to avoid hydration mismatches between server/client locales
  const fixed = Math.abs(amount).toFixed(2)
  const [intPart, decPart] = fixed.split('.')
  // Format with space as thousands separator
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${amount < 0 ? '-' : ''}${formatted}.${decPart} \u20BE`
}

export const formatDate = (date: string): string => {
  // Use fixed formatting to avoid hydration mismatches
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

export const formatDateLocale = (date: string): string => {
  return new Date(date).toLocaleDateString('ka-GE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const reasonLabels: Record<string, string> = {
  correction: 'კორექტირება',
  damage: 'დაზიანება',
  theft: 'ქურდობა',
  expiry: 'ვადაგასული',
  initial: 'საწყისი',
  other: 'სხვა',
}

// Purchase Orders
export interface PurchaseOrder {
  id: string
  orderNumber: string
  supplierId: string
  supplierName: string
  status: 'draft' | 'ordered' | 'partial' | 'received' | 'cancelled'
  total: number
  itemCount: number
  expectedDate: string | null
  receivedDate: string | null
  createdAt: string
  items?: PurchaseOrderItem[]
}

export interface PurchaseOrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  receivedQty: number
  unitCost: number
  total: number
}

export const demoPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    orderNumber: 'PO-001000',
    supplierId: 'sup-1',
    supplierName: 'შპს "გადამამუშავებელი"',
    status: 'received',
    total: 2450.00,
    itemCount: 8,
    expectedDate: '2024-01-20',
    receivedDate: '2024-01-19',
    createdAt: '2024-01-15',
    items: [
      { id: 'poi-1', productId: 'p-1', productName: 'კოკა-კოლა 0.5ლ', quantity: 100, receivedQty: 100, unitCost: 1.80, total: 180 },
      { id: 'poi-2', productId: 'p-2', productName: 'ფანტა 0.5ლ', quantity: 80, receivedQty: 80, unitCost: 1.80, total: 144 },
    ]
  },
  {
    id: '2',
    orderNumber: 'PO-001001',
    supplierId: 'sup-2',
    supplierName: 'შპს "სასმელების დისტრ."',
    status: 'ordered',
    total: 890.00,
    itemCount: 5,
    expectedDate: '2024-01-25',
    receivedDate: null,
    createdAt: '2024-01-18',
  },
  {
    id: '3',
    orderNumber: 'PO-001002',
    supplierId: 'sup-1',
    supplierName: 'შპს "გადამამუშავებელი"',
    status: 'draft',
    total: 1200.00,
    itemCount: 3,
    expectedDate: null,
    receivedDate: null,
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    orderNumber: 'PO-001003',
    supplierId: 'sup-3',
    supplierName: 'იპ "ზვიად მეღვინეთხუცესი"',
    status: 'partial',
    total: 1850.00,
    itemCount: 4,
    expectedDate: '2024-01-22',
    receivedDate: null,
    createdAt: '2024-01-17',
  },
]

// Cash Sessions
export interface CashSession {
  id: string
  status: 'open' | 'closed'
  openedBy: string
  openingCash: number
  closingCash: number | null
  expectedCash: number | null
  totalSales: number
  totalCash: number
  totalCard: number
  receiptCount: number
  openedAt: string
  closedAt: string | null
}

export interface CashMovement {
  id: string
  sessionId: string
  type: 'in' | 'out'
  amount: number
  description: string
  createdAt: string
}

export const demoCashSessions: CashSession[] = [
  {
    id: 'cs-1',
    status: 'closed',
    openedBy: 'ნინო კვარაცხელია',
    openingCash: 200,
    closingCash: 1440,
    expectedCash: 1440,
    totalSales: 3240,
    totalCash: 1240,
    totalCard: 890,
    receiptCount: 23,
    openedAt: '2024-01-20T09:15:00',
    closedAt: '2024-01-20T23:45:00',
  },
  {
    id: 'cs-2',
    status: 'closed',
    openedBy: 'დავით ქუთათელაძე',
    openingCash: 150,
    closingCash: 980,
    expectedCash: 980,
    totalSales: 2100,
    totalCash: 830,
    totalCard: 650,
    receiptCount: 18,
    openedAt: '2024-01-19T08:30:00',
    closedAt: '2024-01-19T22:00:00',
  },
]

export const demoCashMovements: CashMovement[] = [
  { id: 'cm-1', sessionId: 'cs-1', type: 'in', amount: 200, description: 'საწყისი ნაღდი', createdAt: '2024-01-20T09:15:00' },
  { id: 'cm-2', sessionId: 'cs-1', type: 'out', amount: 50, description: 'ხურდა გაცემა', createdAt: '2024-01-20T11:30:00' },
  { id: 'cm-3', sessionId: 'cs-1', type: 'in', amount: 100, description: 'დამატებითი შემოტანა', createdAt: '2024-01-20T15:00:00' },
]

// Waybills
export interface Waybill {
  id: string
  rsNumber: string | null
  type: 1 | 2 | 3 | 4
  status: 'draft' | 'sent' | 'confirmed' | 'rejected' | 'closed'
  buyerName: string
  buyerTin: string
  total: number
  sentAt: string | null
  createdAt: string
  items?: WaybillItem[]
  startAddress?: string
  endAddress?: string
  carNumber?: string
  driverTin?: string
}

export interface WaybillItem {
  id: string
  name: string
  quantity: number
  unit: string
  price: number
  total: number
}

export const demoWaybills: Waybill[] = [
  { 
    id: 'wb-1', 
    rsNumber: 'WB-000123', 
    type: 1, 
    status: 'confirmed', 
    buyerName: 'შპს "Delta"', 
    buyerTin: '404123456', 
    total: 1250.00, 
    sentAt: '2024-01-18',
    createdAt: '2024-01-18',
    startAddress: 'თბილისი, რუსთაველის 12',
    endAddress: 'თბილისი, ვაკე, ჭავჭავაძ��ს 5',
    carNumber: 'AA-123-BB',
  },
  { 
    id: 'wb-2', 
    rsNumber: null, 
    type: 1, 
    status: 'draft', 
    buyerName: 'გიორგი მაისურაძე', 
    buyerTin: '123456789', 
    total: 340.00, 
    sentAt: null,
    createdAt: '2024-01-20',
  },
  { 
    id: 'wb-3', 
    rsNumber: 'WB-000124', 
    type: 2, 
    status: 'sent', 
    buyerName: 'Foreign Co.', 
    buyerTin: '987654321', 
    total: 5600.00, 
    sentAt: '2024-01-20',
    createdAt: '2024-01-19',
  },
  { 
    id: 'wb-4', 
    rsNumber: 'WB-000125', 
    type: 3, 
    status: 'confirmed', 
    buyerName: 'Import LLC', 
    buyerTin: '555666777', 
    total: 8900.00, 
    sentAt: '2024-01-15',
    createdAt: '2024-01-14',
  },
  { 
    id: 'wb-5', 
    rsNumber: null, 
    type: 4, 
    status: 'draft', 
    buyerName: 'შპს "Delta"', 
    buyerTin: '404123456', 
    total: 120.00, 
    sentAt: null,
    createdAt: '2024-01-21',
  },
]

// Invoices
export interface Invoice {
  id: string
  rsNumber: string | null
  status: 'draft' | 'sent' | 'confirmed' | 'rejected'
  buyerName: string
  buyerTin: string | null
  total: number
  vatAmount: number
  comment?: string
  createdAt: string
  items?: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  name: string
  quantity: number
  price: number
  vatRate: number
  total: number
}

export const demoInvoices: Invoice[] = [
  { 
    id: 'inv-1', 
    rsNumber: 'INV-000045', 
    status: 'confirmed', 
    buyerName: 'შპს "Delta"', 
    buyerTin: '404123456', 
    total: 3600.00, 
    vatAmount: 648.00, 
    createdAt: '2024-01-15' 
  },
  { 
    id: 'inv-2', 
    rsNumber: null, 
    status: 'draft', 
    buyerName: 'ანა კვარაცხელია', 
    buyerTin: null, 
    total: 240.00, 
    vatAmount: 43.20, 
    createdAt: '2024-01-20' 
  },
  { 
    id: 'inv-3', 
    rsNumber: 'INV-000046', 
    status: 'sent', 
    buyerName: 'გიორგი მაისურაძე', 
    buyerTin: '123456789', 
    total: 890.00, 
    vatAmount: 160.20, 
    createdAt: '2024-01-19' 
  },
]

// Accounting Transactions
export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  reference?: string
  createdAt: string
}

export const demoTransactions: Transaction[] = [
  { id: 'tr-1', type: 'income', amount: 3240.50, category: 'გაყიდვები', description: 'POS გაყიდვები', reference: 'CS-001', createdAt: '2024-01-20' },
  { id: 'tr-2', type: 'expense', amount: 1200.00, category: 'შეძენები', description: 'PO-001000 - გადამამუშავებელი', reference: 'PO-001000', createdAt: '2024-01-19' },
  { id: 'tr-3', type: 'expense', amount: 500.00, category: 'ქირა', description: 'ოფისის ქირა', createdAt: '2024-01-01' },
  { id: 'tr-4', type: 'income', amount: 890.00, category: 'გაყიდვები', description: 'POS გაყიდვები', reference: 'CS-002', createdAt: '2024-01-18' },
  { id: 'tr-5', type: 'expense', amount: 350.00, category: 'კომუნალური', description: 'ელ. ენერგია', createdAt: '2024-01-15' },
  { id: 'tr-6', type: 'expense', amount: 2500.00, category: 'ხელფასი', description: 'თანამშრომლების ხელფასი', createdAt: '2024-01-10' },
  { id: 'tr-7', type: 'income', amount: 1560.00, category: 'გაყიდვები', description: 'POS გაყიდვები', createdAt: '2024-01-17' },
  { id: 'tr-8', type: 'expense', amount: 180.00, category: 'სხვა', description: 'საოფისე ნივთები', createdAt: '2024-01-12' },
]

export const incomeCategories = ['გაყიდვები', 'მომსახურება', 'სხვა']
export const expenseCategories = ['შეძენები', 'ხელფასი', 'ქირა', 'კომუნალური', 'სხვა']

// Company/Branches
export interface Branch {
  id: string
  name: string
  address: string
  phone: string
  isMain: boolean
  isActive: boolean
}

export const demoBranches: Branch[] = [
  { id: 'br-1', name: 'მთავარი მაღაზია', address: 'თბილისი, რუსთაველის 12', phone: '032 2 123 456', isMain: true, isActive: true },
  { id: 'br-2', name: 'ფილიალი #2 - ვაკე', address: 'თბილისი, ვაკე, ჭავჭავაძის 5', phone: '032 2 789 012', isMain: false, isActive: true },
]

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'manager' | 'cashier'
  branchId: string
  isActive: boolean
}

export const demoTeamMembers: TeamMember[] = [
  { id: 'tm-1', name: 'ნინო ბერიძე', email: 'nino@jabson.ge', role: 'owner', branchId: 'br-1', isActive: true },
  { id: 'tm-2', name: 'დავით ქუთათელაძე', email: 'davit@jabson.ge', role: 'manager', branchId: 'br-1', isActive: true },
  { id: 'tm-3', name: 'ანა კვარაცხელია', email: 'ana@jabson.ge', role: 'cashier', branchId: 'br-2', isActive: true },
]

export const roleLabels: Record<string, string> = {
  owner: 'მფლობელი',
  admin: 'ადმინისტრატორი',
  manager: 'მენეჯერი',
  cashier: 'მოლარე',
}

// Company settings
export const companySettings = {
  name: 'შპს "ჯაბსონი"',
  tin: '400100200',
  isVatPayer: true,
  address: 'თბილისი, რუსთაველის 12',
  phone: '032 2 123 456',
  email: 'info@jabson.ge',
}
