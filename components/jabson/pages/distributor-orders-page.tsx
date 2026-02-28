'use client'

import { useState } from 'react'
import {
  Truck, Package, Plus, Search, Eye, Check, X, Clock, CheckCircle2,
  XCircle, AlertCircle, Bell, ArrowRight, Filter, ChevronDown, Send,
  MessageSquare, User
} from 'lucide-react'
import { products as demoProducts, formatCurrency, formatDate, suppliers } from '@/lib/demo-data'

interface DistributorOrder {
  id: string
  orderNumber: string
  distributorName: string
  distributorPhone?: string
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled'
  items: DistributorOrderItem[]
  total: number
  notes?: string
  notifiedAdmin: boolean
  notifiedCashier: boolean
  createdAt: string
  updatedAt: string
}

interface DistributorOrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

const demoOrders: DistributorOrder[] = [
  {
    id: 'do-1',
    orderNumber: 'DO-2026-0087',
    distributorName: 'შპს "სასმელების დისტრიბუტორი"',
    distributorPhone: '322555222',
    status: 'pending',
    items: [
      { productId: 'p-1', productName: 'კოკა-კოლა 0.5ლ', quantity: 120, unitPrice: 1.80, total: 216.00 },
      { productId: 'p-2', productName: 'ფანტა 0.5ლ', quantity: 80, unitPrice: 1.80, total: 144.00 },
      { productId: 'p-3', productName: 'ბორჯომი 0.5ლ', quantity: 200, unitPrice: 1.20, total: 240.00 },
    ],
    total: 600.00,
    notes: 'გთხოვთ ხუთშაბათამდე მიწოდება',
    notifiedAdmin: true,
    notifiedCashier: true,
    createdAt: '2026-03-01T09:30:00Z',
    updatedAt: '2026-03-01T09:30:00Z',
  },
  {
    id: 'do-2',
    orderNumber: 'DO-2026-0086',
    distributorName: 'შპს "გადამამუშავებელი"',
    distributorPhone: '322555111',
    status: 'confirmed',
    items: [
      { productId: 'p-7', productName: 'ყველი იმერული 1კგ', quantity: 30, unitPrice: 10.50, total: 315.00 },
      { productId: 'p-8', productName: 'რძე 1ლ', quantity: 100, unitPrice: 3.20, total: 320.00 },
      { productId: 'p-15', productName: 'კარაქი 200გ', quantity: 50, unitPrice: 5.60, total: 280.00 },
    ],
    total: 915.00,
    notifiedAdmin: true,
    notifiedCashier: true,
    createdAt: '2026-02-28T14:00:00Z',
    updatedAt: '2026-02-28T16:30:00Z',
  },
  {
    id: 'do-3',
    orderNumber: 'DO-2026-0085',
    distributorName: 'იპ "ზვიად მეღვინეთხუცესი"',
    distributorPhone: '599777888',
    status: 'delivered',
    items: [
      { productId: 'p-5', productName: 'ლაგერი ლუდი 0.5ლ', quantity: 60, unitPrice: 2.40, total: 144.00 },
    ],
    total: 144.00,
    notes: 'პარტია #B-445',
    notifiedAdmin: true,
    notifiedCashier: true,
    createdAt: '2026-02-27T10:00:00Z',
    updatedAt: '2026-02-27T18:00:00Z',
  },
  {
    id: 'do-4',
    orderNumber: 'DO-2026-0084',
    distributorName: 'შპს "სასმელების დისტრიბუტორი"',
    status: 'cancelled',
    items: [
      { productId: 'p-4', productName: 'ნაბეღლავი 1ლ', quantity: 300, unitPrice: 0.90, total: 270.00 },
    ],
    total: 270.00,
    notes: 'გაუქმდა მომწოდებლის მოთხოვნით',
    notifiedAdmin: true,
    notifiedCashier: false,
    createdAt: '2026-02-26T11:00:00Z',
    updatedAt: '2026-02-26T14:00:00Z',
  },
]

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: 'მოლოდინში', color: '#d97706', bg: '#fef3c7', icon: Clock },
  confirmed: { label: 'დადასტურებული', color: '#2563eb', bg: '#dbeafe', icon: CheckCircle2 },
  processing: { label: 'მზადდება', color: '#7c3aed', bg: '#ede9fe', icon: Package },
  delivered: { label: 'მიწოდებული', color: '#16a34a', bg: '#dcfce7', icon: CheckCircle2 },
  cancelled: { label: 'გაუქმებული', color: '#6b7280', bg: '#f3f4f6', icon: XCircle },
}

