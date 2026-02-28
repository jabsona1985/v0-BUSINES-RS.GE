'use client'

import { useState } from 'react'
import { Plus, Search, Eye, Trash2, Upload, Download, X, FileText, Loader2 } from 'lucide-react'
import { demoInvoices, formatCurrency, type Invoice, type InvoiceItem } from '@/lib/demo-data'

const statusLabels: Record<string, { label: string; bg: string; color: string }> = {
  draft: { label: 'მუშვერი', bg: '#f3f4f6', color: '#6b7280' },
  sent: { label: 'გაგზავნილი', bg: '#dbeafe', color: '#1d4ed8' },
  confirmed: { label: 'დადასტურებული', bg: '#dcfce7', color: '#15803d' },
  rejected: { label: 'უარყოფილი', bg: '#fee2e2', color: '#dc2626' },
}

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(demoInvoices)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null)

  const filtered = invoices.filter((inv) => {
    const matchesSearch = (inv.rsNumber || '').toLowerCase().includes(search.toLowerCase()) || inv.buyerName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id))
  }

  if (showForm) {
    return <InvoiceForm onClose={() => setShowForm(false)} onSave={(inv) => { setInvoices([inv, ...invoices]); setShowForm(false) }} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ფაქტურები'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {filtered.length} {'ფაქტურა'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium transition-all"
          style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}
        >
          <Plus className="w-4 h-4" />
          {'ახალი ფაქტურა'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ნომერი, მყიდველი..."
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
          <option value="sent">{'გაგზავნილი'}</option>
          <option value="confirmed">{'დადასტურებული'}</option>
          <option value="rejected">{'უარყოფილი'}</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--secondary)' }}>
                <th className="px-5 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ნომერი'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'მყიდველი'}</th>
                <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'სტატუსი'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ჯამი'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'დღგ'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'თარიღი'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{''}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => {
                const status = statusLabels[inv.status]
                return (
                  <tr key={inv.id} className="transition-colors group" style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <td className="px-5 py-3.5 text-[0.875rem] font-mono font-medium" style={{ color: 'var(--foreground)' }}>{inv.rsNumber || '---'}</td>
                    <td className="px-4 py-3.5">
                      <div className="text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{inv.buyerName}</div>
                      {inv.buyerTin && <div className="text-[0.75rem] font-mono" style={{ color: 'var(--muted-foreground)' }}>{inv.buyerTin}</div>}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium" style={{ background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{formatCurrency(inv.total)}</td>
                    <td className="px-4 py-3.5 text-right text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{formatCurrency(inv.vatAmount)}</td>
                    <td className="px-4 py-3.5 text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{inv.createdAt}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewInvoice(inv)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color: 'var(--muted-foreground)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                          title="ნახვა"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color: '#3b82f6' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#dbeafe' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                          title="PDF ჩამოტვირთვა"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {inv.status === 'draft' && (
                          <button
                            onClick={() => handleDelete(inv.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                            style={{ color: '#ef4444' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                            title="წაშლა"
                          >
                            <Trash2 className="w-4 h-4" />
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
            <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--muted-foreground)', opacity: 0.3 }} />
            <div className="text-[1rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ფაქტურა ვერ მოიძებნა'}</div>
          </div>
        )}
      </div>

      {/* View Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-[500px] max-h-[85vh] overflow-y-auto rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{viewInvoice.rsNumber || 'ფაქტურა'}</h2>
                <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{viewInvoice.buyerName}</p>
              </div>
              <button onClick={() => setViewInvoice(null)} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 space-y-4 pb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex px-3 py-1 rounded-full text-[0.8125rem] font-medium" style={{ background: statusLabels[viewInvoice.status].bg, color: statusLabels[viewInvoice.status].color }}>
                  {statusLabels[viewInvoice.status].label}
                </span>
                <span className="text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{viewInvoice.createdAt}</span>
              </div>
              <div className="space-y-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex justify-between text-[0.875rem]">
                  <span style={{ color: 'var(--muted-foreground)' }}>{'ქვეჯამი'}</span>
                  <span style={{ color: 'var(--foreground)' }}>{formatCurrency(viewInvoice.total - viewInvoice.vatAmount)}</span>
                </div>
                <div className="flex justify-between text-[0.875rem]">
                  <span style={{ color: 'var(--muted-foreground)' }}>{'დღგ (18%)'}</span>
                  <span style={{ color: 'var(--foreground)' }}>{formatCurrency(viewInvoice.vatAmount)}</span>
                </div>
                <div className="flex justify-between text-[1.125rem] font-bold pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--foreground)' }}>{'სულ'}</span>
                  <span style={{ color: '#16a34a' }}>{formatCurrency(viewInvoice.total)}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: '#3b82f6', color: 'white' }}>
                  <Download className="w-4 h-4" />
                  {'PDF ჩამოტვირთვა'}
                </button>
                <button onClick={() => setViewInvoice(null)} className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
                  {'დახურვა'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InvoiceForm({ onClose, onSave }: { onClose: () => void; onSave: (inv: Invoice) => void }) {
  const [buyerTin, setBuyerTin] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [comment, setComment] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([{ id: '1', name: '', quantity: 1, price: 0, vatRate: 18, total: 0 }])
  const [isSearching, setIsSearching] = useState(false)

  const handleTinSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      if (buyerTin === '404123456') {
        setBuyerName('შპს "Delta Ltd"')
      } else {
        setBuyerName(`კომპანია ${buyerTin.slice(0, 4)}`)
      }
      setIsSearching(false)
    }, 1000)
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'price' || field === 'vatRate') {
          const baseTotal = Number(newItem.quantity) * Number(newItem.price)
          const vatAmount = baseTotal * (Number(newItem.vatRate) / 100)
          newItem.total = baseTotal + vatAmount
        }
        return newItem
      }
      return item
    }))
  }

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', quantity: 1, price: 0, vatRate: 18, total: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id))
    }
  }

  const subtotal = items.reduce((sum, i) => sum + (i.quantity * i.price), 0)
  const vatAmount = items.reduce((sum, i) => sum + (i.quantity * i.price * i.vatRate / 100), 0)
  const total = subtotal + vatAmount

  const handleSave = (upload: boolean) => {
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      rsNumber: upload ? `INV-${Math.floor(100000 + Math.random() * 900000)}` : null,
      status: upload ? 'sent' : 'draft',
      buyerName,
      buyerTin: buyerTin || null,
      total,
      vatAmount,
      comment,
      createdAt: new Date().toISOString().split('T')[0],
      items,
    }
    onSave(newInvoice)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ახალი ფაქტურა'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{'შეავსეთ ფაქტურის დეტალები'}</p>
        </div>
        <button onClick={onClose} className="px-4 py-2 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
          {'გაუქმება'}
        </button>
      </div>

      <div className="rounded-xl p-6 space-y-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        {/* Buyer Section */}
        <div className="space-y-4">
          <h3 className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'მყიდველი'}</h3>
          <div className="flex gap-2">
            <input
              value={buyerTin}
              onChange={(e) => setBuyerTin(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              placeholder="საიდენტ. კოდი"
            />
            <button
              onClick={handleTinSearch}
              disabled={!buyerTin || isSearching}
              className="px-4 py-2.5 rounded-lg text-[0.875rem] font-medium disabled:opacity-50"
              style={{ background: '#16a34a', color: 'white' }}
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
          </div>
          <input
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
            style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
            placeholder="სახელი"
          />
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
            style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
            placeholder="კომენტარი (არასავალდებულო)"
          />
        </div>

        {/* Items Section */}
        <div className="space-y-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <h3 className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'ნივთები'}</h3>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--secondary)' }}>
                  <th className="px-3 py-2 text-left text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'სახელი'}</th>
                  <th className="px-3 py-2 text-center text-[0.75rem] font-semibold w-16" style={{ color: 'var(--muted-foreground)' }}>{'რაოდ.'}</th>
                  <th className="px-3 py-2 text-center text-[0.75rem] font-semibold w-24" style={{ color: 'var(--muted-foreground)' }}>{'ფასი'}</th>
                  <th className="px-3 py-2 text-center text-[0.75rem] font-semibold w-20" style={{ color: 'var(--muted-foreground)' }}>{'დღგ%'}</th>
                  <th className="px-3 py-2 text-right text-[0.75rem] font-semibold w-28" style={{ color: 'var(--muted-foreground)' }}>{'ჯამი + დღგ'}</th>
                  <th className="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-3 py-2">
                      <input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="w-full px-2 py-1.5 rounded text-[0.875rem]"
                        style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded text-center text-[0.875rem]"
                        style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                        min="1"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded text-center text-[0.875rem]"
                        style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                        step="0.01"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={item.vatRate}
                        onChange={(e) => updateItem(item.id, 'vatRate', Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded text-[0.875rem]"
                        style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      >
                        <option value={0}>0%</option>
                        <option value={18}>18%</option>
                      </select>
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
          <button
            onClick={addItem}
            className="w-full py-2.5 rounded-lg text-[0.875rem] font-medium border-2 border-dashed"
            style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}
          >
            + {'ნივთის დამატება'}
          </button>
        </div>

        {/* Totals */}
        <div className="space-y-2 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex justify-between text-[0.875rem]">
            <span style={{ color: 'var(--muted-foreground)' }}>{'ქვეჯამი'}</span>
            <span style={{ color: 'var(--foreground)' }}>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[0.875rem]">
            <span style={{ color: 'var(--muted-foreground)' }}>{'დღგ (18%)'}</span>
            <span style={{ color: 'var(--foreground)' }}>{formatCurrency(vatAmount)}</span>
          </div>
          <div className="flex justify-between text-[1.125rem] font-bold pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--foreground)' }}>{'სულ'}</span>
            <span style={{ color: '#16a34a' }}>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium"
            style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}
          >
            {'გაუქმება'}
          </button>
          <button
            onClick={() => handleSave(false)}
            className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium"
            style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}
          >
            {'შენახვა'}
          </button>
          <button
            onClick={() => handleSave(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[0.875rem] font-medium"
            style={{ background: '#16a34a', color: 'white' }}
          >
            <Upload className="w-4 h-4" />
            {'rs.ge-ზე ატვირთვა'}
          </button>
        </div>
      </div>
    </div>
  )
}
