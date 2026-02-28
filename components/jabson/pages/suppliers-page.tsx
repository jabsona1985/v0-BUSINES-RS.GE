'use client'

import { useState } from 'react'
import { Search, Plus, Truck, Phone, Mail, X } from 'lucide-react'
import { suppliers as demoSuppliers, formatCurrency, type Supplier } from '@/lib/demo-data'

export function SuppliersPage() {
  const [supplierList, setSupplierList] = useState<Supplier[]>(demoSuppliers)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = supplierList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || (s.tin || '').includes(search)
  )

  const totalOwed = supplierList.reduce((sum, s) => sum + Math.abs(Math.min(0, s.balance)), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'მომწოდებლები'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {supplierList.length} {'მომწოდებელი — საერთო ვალი:'} {formatCurrency(totalOwed)}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium"
          style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}
        >
          <Plus className="w-4 h-4" />{'ახალი მომწოდებელი'}
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-[400px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ძიება სახელით, საიდ. კოდით..." className="w-full pl-9 pr-3 py-2 rounded-lg text-[0.875rem] outline-none" style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} />
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((supplier) => (
          <div
            key={supplier.id}
            className="rounded-xl overflow-hidden transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 2px 0 rgb(0 0 0/0.05)' }}
          >
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: '#3b82f615', color: '#3b82f6' }}>
                  <Truck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.9375rem] font-semibold truncate" style={{ color: 'var(--foreground)' }}>{supplier.name}</div>
                  {supplier.tin && <div className="text-[0.75rem] font-mono" style={{ color: 'var(--muted-foreground)' }}>{'ID: '}{supplier.tin}</div>}
                </div>
              </div>
              <div className="space-y-1.5">
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>
                    <Phone className="w-3.5 h-3.5" />{supplier.phone}
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center gap-2 text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>
                    <Mail className="w-3.5 h-3.5" />{supplier.email}
                  </div>
                )}
              </div>
              {supplier.balance !== 0 && (
                <div className="flex items-center justify-between mt-4 pt-3 px-3 py-2 rounded-lg" style={{ background: supplier.balance < 0 ? '#fee2e2' : '#dcfce7', borderTop: '1px solid var(--border)' }}>
                  <span className="text-[0.8125rem] font-medium" style={{ color: supplier.balance < 0 ? '#b91c1c' : '#15803d' }}>{'ბალანსი'}</span>
                  <span className="text-[1rem] font-bold" style={{ color: supplier.balance < 0 ? '#dc2626' : '#16a34a' }}>{formatCurrency(Math.abs(supplier.balance))}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-[480px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ახალი მომწოდებელი'}</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 space-y-4">
              {[
                { label: 'სახელი / კომპანია', required: true, placeholder: 'მაგ: შპს "დელტა"' },
                { label: 'საიდენტიფიკაციო კოდი', placeholder: '123456789' },
                { label: 'ტელეფონი', placeholder: '322xxxxxx' },
                { label: 'ელ.ფოსტა', placeholder: 'info@supplier.ge' },
              ].map((field) => (
                <div key={field.label} className="space-y-1.5">
                  <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                  </label>
                  <input className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} placeholder={field.placeholder} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-end px-6 py-5">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}>{'გაუქმება'}</button>
              <button onClick={() => setShowAddModal(false)} className="px-5 py-2 rounded-lg text-[0.875rem] font-medium" style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d' }}>{'შენახვა'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