export function DistributorOrdersPage() {
  const [orders, setOrders] = useState<DistributorOrder[]>(demoOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showNewOrder, setShowNewOrder] = useState(false)
  const [viewOrder, setViewOrder] = useState<DistributorOrder | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  const filtered = orders.filter((o) => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.distributorName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const totalValue = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus as DistributorOrder['status'], updatedAt: new Date().toISOString() }
          : o
      )
    )
    const statusLabels: Record<string, string> = {
      confirmed: 'დადასტურდა',
      processing: 'მზადება დაიწყო',
      delivered: 'მიწოდებულია',
      cancelled: 'გაუქმდა',
    }
    showNotification(`შეკვეთა ${statusLabels[newStatus] || newStatus} — ადმინი და მოლარე შეტყობინებულია`)
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className="fixed top-4 right-4 z-[80] flex items-center gap-3 px-5 py-3.5 rounded-xl animate-in slide-in-from-top-2 fade-in duration-300"
          style={{ background: '#16a34a', color: 'white', boxShadow: '0 10px 25px rgb(22 163 74/0.4)' }}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[0.875rem] font-medium">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'დისტრიბუტორის შეკვეთები'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {'მომწოდებლებისგან შეკვეთების მიღება და მართვა'}
          </p>
        </div>
        <button
          onClick={() => setShowNewOrder(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium transition-all"
          style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}
        >
          <Plus className="w-4 h-4" />
          {'ახალი შეკვეთა'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#d9770615', color: '#d97706' }}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მოლოდინში'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#d97706' }}>{pendingCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'სულ შეკვეთა'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{orders.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#16a34a15', color: '#16a34a' }}>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მიწოდებული'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#16a34a' }}>{orders.filter((o) => o.status === 'delivered').length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ჯამური ღირებულება'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{formatCurrency(totalValue)}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ძიება შეკვეთის ნომრით, დისტრიბუტორით..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-[0.875rem] outline-none"
            style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-[0.875rem] cursor-pointer"
          style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
        >
          <option value="all">{'ყველა სტატუსი'}</option>
          <option value="pending">{'მოლოდინში'}</option>
          <option value="confirmed">{'დადასტურებული'}</option>
          <option value="processing">{'მზადდება'}</option>
          <option value="delivered">{'მიწოდებული'}</option>
          <option value="cancelled">{'გაუქმებული'}</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--secondary)' }}>
                <th className="px-5 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'შეკვეთა'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'დისტრიბუტორი'}</th>
                <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'პროდუქტები'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ჯამი'}</th>
                <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'სტატუსი'}</th>
                <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'შეტყობინება'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{''}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const sc = statusConfig[order.status]
                const StatusIcon = sc.icon
                return (
                  <tr
                    key={order.id}
                    className="transition-colors group"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="text-[0.875rem] font-semibold font-mono" style={{ color: 'var(--foreground)' }}>{order.orderNumber}</div>
                      <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[0.875rem] font-medium" style={{ color: 'var(--foreground)' }}>{order.distributorName}</div>
                      {order.distributorPhone && (
                        <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{order.distributorPhone}</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{order.items.length}</span>
                      <span className="text-[0.75rem] ml-1" style={{ color: 'var(--muted-foreground)' }}>{'სახეობა'}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-[0.9375rem] font-bold" style={{ color: 'var(--foreground)' }}>
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.75rem] font-medium"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span
                          className="text-[0.625rem] font-medium px-1.5 py-0.5 rounded"
                          style={{
                            background: order.notifiedAdmin ? '#dcfce7' : '#fee2e2',
                            color: order.notifiedAdmin ? '#15803d' : '#dc2626',
                          }}
                          title={order.notifiedAdmin ? 'ადმინი შეტყობინებულია' : 'ადმინი არ არის შეტყობინებული'}
                        >
                          {'ადმინი'}
                        </span>
                        <span
                          className="text-[0.625rem] font-medium px-1.5 py-0.5 rounded"
                          style={{
                            background: order.notifiedCashier ? '#dcfce7' : '#fee2e2',
                            color: order.notifiedCashier ? '#15803d' : '#dc2626',
                          }}
                          title={order.notifiedCashier ? 'მოლარე შეტყობინებულია' : 'მოლარე არ არის შეტყობინებული'}
                        >
                          {'მოლარე'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewOrder(order)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color: 'var(--muted-foreground)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'confirmed')}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                              style={{ color: '#16a34a' }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#dcfce7' }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                              title="დადასტურება"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'cancelled')}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                              style={{ color: '#ef4444' }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2' }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                              title="გაუქმება"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'delivered')}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                            style={{ color: '#16a34a' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#dcfce7' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                            title="მიწოდებულად მონიშვნა"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Truck className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--muted-foreground)', opacity: 0.3 }} />
            <div className="text-[1rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'შეკვეთა ვერ მოიძებნა'}</div>
          </div>
        )}
      </div>

      {/* New Order Modal */}
      {showNewOrder && (
        <NewOrderModal
          onClose={() => setShowNewOrder(false)}
          onSave={(order) => {
            setOrders((prev) => [order, ...prev])
            setShowNewOrder(false)
            showNotification('ახალი შეკვეთა შეიქმნა — ადმინი და მოლარე შეტყობინებულია')
          }}
        />
      )}

      {/* View Order Modal */}
      {viewOrder && (
        <OrderDetailModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
          onStatusChange={(newStatus) => {
            handleStatusChange(viewOrder.id, newStatus)
            setViewOrder(null)
          }}
        />
      )}
    </div>
  )
}

