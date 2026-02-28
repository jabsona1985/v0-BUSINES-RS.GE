'use client'

import { useState } from 'react'
import { Search, Plus, Users, Star, CreditCard, Eye, Edit2, X, Phone, Mail, MapPin, Award } from 'lucide-react'
import { customers as demoCustomers, formatCurrency, type Customer } from '@/lib/demo-data'

export function CustomersPage() {
  const [customerList, setCustomerList] = useState<Customer[]>(demoCustomers)
  const [search, setSearch] = useState('')
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = customerList.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || (c.phone || '').includes(search) || (c.tin || '').includes(search)
  )

  const totalDebt = customerList.reduce((sum, c) => sum + Math.max(0, c.balance), 0)
  const totalLoyalty = customerList.reduce((sum, c) => sum + c.loyaltyPts, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'კლიენტები'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {customerList.length} {'კლიენტი — ლოიალობის ქულები:'} {totalLoyalty.toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium"
          style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}
        >
          <Plus className="w-4 h-4" />{'ახალი კლიენტი'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#3b82f615', color: '#3b82f6' }}><Users className="w-5 h-5" /></div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'სულ კლიენტი'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{customerList.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#f59e0b15', color: '#f59e0b' }}><CreditCard className="w-5 h-5" /></div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'საერთო ბალანსი'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#d97706' }}>{formatCurrency(totalDebt)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#8b5cf615', color: '#8b5cf6' }}><Star className="w-5 h-5" /></div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ლოიალობის ქულები'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{totalLoyalty.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-[400px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ძიება სახელით, ტელეფონით, საიდ. კოდით..." className="w-full pl-9 pr-3 py-2 rounded-lg text-[0.875rem] outline-none" style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} />
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((customer) => (
          <div
            key={customer.id}
            className="rounded-xl overflow-hidden transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 2px 0 rgb(0 0 0/0.05)' }}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-[0.875rem] font-bold" style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', color: 'white' }}>
                    {customer.name.substring(0, 2)}
                  </div>
                  <div>
                    <div className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{customer.name}</div>
                    {customer.tin && <div className="text-[0.75rem] font-mono" style={{ color: 'var(--muted-foreground)' }}>{'ID: '}{customer.tin}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewCustomer(customer)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                {customer.phone && (
                  <div className="flex items-center gap-2 text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>
                    <Phone className="w-3.5 h-3.5" />{customer.phone}
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-2 text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>
                    <Mail className="w-3.5 h-3.5" />{customer.email}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="text-center">
                  <div className="text-[0.6875rem] uppercase font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'ვიზიტი'}</div>
                  <div className="text-[1rem] font-bold" style={{ color: 'var(--foreground)' }}>{customer.visitCount}</div>
                </div>
                <div className="text-center">
                  <div className="text-[0.6875rem] uppercase font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'დახარჯული'}</div>
                  <div className="text-[1rem] font-bold" style={{ color: 'var(--primary)' }}>{formatCurrency(customer.totalSpent)}</div>
                </div>
                <div className="text-center">
                  <div className="text-[0.6875rem] uppercase font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'ქულები'}</div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
                    <span className="text-[1rem] font-bold" style={{ color: 'var(--foreground)' }}>{customer.loyaltyPts}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Detail Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-[480px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-[1rem] font-bold" style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', color: 'white' }}>
                  {viewCustomer.name.substring(0, 2)}
                </div>
                <div>
                  <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{viewCustomer.name}</h2>
                  {viewCustomer.tin && <p className="text-[0.8125rem] font-mono" style={{ color: 'var(--muted-foreground)' }}>{'საიდ. კოდი: '}{viewCustomer.tin}</p>}
                </div>
              </div>
              <button onClick={() => setViewCustomer(null)} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 space-y-4 pb-6">
              <div className="grid grid-cols-2 gap-3">
                {viewCustomer.phone && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--secondary)' }}>
                    <Phone className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{viewCustomer.phone}</span>
                  </div>
                )}
                {viewCustomer.email && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--secondary)' }}>
                    <Mail className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{viewCustomer.email}</span>
                  </div>
                )}
              </div>
              {viewCustomer.address && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--secondary)' }}>
                  <MapPin className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{viewCustomer.address}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center px-3 py-3 rounded-xl" style={{ background: 'var(--secondary)' }}>
                  <div className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{viewCustomer.visitCount}</div>
                  <div className="text-[0.6875rem] font-medium uppercase" style={{ color: 'var(--muted-foreground)' }}>{'ვიზიტი'}</div>
                </div>
                <div className="text-center px-3 py-3 rounded-xl" style={{ background: 'var(--secondary)' }}>
                  <div className="text-[1.375rem] font-bold" style={{ color: 'var(--primary)' }}>{formatCurrency(viewCustomer.totalSpent)}</div>
                  <div className="text-[0.6875rem] font-medium uppercase" style={{ color: 'var(--muted-foreground)' }}>{'დახარჯული'}</div>
                </div>
                <div className="text-center px-3 py-3 rounded-xl" style={{ background: 'var(--secondary)' }}>
                  <div className="text-[1.375rem] font-bold" style={{ color: '#f59e0b' }}>{viewCustomer.loyaltyPts}</div>
                  <div className="text-[0.6875rem] font-medium uppercase" style={{ color: 'var(--muted-foreground)' }}>{'ქულები'}</div>
                </div>
              </div>
              {viewCustomer.balance !== 0 && (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: viewCustomer.balance > 0 ? '#fef3c7' : '#dcfce7', border: `1px solid ${viewCustomer.balance > 0 ? '#fde68a' : '#bbf7d0'}` }}>
                  <span className="text-[0.875rem] font-medium" style={{ color: viewCustomer.balance > 0 ? '#92400e' : '#15803d' }}>{'ბალანსი'}</span>
                  <span className="text-[1.125rem] font-bold" style={{ color: viewCustomer.balance > 0 ? '#d97706' : '#16a34a' }}>{formatCurrency(viewCustomer.balance)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-[480px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ახალი კლიენტი'}</h2>
                <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{'შეავსეთ კლიენტის მონაცემები'}</p>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 space-y-4">
              {[
                { label: 'სახელი / კომპანია', required: true, key: 'name', placeholder: 'მაგ: გიორგი მაისურაძე' },
                { label: 'საიდენტიფიკაციო კოდი', key: 'tin', placeholder: '123456789' },
                { label: 'ტელეფონი', key: 'phone', placeholder: '599xxxxxx' },
                { label: 'ელ.ფოსტა', key: 'email', placeholder: 'info@mail.ge' },
                { label: 'მისამართი', key: 'address', placeholder: 'თბილისი...' },
              ].map((field) => (
                <div key={field.key} className="space-y-1.5">
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
