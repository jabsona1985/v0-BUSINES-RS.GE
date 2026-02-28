'use client'

import { useState } from 'react'
import { Plus, Search, Eye, Trash2, Upload, X, Truck, FileText, Check, CheckCircle, Loader2 } from 'lucide-react'
import { demoWaybills, formatCurrency, type Waybill, type WaybillItem } from '@/lib/demo-data'

const typeLabels: Record<number, { label: string; bg: string; color: string }> = {
  1: { label: 'შიდა', bg: '#dbeafe', color: '#1d4ed8' },
  2: { label: 'ექსპორტი', bg: '#dcfce7', color: '#15803d' },
  3: { label: 'იმპორტი', bg: '#fef3c7', color: '#92400e' },
  4: { label: 'დაბრუნება', bg: '#f3f4f6', color: '#6b7280' },
}

const statusLabels: Record<string, { label: string; bg: string; color: string }> = {
  draft: { label: 'მუშვერი', bg: '#f3f4f6', color: '#6b7280' },
  sent: { label: 'გაგზავნილი', bg: '#dbeafe', color: '#1d4ed8' },
  confirmed: { label: 'დადასტურებული', bg: '#dcfce7', color: '#15803d' },
  rejected: { label: 'უარყოფილი', bg: '#fee2e2', color: '#dc2626' },
  closed: { label: 'დახურული', bg: '#f3f4f6', color: '#6b7280' },
}

const unitOptions = ['ც', 'კგ', 'ტ', 'ლ', 'მლ', 'მ', 'მ²', 'მ³']

