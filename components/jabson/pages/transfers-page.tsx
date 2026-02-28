'use client'

import { useState } from 'react'
import { ArrowLeftRight, ArrowRight, Clock, Check, X as XIcon, Plus, Package, X } from 'lucide-react'
import { stockTransfers as demoTransfers, formatDate, type StockTransfer } from '@/lib/demo-data'

const statusMap: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: 'მოლოდინში', bg: '#fef3c7', color: '#92400e' },
  completed: { label: 'დასრულებული', bg: '#dcfce7', color: '#15803d' },
  cancelled: { label: 'გაუქმებული', bg: '#fee2e2', color: '#b91c1c' },
}

export function TransfersPage() {
  const [transfers, setTransfers] = useState<StockTransfer[]>(demoTransfers)
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'გადატანები'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {'ფილიალებს შორის მარაგის გადატანა'}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium"
          style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}
        >
          <Plus className="w-4 h-4" />{'ახალი გადატანა'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#3b82f615', color: '#3b82f6' }}><ArrowLeftRight className="w-5 h-5" /></div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'სულ გადატანა'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{transfers.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#f59e0b15', color: '#f59e0b' }}><Clock className="w-5 h-5" /></div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მოლოდინში'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#d97706' }}>{transfers.filter(t => t.status === 'pending').length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#16a34a15', color: '#16a34a' }}><Check className="w-5 h-5" /></div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'დასრულებული'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#16a34a' }}>{transfers.filter(t => t.status === 'completed').length}</div>
          </div>
        </div>
      </div>

      {/* Transfer Cards */}
      <div className="space-y-3">
        {transfers.map((transfer) => {
          const status = statusMap[transfer.status]
          return (
            <div
              key={transfer.id}
              className="rounded-xl p-5 transition-all"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 2px 0 rgb(0 0 0/0.05)' }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
                    {transfer.fromBranch}
                  </div>
                  <ArrowRight className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
                    {transfer.toBranch}
                  </div>
                </div>
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium flex-shrink-0" style={{ background: status.bg, color: status.color }}>
                  {status.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {transfer.items.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[0.8125rem]" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
                    <Package className="w-3.5 h-3.5" style={{ color: 'var(--muted-foreground)' }} />
                    {item.name} <span className="font-semibold">x{item.quantity}</span>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>
                <span>{transfer.createdBy}</span>
                <span>{formatDate(transfer.createdAt)}</span>
                {transfer.status === 'pending' && (
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() => setTransfers(prev => prev.map(t => t.id === transfer.id ? { ...t, status: 'completed' as const } : t))}
                      className="px-3 py-1 rounded-md text-[0.75rem] font-medium"
                      style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }}
                    >
                      {'დადასტურება'}
                    </button>
                    <button
                      onClick={() => setTransfers(prev => prev.map(t => t.id === transfer.id ? { ...t, status: 'cancelled' as const } : t))}
                      className="px-3 py-1 rounded-md text-[0.75rem] font-medium"
                      style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}
                    >
                      {'გაუქმება'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* New Transfer Modal (placeholder) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-[480px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ახალი გადატანა'}</h2>
              <button onClick={() => setShowModal(false)} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-8 text-center">
              <ArrowLeftRight className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--muted-foreground)', opacity: 0.3 }} />
              <p className="text-[0.9375rem]" style={{ color: 'var(--muted-foreground)' }}>{'ფილიალებს შორის მარაგის გადატანის ფორმა'}</p>
              <p className="text-[0.8125rem] mt-1" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>{'დემო ვერსიაში მხოლოდ არსებული გადატანების მართვაა შესაძლებელი'}</p>
            </div>
            <div className="flex justify-end px-6 py-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}>{'დახურვა'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