function NewOrderModal({ onClose, onSave }: { onClose: () => void; onSave: (o: DistributorOrder) => void }) {
  const [distributorName, setDistributorName] = useState('')
  const [distributorPhone, setDistributorPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<DistributorOrderItem[]>([])
  const [addingProduct, setAddingProduct] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [quantity, setQuantity] = useState(1)

  const addItem = () => {
    const product = demoProducts.find((p) => p.id === selectedProductId)
    if (!product) return
    setItems((prev) => [
      ...prev,
      {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.costPrice,
        total: product.costPrice * quantity,
      },
    ])
    setSelectedProductId('')
    setQuantity(1)
    setAddingProduct(false)
  }

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const total = items.reduce((sum, i) => sum + i.total, 0)

  const handleSubmit = () => {
    if (!distributorName || items.length === 0) return
    const order: DistributorOrder = {
      id: `do-${Date.now()}`,
      orderNumber: `DO-2026-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      distributorName,
      distributorPhone: distributorPhone || undefined,
      status: 'pending',
      items,
      total,
      notes: notes || undefined,
      notifiedAdmin: true,
      notifiedCashier: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onSave(order)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ახალი შეკვეთა'}</h2>
            <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{'დისტრიბუტორისგან შეკვეთის მიღება'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 space-y-5">
          {/* Distributor Info */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>
                {'დისტრიბუტორი / მომწოდებელი'} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={distributorName}
                onChange={(e) => {
                  setDistributorName(e.target.value)
                  const s = suppliers.find((s) => s.name === e.target.value)
                  if (s?.phone) setDistributorPhone(s.phone)
                }}
                className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] cursor-pointer"
                style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              >
                <option value="">{'აირჩიეთ...'}</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ტელეფონი'}</label>
              <input
                value={distributorPhone}
                onChange={(e) => setDistributorPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none"
                style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[0.8125rem] font-semibold" style={{ color: 'var(--foreground)' }}>
                {'პროდუქტები'} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <button
                onClick={() => setAddingProduct(true)}
                className="flex items-center gap-1.5 text-[0.8125rem] font-medium"
                style={{ color: 'var(--primary)' }}
              >
                <Plus className="w-3.5 h-3.5" />
                {'დამატება'}
              </button>
            </div>

            {addingProduct && (
              <div className="flex items-end gap-3 mb-3 p-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
                <div className="flex-1 space-y-1">
                  <label className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'პროდუქტი'}</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-[0.875rem] cursor-pointer"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  >
                    <option value="">{'აირჩიეთ...'}</option>
                    {demoProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({formatCurrency(p.costPrice)})</option>
                    ))}
                  </select>
                </div>
                <div className="w-[80px] space-y-1">
                  <label className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'რაოდენობა'}</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg text-[0.875rem] outline-none"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <button
                  onClick={addItem}
                  disabled={!selectedProductId}
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 disabled:opacity-40"
                  style={{ background: '#16a34a', color: 'white' }}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAddingProduct(false)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {items.length > 0 ? (
              <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-4 py-2.5"
                    style={{ borderBottom: idx < items.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <Package className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[0.875rem] font-medium truncate" style={{ color: 'var(--foreground)' }}>{item.productName}</div>
                    </div>
                    <div className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>
                      {item.quantity} x {formatCurrency(item.unitPrice)}
                    </div>
                    <div className="text-[0.875rem] font-semibold w-[80px] text-right" style={{ color: 'var(--foreground)' }}>
                      {formatCurrency(item.total)}
                    </div>
                    <button
                      onClick={() => removeItem(idx)}
                      className="w-7 h-7 rounded flex items-center justify-center"
                      style={{ color: '#ef4444' }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3" style={{ background: 'var(--secondary)' }}>
                  <span className="text-[0.875rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'ჯამი:'}</span>
                  <span className="text-[1.0625rem] font-bold" style={{ color: 'var(--primary)' }}>{formatCurrency(total)}</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center rounded-lg" style={{ background: 'var(--secondary)' }}>
                <Package className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--muted-foreground)', opacity: 0.3 }} />
                <div className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{'დაამატეთ პროდუქტები'}</div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'შენიშვნა'}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="მაგ: მიწოდების ვადა, სპეციალური მოთხოვნები..."
              className="w-full px-3.5 py-2.5 rounded-lg text-[0.875rem] outline-none resize-none"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>

          {/* Notification Info */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-lg" style={{ background: '#dbeafe', border: '1px solid #bfdbfe' }}>
            <Bell className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#2563eb' }} />
            <div className="text-[0.8125rem]" style={{ color: '#1e40af' }}>
              {'შეკვეთის შექმნისთანავე ავტომატურად ეცნობება ადმინისტრატორს და მოლარეს push-შეტყობინებით.'}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end px-6 py-5">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}>
            {'გაუქმება'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!distributorName || items.length === 0}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-[0.875rem] font-medium disabled:opacity-50"
            style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}
          >
            <Send className="w-4 h-4" />
            {'შეკვეთის შექმნა'}
          </button>
        </div>
      </div>
    </div>
  )
}

function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: DistributorOrder
  onClose: () => void
  onStatusChange: (status: string) => void
}) {
  const sc = statusConfig[order.status]
  const StatusIcon = sc.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[1.125rem] font-bold font-mono" style={{ color: 'var(--foreground)' }}>{order.orderNumber}</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium" style={{ background: sc.bg, color: sc.color }}>
                <StatusIcon className="w-3 h-3" />
                {sc.label}
              </span>
            </div>
            <p className="text-[0.875rem] mt-1" style={{ color: 'var(--muted-foreground)' }}>{order.distributorName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 space-y-5">
          {/* Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="px-3 py-2.5 rounded-lg" style={{ background: 'var(--secondary)' }}>
              <div className="text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'შექმნის თარიღი'}</div>
              <div className="text-[0.875rem] font-semibold mt-0.5" style={{ color: 'var(--foreground)' }}>{formatDate(order.createdAt)}</div>
            </div>
            <div className="px-3 py-2.5 rounded-lg" style={{ background: 'var(--secondary)' }}>
              <div className="text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'განახლების თარიღი'}</div>
              <div className="text-[0.875rem] font-semibold mt-0.5" style={{ color: 'var(--foreground)' }}>{formatDate(order.updatedAt)}</div>
            </div>
          </div>

          {/* Notification status */}
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: order.notifiedAdmin ? '#dcfce7' : '#fee2e2' }}>
              <User className="w-4 h-4" style={{ color: order.notifiedAdmin ? '#16a34a' : '#dc2626' }} />
              <span className="text-[0.8125rem] font-medium" style={{ color: order.notifiedAdmin ? '#15803d' : '#dc2626' }}>
                {order.notifiedAdmin ? 'ადმინი შეტყობინებულია' : 'ადმინი არ არის შეტყობინებული'}
              </span>
            </div>
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: order.notifiedCashier ? '#dcfce7' : '#fee2e2' }}>
              <User className="w-4 h-4" style={{ color: order.notifiedCashier ? '#16a34a' : '#dc2626' }} />
              <span className="text-[0.8125rem] font-medium" style={{ color: order.notifiedCashier ? '#15803d' : '#dc2626' }}>
                {order.notifiedCashier ? 'მოლარე შეტყობინებულია' : 'მოლარე არ არის შეტყობინებული'}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="px-4 py-2.5" style={{ background: 'var(--secondary)' }}>
              <span className="text-[0.8125rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'პროდუქტები'}</span>
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-2.5" style={{ borderTop: '1px solid var(--border)' }}>
                <Package className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                <div className="flex-1 text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{item.productName}</div>
                <div className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{item.quantity} x {formatCurrency(item.unitPrice)}</div>
                <div className="text-[0.875rem] font-semibold w-[80px] text-right" style={{ color: 'var(--foreground)' }}>{formatCurrency(item.total)}</div>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3 border-t" style={{ background: 'var(--secondary)', borderColor: 'var(--border)' }}>
              <span className="text-[0.9375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ჯამი'}</span>
              <span className="text-[1.125rem] font-bold" style={{ color: 'var(--primary)' }}>{formatCurrency(order.total)}</span>
            </div>
          </div>

          {order.notes && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
              <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
              <div className="text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{order.notes}</div>
            </div>
          )}

          {/* Actions */}
          {order.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => onStatusChange('confirmed')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[0.875rem] font-medium"
                style={{ background: '#16a34a', color: 'white' }}
              >
                <Check className="w-4 h-4" />
                {'დადასტურება'}
              </button>
              <button
                onClick={() => onStatusChange('cancelled')}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[0.875rem] font-medium"
                style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
              >
                <X className="w-4 h-4" />
                {'გაუქმება'}
              </button>
            </div>
          )}
          {order.status === 'confirmed' && (
            <button
              onClick={() => onStatusChange('delivered')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[0.875rem] font-medium"
              style={{ background: '#16a34a', color: 'white' }}
            >
              <CheckCircle2 className="w-4 h-4" />
              {'მიწოდებულად მონიშვნა'}
            </button>
          )}
        </div>

        <div className="px-6 py-5">
          <button onClick={onClose} className="w-full px-4 py-2 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}>
            {'დახურვა'}
          </button>
        </div>
      </div>
    </div>
  )
}
