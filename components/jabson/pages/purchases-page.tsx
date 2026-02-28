'use client'

import { useState } from 'react'
import { Plus, Search, Eye, Edit2, Trash2, X, Truck, Package, Calendar, DollarSign, Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { demoPurchaseOrders, suppliers, products, formatCurrency, type PurchaseOrder, type PurchaseOrderItem } from '@/lib/demo-data'

const statusLabels: Record<string, { label: string; bg: string; color: string }> = {
  draft: { label: 'მუშვერი', bg: '#f3f4f6', color: '#6b7280' },
  ordered: { label: 'შეკვეთილი', bg: '#dbeafe', color: '#1d4ed8' },
  partial: { label: 'ნაწილობრივ', bg: '#fef3c7', color: '#92400e' },
  received: { label: 'მიღებული', bg: '#dcfce7', color: '#15803d' },
  cancelled: { label: 'გაუქმებული', bg: '#fee2e2', color: '#dc2626' },
}

export function PurchasesPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(demoPurchaseOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewOrder, setViewOrder] = useState<PurchaseOrder | null>(null)
  const [editOrder, setEditOrder] = useState<PurchaseOrder | null>(null)

  const filtered = purchaseOrders.filter((po) => {
    const matchesSearch = po.orderNumber.toLowerCase().includes(search.toLowerCase()) || po.supplierName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const thisMonthTotal = purchaseOrders.reduce((sum, po) => sum + po.total, 0)
  const unpaidTotal = purchaseOrders.filter(po => po.status === 'ordered' || po.status === 'partial').reduce((sum, po) => sum + po.total, 0)
  const receivedCount = purchaseOrders.filter(po => po.status === 'received').length
  const pendingCount = purchaseOrders.filter(po => po.status === 'ordered' || po.status === 'partial').length

  const handleDelete = (id: string) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== id))
  }

  const handleMarkReceived = (id: string) => {
    setPurchaseOrders(prev => prev.map(po => 
      po.id === id ? { ...po, status: 'received' as const, receivedDate: new Date().toISOString().split('T')[0] } : po
    ))
    setViewOrder(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'შეძენები'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {filtered.length} {'შეკვეთა'}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium transition-all"
          style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}
        >
          <Plus className="w-4 h-4" />
          {'ახალი შეძენა'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#16a34a15', color: '#16a34a' }}>
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'სულ შეძენები ამ თვე'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{formatCurrency(thisMonthTotal)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'გადაუხდელი'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#d97706' }}>{formatCurrency(unpaidTotal)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#22c55e15', color: '#22c55e' }}>
            <Check className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ჩამოსული'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{receivedCount} {'ორდერი'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მომლოდინე'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{pendingCount} {'ორდერი'}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="მომწოდებლის სახელი / ნომერი"
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
          <option value="draft">{'მუშვერი'}</option>
          <option value="ordered">{'შეკვეთილი'}</option>
          <option value="partial">{'ნაწილობრივ'}</option>
          <option value="received">{'მიღებული'}</option>
          <option value="cancelled">{'გაუქმებული'}</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--secondary)' }}>
                <th className="px-5 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ნომერი'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'მომწოდებელი'}</th>
                <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'სტატუსი'}</th>
                <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'პროდუქტები'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ჯამი'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'მოსალოდნელი'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'თარიღი'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{''}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((po) => {
                const status = statusLabels[po.status]
                return (
                  <tr key={po.id} className="transition-colors group" style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <td className="px-5 py-3.5 text-[0.875rem] font-mono font-medium" style={{ color: 'var(--foreground)' }}>{po.orderNumber}</td>
                    <td className="px-4 py-3.5 text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{po.supplierName}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium" style={{ background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center text-[0.875rem] font-semibold" style={{ color: 'var(--foreground)' }}>{po.itemCount}</td>
                    <td className="px-4 py-3.5 text-right text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{formatCurrency(po.total)}</td>
                    <td className="px-4 py-3.5 text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{po.expectedDate || '---'}</td>
                    <td className="px-4 py-3.5 text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{po.createdAt}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewOrder(po)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color: 'var(--muted-foreground)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                          title="ნახვა"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditOrder(po)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color: 'var(--muted-foreground)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                          title="რედაქტირება"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(po.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color: '#ef4444' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                          title="წაშლა"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

      {/* Add/Edit Modal */}
      {(showAddModal || editOrder) && (
        <PurchaseModal
          order={editOrder}
          onClose={() => { setShowAddModal(false); setEditOrder(null) }}
          onSave={(order) => {
            if (editOrder) {
              setPurchaseOrders(prev => prev.map(po => po.id === order.id ? order : po))
            } else {
              setPurchaseOrders(prev => [...prev, order])
            }
            setShowAddModal(false)
            setEditOrder(null)
          }}
        />
      )}

      {/* View Order Modal */}
      {viewOrder && (
        <ViewOrderModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
          onMarkReceived={handleMarkReceived}
        />
      )}
    </div>
  )
}

function PurchaseModal({ order, onClose, onSave }: { order: PurchaseOrder | null; onClose: () => void; onSave: (o: PurchaseOrder) => void }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    supplierId: order?.supplierId || '',
    supplierName: order?.supplierName || '',
    invoiceNumber: '',
    expectedDate: order?.expectedDate || '',
    notes: '',
  })
  const [items, setItems] = useState<PurchaseOrderItem[]>(order?.items || [])
  const [productSearch, setProductSearch] = useState('')
  const [showProductDropdown, setShowProductDropdown] = useState(false)

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 5)

  const addProduct = (product: typeof products[0]) => {
    if (!items.find(i => i.productId === product.id)) {
      setItems([...items, {
        id: `poi-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        quantity: 1,
        receivedQty: 0,
        unitCost: product.costPrice,
        total: product.costPrice,
      }])
    }
    setProductSearch('')
    setShowProductDropdown(false)
  }

  const updateItem = (id: string, field: 'quantity' | 'unitCost', value: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value }
        newItem.total = newItem.quantity * newItem.unitCost
        return newItem
      }
      return item
    }))
  }

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  const subtotal = items.reduce((sum, i) => sum + i.total, 0)
  const vat = subtotal * 0.18
  const total = subtotal + vat

  const handleSave = (asDraft: boolean) => {
    const newOrder: PurchaseOrder = {
      id: order?.id || `po-${Date.now()}`,
      orderNumber: order?.orderNumber || `PO-00${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: form.supplierId,
      supplierName: form.supplierName,
      status: asDraft ? 'draft' : 'ordered',
      total: total,
      itemCount: items.length,
      expectedDate: form.expectedDate || null,
      receivedDate: null,
      createdAt: order?.createdAt || new Date().toISOString().split('T')[0],
      items: items,
    }
    onSave(newOrder)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{order ? 'შეკვეთის რედაქტირება' : 'ახალი შეძენა'}</h2>
            <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              {'ნაბიჯი'} {step} / 3
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 px-6 pb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 h-1.5 rounded-full" style={{ background: s <= step ? '#16a34a' : 'var(--border)' }} />
          ))}
        </div>

        <div className="px-6 pb-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მომწოდებელი'} <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={form.supplierId}
                  onChange={(e) => {
                    const supplier = suppliers.find(s => s.id === e.target.value)
                    setForm({ ...form, supplierId: e.target.value, supplierName: supplier?.name || '' })
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
                  style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                >
                  <option value="">{'აირჩიეთ მომწოდებელი'}</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ინვოისის ნომერი'}</label>
                <input
                  value={form.invoiceNumber}
                  onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
                  style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                  placeholder="არასავალდებულო"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მოსალოდნელი მიწოდების თარიღი'}</label>
                <input
                  type="date"
                  value={form.expectedDate}
                  onChange={(e) => setForm({ ...form, expectedDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
                  style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'შენიშვნები'}</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] resize-none"
                  style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  value={productSearch}
                  onChange={(e) => { setProductSearch(e.target.value); setShowProductDropdown(true) }}
                  onFocus={() => setShowProductDropdown(true)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
                  style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                  placeholder="მოძებნეთ პროდუქტი..."
                />
                {showProductDropdown && productSearch && filteredProducts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-10" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgb(0 0 0/0.1)' }}>
                    {filteredProducts.map(p => (
                      <button
                        key={p.id}
                        onClick={() => addProduct(p)}
                        className="w-full px-3.5 py-2.5 text-left text-[0.875rem] hover:bg-[var(--secondary)] transition-colors"
                        style={{ color: 'var(--foreground)' }}
                      >
                        <div className="font-medium">{p.name}</div>
                        <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{p.sku} - {formatCurrency(p.costPrice)}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: 'var(--secondary)' }}>
                        <th className="px-3 py-2 text-left text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'პროდუქტი'}</th>
                        <th className="px-3 py-2 text-center text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'რაოდ.'}</th>
                        <th className="px-3 py-2 text-center text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'თვითღირ.'}</th>
                        <th className="px-3 py-2 text-right text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'ჯამი'}</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td className="px-3 py-2 text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{item.productName}</td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                              className="w-16 px-2 py-1 rounded text-center text-[0.875rem]"
                              style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                              min="1"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.unitCost}
                              onChange={(e) => updateItem(item.id, 'unitCost', Number(e.target.value))}
                              className="w-20 px-2 py-1 rounded text-center text-[0.875rem]"
                              style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                              step="0.01"
                            />
                          </td>
                          <td className="px-3 py-2 text-right text-[0.875rem] font-semibold" style={{ color: 'var(--foreground)' }}>{formatCurrency(item.total)}</td>
                          <td className="px-3 py-2">
                            <button onClick={() => removeItem(item.id)} style={{ color: '#ef4444' }}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                onClick={() => setShowProductDropdown(true)}
                className="w-full py-2.5 rounded-lg text-[0.875rem] font-medium border-2 border-dashed"
                style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}
              >
                + {'პროდუქტის დამატება'}
              </button>

              <div className="text-right pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>
                  {'ჯამი:'} {formatCurrency(subtotal)}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl p-4" style={{ background: 'var(--secondary)' }}>
                <div className="text-[0.8125rem] font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>{'მომწოდებელი'}</div>
                <div className="text-[1rem] font-semibold" style={{ color: 'var(--foreground)' }}>{form.supplierName}</div>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'var(--secondary)' }}>
                <div className="text-[0.8125rem] font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>{'პროდუქტები'}</div>
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-[0.875rem] py-1">
                    <span style={{ color: 'var(--foreground)' }}>{item.productName} x {item.quantity}</span>
                    <span style={{ color: 'var(--foreground)' }}>{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex justify-between text-[0.875rem]">
                  <span style={{ color: 'var(--muted-foreground)' }}>{'ქვეჯამი'}</span>
                  <span style={{ color: 'var(--foreground)' }}>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[0.875rem]">
                  <span style={{ color: 'var(--muted-foreground)' }}>{'დღგ (18%)'}</span>
                  <span style={{ color: 'var(--foreground)' }}>{formatCurrency(vat)}</span>
                </div>
                <div className="flex justify-between text-[1.125rem] font-bold pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--foreground)' }}>{'სულ'}</span>
                  <span style={{ color: '#16a34a' }}>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-[0.875rem] font-medium"
              style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}
            >
              <ChevronLeft className="w-4 h-4" />
              {'უკან'}
            </button>
          ) : (
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
              {'გაუქმება'}
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !form.supplierId}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-[0.875rem] font-medium disabled:opacity-50"
              style={{ background: '#16a34a', color: 'white' }}
            >
              {'შემდეგი'}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave(true)}
                className="px-4 py-2 rounded-lg text-[0.875rem] font-medium"
                style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}
              >
                {'შენახვა draft'}
              </button>
              <button
                onClick={() => handleSave(false)}
                className="px-4 py-2 rounded-lg text-[0.875rem] font-medium"
                style={{ background: '#16a34a', color: 'white' }}
              >
                {'შეკვეთის გაგზავნა'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ViewOrderModal({ order, onClose, onMarkReceived }: { order: PurchaseOrder; onClose: () => void; onMarkReceived: (id: string) => void }) {
  const status = statusLabels[order.status]
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-[560px] max-h-[85vh] overflow-y-auto rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{order.orderNumber}</h2>
            <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{order.supplierName}</p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
        </div>
        
        <div className="px-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex px-3 py-1 rounded-full text-[0.8125rem] font-medium" style={{ background: status.bg, color: status.color }}>
              {status.label}
            </span>
            <span className="text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>
              {'შექმნილია:'} {order.createdAt}
            </span>
          </div>

          {order.expectedDate && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--secondary)' }}>
              <Calendar className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <span className="text-[0.875rem]" style={{ color: 'var(--foreground)' }}>
                {'მოსალოდნელი:'} {order.expectedDate}
              </span>
            </div>
          )}

          {order.items && order.items.length > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--secondary)' }}>
                    <th className="px-4 py-2 text-left text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'პროდუქტი'}</th>
                    <th className="px-4 py-2 text-center text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'რაოდ.'}</th>
                    <th className="px-4 py-2 text-center text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'მიღებული'}</th>
                    <th className="px-4 py-2 text-right text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'თვითღირ.'}</th>
                    <th className="px-4 py-2 text-right text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'ჯამი'}</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="px-4 py-2.5 text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{item.productName}</td>
                      <td className="px-4 py-2.5 text-center text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{item.quantity}</td>
                      <td className="px-4 py-2.5 text-center text-[0.875rem]" style={{ color: item.receivedQty >= item.quantity ? '#16a34a' : '#d97706' }}>{item.receivedQty}</td>
                      <td className="px-4 py-2.5 text-right text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{formatCurrency(item.unitCost)}</td>
                      <td className="px-4 py-2.5 text-right text-[0.875rem] font-semibold" style={{ color: 'var(--foreground)' }}>{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between items-baseline pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <span className="text-[1rem] font-bold" style={{ color: 'var(--foreground)' }}>{'სულ'}</span>
            <span className="text-[1.5rem] font-extrabold" style={{ color: '#16a34a' }}>{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="px-6 py-5 flex gap-2">
          {(order.status === 'ordered' || order.status === 'partial') && (
            <button
              onClick={() => onMarkReceived(order.id)}
              className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium"
              style={{ background: '#16a34a', color: 'white' }}
            >
              {'მარკირება მიღებულად'}
            </button>
          )}
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}>
            {'დახურვა'}
          </button>
        </div>
      </div>
    </div>
  )
}
