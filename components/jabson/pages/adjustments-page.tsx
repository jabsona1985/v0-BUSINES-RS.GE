'use client'

import { useState } from 'react'
import { Plus, Search, Package, ArrowDown, ArrowUp, ClipboardList, X } from 'lucide-react'
import { inventoryAdjustments as demoAdjustments, products, reasonLabels, formatDate, formatCurrency, type InventoryAdjustment } from '@/lib/demo-data'

export function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState(demoAdjustments)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = adjustments.filter((a) =>
    a.productName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ინვენტარიზაცია'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {'მარაგის მანუალური კორექტირება და ინვენტარიზაცია'}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium"
          style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}
        >
          <Plus className="w-4 h-4" />
          {'ახალი კორექტირება'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'სულ კორექტირება'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{adjustments.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#16a34a15', color: '#16a34a' }}>
            <ArrowUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მატება'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#16a34a' }}>{adjustments.filter((a) => a.qtyChange > 0).length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#ef444415', color: '#ef4444' }}>
            <ArrowDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'კლება'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#dc2626' }}>{adjustments.filter((a) => a.qtyChange < 0).length}</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-[360px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ძიება პროდუქტით..."
          className="w-full pl-9 pr-3 py-2 rounded-lg text-[0.875rem] outline-none"
          style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--secondary)' }}>
                <th className="px-5 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'პროდუქტი'}</th>
                <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ადრე'}</th>
                <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'შემდეგ'}</th>
                <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ცვლილება'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'მიზეზი'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'მომხმარებელი'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'თარიღი'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((adj) => (
                <tr key={adj.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                      <span className="text-[0.875rem] font-medium" style={{ color: 'var(--foreground)' }}>{adj.productName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center text-[0.875rem] font-mono" style={{ color: 'var(--muted-foreground)' }}>{adj.qtyBefore}</td>
                  <td className="px-4 py-3.5 text-center text-[0.875rem] font-mono" style={{ color: 'var(--foreground)' }}>{adj.qtyAfter}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 text-[0.875rem] font-semibold" style={{ color: adj.qtyChange > 0 ? '#16a34a' : '#dc2626' }}>
                      {adj.qtyChange > 0 ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                      {adj.qtyChange > 0 ? '+' : ''}{adj.qtyChange}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium" style={{
                      background: adj.reason === 'correction' ? '#dbeafe' : adj.reason === 'damage' ? '#fee2e2' : adj.reason === 'expiry' ? '#fef3c7' : '#f3f4f6',
                      color: adj.reason === 'correction' ? '#1d4ed8' : adj.reason === 'damage' ? '#b91c1c' : adj.reason === 'expiry' ? '#92400e' : '#374151',
                    }}>
                      {reasonLabels[adj.reason] || adj.reason}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{adj.createdBy}</td>
                  <td className="px-4 py-3.5 text-[0.8125rem] font-mono" style={{ color: 'var(--muted-foreground)' }}>{formatDate(adj.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Adjustment Modal */}
      {showModal && (
        <AdjustmentModal
          onClose={() => setShowModal(false)}
          onSave={(adj) => {
            setAdjustments((prev) => [adj, ...prev])
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}

function AdjustmentModal({ onClose, onSave }: { onClose: () => void; onSave: (adj: InventoryAdjustment) => void }) {
  const [selectedProduct, setSelectedProduct] = useState('')
  const [newQty, setNewQty] = useState('')
  const [reason, setReason] = useState('correction')
  const [notes, setNotes] = useState('')

  const product = products.find((p) => p.id === selectedProduct)
  const qtyChange = product && newQty ? parseFloat(newQty) - product.stock : 0

  const handleSubmit = () => {
    if (!product || !newQty) return
    const adj: InventoryAdjustment = {
      id: `adj-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      qtyBefore: product.stock,
      qtyAfter: parseFloat(newQty),
      qtyChange,
      reason,
      notes: notes || undefined,
      createdBy: 'ნინო ბერიძე',
      createdAt: new Date().toISOString(),
    }
    onSave(adj)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-[480px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ახალი კორექტირება'}</h2>
            <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{'მარაგის მანუალური კორექტირება'}</p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'პროდუქტი'} <span style={{ color: '#ef4444' }}>*</span></label>
            <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] cursor-pointer" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}>
              <option value="">{'აირჩიეთ პროდუქტი...'}</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.stock} {p.unit})</option>)}
            </select>
          </div>

          {product && (
            <div className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{ background: 'var(--secondary)' }}>
              <div className="text-center">
                <div className="text-[0.6875rem] uppercase font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'მიმდინარე'}</div>
                <div className="text-[1.5rem] font-bold" style={{ color: 'var(--foreground)' }}>{product.stock}</div>
              </div>
              <div className="text-2xl" style={{ color: 'var(--muted-foreground)' }}>{'→'}</div>
              <div className="text-center flex-1">
                <div className="text-[0.6875rem] uppercase font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'ახალი'}</div>
                <input
                  type="number"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  className="w-full text-center text-[1.5rem] font-bold bg-transparent outline-none"
                  style={{ color: 'var(--foreground)' }}
                  placeholder="0"
                />
              </div>
              {newQty && (
                <>
                  <div className="text-2xl" style={{ color: 'var(--muted-foreground)' }}>{'='}</div>
                  <div className="text-center">
                    <div className="text-[0.6875rem] uppercase font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'ცვლილება'}</div>
                    <div className="text-[1.5rem] font-bold" style={{ color: qtyChange > 0 ? '#16a34a' : qtyChange < 0 ? '#dc2626' : 'var(--foreground)' }}>
                      {qtyChange > 0 ? '+' : ''}{qtyChange}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მიზეზი'}</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] cursor-pointer" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}>
              {Object.entries(reasonLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'შენიშვნა'}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none resize-y" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} />
          </div>
        </div>
        <div className="flex gap-3 justify-end px-6 py-5">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}>{'გაუქმება'}</button>
          <button onClick={handleSubmit} disabled={!product || !newQty} className="px-5 py-2 rounded-lg text-[0.875rem] font-medium disabled:opacity-50" style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d' }}>{'შენახვა'}</button>
        </div>
      </div>
    </div>
  )
}