export function WaybillsPage() {
  const [waybills, setWaybills] = useState<Waybill[]>(demoWaybills)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [viewWaybill, setViewWaybill] = useState<Waybill | null>(null)
  const [isUploading, setIsUploading] = useState<string | null>(null)

  const filtered = waybills.filter((wb) => {
    const matchesSearch = (wb.rsNumber || '').toLowerCase().includes(search.toLowerCase()) || wb.buyerName.toLowerCase().includes(search.toLowerCase()) || wb.buyerTin.includes(search)
    const matchesStatus = statusFilter === 'all' || wb.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const thisMonthCount = waybills.length
  const sentCount = waybills.filter(wb => wb.status === 'sent').length
  const confirmedCount = waybills.filter(wb => wb.status === 'confirmed').length
  const draftCount = waybills.filter(wb => wb.status === 'draft').length

  const handleDelete = (id: string) => {
    setWaybills(prev => prev.filter(wb => wb.id !== id))
  }

  const handleUpload = (id: string) => {
    setIsUploading(id)
    setTimeout(() => {
      setWaybills(prev => prev.map(wb => 
        wb.id === id ? { ...wb, status: 'sent' as const, rsNumber: `WB-${Math.floor(100000 + Math.random() * 900000)}`, sentAt: new Date().toISOString().split('T')[0] } : wb
      ))
      setIsUploading(null)
    }, 1500)
  }

  if (showForm) {
    return <WaybillForm onClose={() => setShowForm(false)} onSave={(wb) => { setWaybills([wb, ...waybills]); setShowForm(false) }} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ზედნადებები'}</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.75rem] font-medium" style={{ background: '#dcfce7', color: '#15803d' }}>
              <CheckCircle className="w-3.5 h-3.5" />
              {'RS.GE დაკავშირებულია'}
            </span>
          </div>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {filtered.length} {'ზედნადები'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium transition-all"
          style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}
        >
          <Plus className="w-4 h-4" />
          {'ახალი ზედნადები'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'სულ ამ თვე'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{thisMonthCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'გაგზავნილი'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{sentCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#16a34a15', color: '#16a34a' }}>
            <Check className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'დადასტურებული'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{confirmedCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#6b728015', color: '#6b7280' }}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მუშვერი'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{draftCount}</div>
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
            placeholder="ნომერი, მყიდველი, საიდ. კოდი..."
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
                <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ტიპი'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'მყიდველი'}</th>
                <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'სტატუსი'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ჯამი'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'თარიღი'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{''}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((wb) => {
                const type = typeLabels[wb.type]
                const status = statusLabels[wb.status]
                return (
                  <tr key={wb.id} className="transition-colors group" style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <td className="px-5 py-3.5 text-[0.875rem] font-mono font-medium" style={{ color: 'var(--foreground)' }}>{wb.rsNumber || '---'}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium" style={{ background: type.bg, color: type.color }}>
                        {type.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{wb.buyerName}</div>
                      <div className="text-[0.75rem] font-mono" style={{ color: 'var(--muted-foreground)' }}>{wb.buyerTin}</div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium" style={{ background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{formatCurrency(wb.total)}</td>
                    <td className="px-4 py-3.5 text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{wb.sentAt || wb.createdAt}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewWaybill(wb)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color: 'var(--muted-foreground)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                          title="ნახვა"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {wb.status === 'draft' && (
                          <>
                            <button
                              onClick={() => handleUpload(wb.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                              style={{ color: '#16a34a' }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#dcfce7' }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                              title="rs.ge-ზე გაგზავნა"
                              disabled={isUploading === wb.id}
                            >
                              {isUploading === wb.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDelete(wb.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                              style={{ color: '#ef4444' }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2' }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                              title="წაშლა"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
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
            <div className="text-[1rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ზედნადები ვერ მოიძებნა'}</div>
          </div>
        )}
      </div>

      {/* View Waybill Modal */}
      {viewWaybill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-[500px] max-h-[85vh] overflow-y-auto rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{viewWaybill.rsNumber || 'ზედნადები'}</h2>
                <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{viewWaybill.buyerName}</p>
              </div>
              <button onClick={() => setViewWaybill(null)} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 space-y-4 pb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex px-3 py-1 rounded-full text-[0.8125rem] font-medium" style={{ background: typeLabels[viewWaybill.type].bg, color: typeLabels[viewWaybill.type].color }}>
                  {typeLabels[viewWaybill.type].label}
                </span>
                <span className="inline-flex px-3 py-1 rounded-full text-[0.8125rem] font-medium" style={{ background: statusLabels[viewWaybill.status].bg, color: statusLabels[viewWaybill.status].color }}>
                  {statusLabels[viewWaybill.status].label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
                  <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{'საიდ. კოდი'}</div>
                  <div className="text-[0.875rem] font-mono font-medium" style={{ color: 'var(--foreground)' }}>{viewWaybill.buyerTin}</div>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
                  <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{'ჯამი'}</div>
                  <div className="text-[0.875rem] font-semibold" style={{ color: '#16a34a' }}>{formatCurrency(viewWaybill.total)}</div>
                </div>
              </div>
              {viewWaybill.startAddress && (
                <div className="p-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
                  <div className="text-[0.75rem] mb-1" style={{ color: 'var(--muted-foreground)' }}>{'მარშრუტი'}</div>
                  <div className="text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{viewWaybill.startAddress} → {viewWaybill.endAddress}</div>
                </div>
              )}
              <button onClick={() => setViewWaybill(null)} className="w-full py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}>
                {'დახურვა'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function WaybillForm({ onClose, onSave }: { onClose: () => void; onSave: (wb: Waybill) => void }) {
  const [type, setType] = useState<1 | 2 | 3 | 4>(1)
  const [buyerTin, setBuyerTin] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [isVatPayer, setIsVatPayer] = useState(false)
  const [startAddress, setStartAddress] = useState('')
  const [endAddress, setEndAddress] = useState('')
  const [carNumber, setCarNumber] = useState('')
  const [driverTin, setDriverTin] = useState('')
  const [items, setItems] = useState<WaybillItem[]>([{ id: '1', name: '', quantity: 1, unit: 'ც', price: 0, total: 0 }])
  const [isSearching, setIsSearching] = useState(false)

  const handleTinSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      if (buyerTin === '404123456') {
        setBuyerName('შპს "Delta Ltd"')
        setIsVatPayer(true)
      } else {
        setBuyerName(`კომპანია ${buyerTin.slice(0, 4)}`)
        setIsVatPayer(false)
      }
      setIsSearching(false)
    }, 1000)
  }

  const updateItem = (id: string, field: keyof WaybillItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'price') {
          newItem.total = Number(newItem.quantity) * Number(newItem.price)
        }
        return newItem
      }
      return item
    }))
  }

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', quantity: 1, unit: 'ც', price: 0, total: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id))
    }
  }

  const total = items.reduce((sum, i) => sum + i.total, 0)

  const handleSave = (upload: boolean) => {
    const newWaybill: Waybill = {
      id: `wb-${Date.now()}`,
      rsNumber: upload ? `WB-${Math.floor(100000 + Math.random() * 900000)}` : null,
      type,
      status: upload ? 'sent' : 'draft',
      buyerName,
      buyerTin,
      total,
      sentAt: upload ? new Date().toISOString().split('T')[0] : null,
      createdAt: new Date().toISOString().split('T')[0],
      items,
      startAddress,
      endAddress,
      carNumber,
      driverTin,
    }
    onSave(newWaybill)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ახალი ზედნადები'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{'შეავსეთ ზედნადების დეტალები'}</p>
        </div>
        <button onClick={onClose} className="px-4 py-2 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
          {'გაუქმება'}
        </button>
      </div>

      <div className="rounded-xl p-6 space-y-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        {/* Type Selection */}
        <div>
          <label className="text-[0.8125rem] font-medium mb-3 block" style={{ color: 'var(--muted-foreground)' }}>{'ზედნადების ტიპი'}</label>
          <div className="flex flex-wrap gap-2">
            {([1, 2, 3, 4] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="px-4 py-2 rounded-lg text-[0.875rem] font-medium transition-all"
                style={{ 
                  background: type === t ? typeLabels[t].bg : 'var(--secondary)', 
                  color: type === t ? typeLabels[t].color : 'var(--muted-foreground)',
                  border: type === t ? `2px solid ${typeLabels[t].color}` : '2px solid transparent'
                }}
              >
                {typeLabels[t].label}
              </button>
            ))}
          </div>
        </div>

        {/* Buyer Section */}
        <div className="space-y-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
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
          <div className="flex gap-2 items-center">
            <input
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              placeholder="სახელი"
            />
            {isVatPayer && (
              <span className="px-2.5 py-1 rounded-full text-[0.75rem] font-medium" style={{ background: '#dcfce7', color: '#15803d' }}>
                {'დღგ-ს გადამხდელი'}
              </span>
            )}
          </div>
        </div>

        {/* Route Section */}
        <div className="space-y-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <h3 className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'მარშრუტი'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={startAddress}
              onChange={(e) => setStartAddress(e.target.value)}
              className="px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              placeholder="საწყისი მისამართი"
            />
            <input
              value={endAddress}
              onChange={(e) => setEndAddress(e.target.value)}
              className="px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              placeholder="საბოლოო მისამართი"
            />
            <input
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value)}
              className="px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              placeholder="მანქანის ნომერი"
            />
            <input
              value={driverTin}
              onChange={(e) => setDriverTin(e.target.value)}
              className="px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              placeholder="მძღოლის პ.ნ. (არასავალდებულო)"
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="space-y-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <h3 className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'საქონელი'}</h3>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--secondary)' }}>
                  <th className="px-3 py-2 text-left text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'სახელი'}</th>
                  <th className="px-3 py-2 text-center text-[0.75rem] font-semibold w-20" style={{ color: 'var(--muted-foreground)' }}>{'რაოდ.'}</th>
                  <th className="px-3 py-2 text-center text-[0.75rem] font-semibold w-20" style={{ color: 'var(--muted-foreground)' }}>{'ერთ.'}</th>
                  <th className="px-3 py-2 text-center text-[0.75rem] font-semibold w-24" style={{ color: 'var(--muted-foreground)' }}>{'ფასი'}</th>
                  <th className="px-3 py-2 text-right text-[0.75rem] font-semibold w-24" style={{ color: 'var(--muted-foreground)' }}>{'ჯამი'}</th>
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
                      <select
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                        className="w-full px-2 py-1.5 rounded text-[0.875rem]"
                        style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      >
                        {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
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
            + {'საქონლის დამატება'}
          </button>
        </div>

        {/* Total */}
        <div className="flex justify-between items-baseline pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-[1rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'სულ'}</span>
          <span className="text-[1.5rem] font-bold" style={{ color: '#16a34a' }}>{formatCurrency(total)}</span>
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
