'use client'

import { useState } from 'react'
import { Search, Shield, Filter, Eye, Plus, Pencil, Trash2 } from 'lucide-react'
import { auditLog as demoLog, formatDate, type AuditLogEntry } from '@/lib/demo-data'

const actionMap: Record<string, { label: string; bg: string; color: string; Icon: typeof Plus }> = {
  CREATE: { label: 'შექმნა', bg: '#dcfce7', color: '#15803d', Icon: Plus },
  UPDATE: { label: 'განახლება', bg: '#dbeafe', color: '#1d4ed8', Icon: Pencil },
  DELETE: { label: 'წაშლა', bg: '#fee2e2', color: '#b91c1c', Icon: Trash2 },
}

const tableNames: Record<string, string> = {
  products: 'პროდუქტები',
  sales: 'გაყიდვები',
  inventory_adjustments: 'ინვენტარიზაცია',
  branch_settings: 'ფილიალის პარამეტრები',
}

export function AuditLogPage() {
  const [entries] = useState<AuditLogEntry[]>(demoLog)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = entries.filter((e) => {
    const matchesSearch = e.userEmail.includes(search.toLowerCase()) || e.tableName.includes(search.toLowerCase()) || e.recordId.includes(search)
    const matchesAction = actionFilter === 'all' || e.action === actionFilter
    return matchesSearch && matchesAction
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'აუდიტ ლოგი'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {'სისტემის ყველა ცვლილების ისტორია — მონაცემთა მთლიანობის კონტროლი'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.8125rem] font-medium" style={{ background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
          <Shield className="w-4 h-4" />
          {'PRO ფუნქცია'}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ძიება მომხმარებლით, ცხრილით..." className="w-full pl-9 pr-3 py-2 rounded-lg text-[0.875rem] outline-none" style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} />
        </div>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="px-3 py-2 rounded-lg text-[0.875rem] cursor-pointer" style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}>
          <option value="all">{'ყველა მოქმედება'}</option>
          <option value="CREATE">{'შექმნა'}</option>
          <option value="UPDATE">{'განახლება'}</option>
          <option value="DELETE">{'წაშლა'}</option>
        </select>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        {filtered.map((entry) => {
          const action = actionMap[entry.action]
          const Icon = action.Icon
          const isExpanded = expandedId === entry.id
          return (
            <div key={entry.id} className="rounded-xl overflow-hidden transition-all" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                className="flex items-center gap-4 w-full px-5 py-4 text-left transition-colors"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: action.bg, color: action.color }}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[0.875rem] font-semibold" style={{ color: 'var(--foreground)' }}>{entry.userEmail}</span>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold" style={{ background: action.bg, color: action.color }}>{action.label}</span>
                    <span className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{tableNames[entry.tableName] || entry.tableName}</span>
                  </div>
                  <div className="text-[0.75rem] font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{entry.recordId}</div>
                </div>
                <span className="text-[0.8125rem] font-mono flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>{formatDate(entry.createdAt)}</span>
                <Eye className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--muted-foreground)', opacity: isExpanded ? 1 : 0.3 }} />
              </button>
              {isExpanded && (entry.oldData || entry.newData) && (
                <div className="px-5 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {entry.oldData && (
                      <div className="rounded-lg p-3" style={{ background: '#fee2e220', border: '1px solid #fecaca40' }}>
                        <div className="text-[0.6875rem] font-bold uppercase mb-1.5" style={{ color: '#b91c1c' }}>{'ძველი მნიშვნელობა'}</div>
                        <pre className="text-[0.75rem] font-mono whitespace-pre-wrap" style={{ color: 'var(--foreground)' }}>{JSON.stringify(entry.oldData, null, 2)}</pre>
                      </div>
                    )}
                    {entry.newData && (
                      <div className="rounded-lg p-3" style={{ background: '#dcfce720', border: '1px solid #bbf7d040' }}>
                        <div className="text-[0.6875rem] font-bold uppercase mb-1.5" style={{ color: '#15803d' }}>{'ახალი მნიშვნელობა'}</div>
                        <pre className="text-[0.75rem] font-mono whitespace-pre-wrap" style={{ color: 'var(--foreground)' }}>{JSON.stringify(entry.newData, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
