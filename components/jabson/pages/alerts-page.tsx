'use client'

import { AlertTriangle, Package, Bell, CheckCircle } from 'lucide-react'
import { products, formatCurrency } from '@/lib/demo-data'

export function AlertsPage() {
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.minStock)
  const outOfStock = products.filter((p) => p.stock === 0)
  const allAlerts = [...outOfStock.map(p => ({ ...p, type: 'out' as const })), ...lowStock.map(p => ({ ...p, type: 'low' as const }))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'მარაგის ალერტები'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {'პროდუქტები რომლებიც ყურადღებას საჭიროებენ'}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#ef444415', color: '#ef4444' }}><AlertTriangle className="w-5 h-5" /></div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ამოწურული'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#dc2626' }}>{outOfStock.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#f59e0b15', color: '#f59e0b' }}><Bell className="w-5 h-5" /></div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'დაბალი მარაგი'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#d97706' }}>{lowStock.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#16a34a15', color: '#16a34a' }}><CheckCircle className="w-5 h-5" /></div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ნორმალური'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#16a34a' }}>{products.length - lowStock.length - outOfStock.length}</div>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      {allAlerts.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: '#16a34a' }} />
          <div className="text-[1.125rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'ყველა მარაგი ნორმაშია!'}</div>
        </div>
      ) : (
        <div className="space-y-2">
          {allAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all" style={{
              background: 'var(--card)',
              border: `1px solid ${alert.type === 'out' ? '#fecaca' : '#fde68a'}`,
              borderLeft: `4px solid ${alert.type === 'out' ? '#ef4444' : '#f59e0b'}`,
            }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: alert.type === 'out' ? '#fee2e2' : '#fef3c7', color: alert.type === 'out' ? '#dc2626' : '#d97706' }}>
                {alert.type === 'out' ? <AlertTriangle className="w-5 h-5" /> : <Package className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{alert.name}</div>
                <div className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>
                  {alert.type === 'out' ? 'ამოწურულია' : `${alert.stock} ${alert.unit} (მინ: ${alert.minStock})`}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[0.875rem] font-semibold" style={{ color: 'var(--foreground)' }}>{formatCurrency(alert.price)}</div>
                <span className="inline-flex px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold" style={{
                  background: alert.type === 'out' ? '#fee2e2' : '#fef3c7',
                  color: alert.type === 'out' ? '#b91c1c' : '#92400e',
                }}>
                  {alert.type === 'out' ? 'ამოწურული' : 'დაბალი'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
