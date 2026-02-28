'use client'

import { useState } from 'react'
import {
  Globe, Link2, LinkIcon, Unlink, RefreshCw, CheckCircle2, XCircle,
  FileText, ArrowUpRight, Clock, Download, Upload, ShieldCheck, AlertCircle, Settings
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/demo-data'

type RsGeStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface SyncLog {
  id: string
  type: 'waybill' | 'invoice' | 'products' | 'vat'
  direction: 'upload' | 'download'
  status: 'success' | 'error' | 'pending'
  message: string
  count?: number
  createdAt: string
}

const demoSyncLogs: SyncLog[] = [
  { id: 'sl-1', type: 'waybill', direction: 'upload', status: 'success', message: 'ზედნადები #WB-2026-0451 წარმატებით აიტვირთა', count: 1, createdAt: '2026-03-01T14:30:00Z' },
  { id: 'sl-2', type: 'invoice', direction: 'upload', status: 'success', message: 'ანგარიშ-ფაქტურა INV-2026-112 გადაიგზავნა', count: 1, createdAt: '2026-03-01T13:15:00Z' },
  { id: 'sl-3', type: 'products', direction: 'download', status: 'success', message: '14 პროდუქტის ფასი განახლდა RS.GE-დან', count: 14, createdAt: '2026-03-01T10:00:00Z' },
  { id: 'sl-4', type: 'vat', direction: 'download', status: 'success', message: 'დღგ-ს დეკლარაციის მონაცემები ჩამოიტვირთა', createdAt: '2026-02-28T18:00:00Z' },
  { id: 'sl-5', type: 'waybill', direction: 'upload', status: 'error', message: 'ზედნადების ატვირთვა ვერ მოხერხდა — სერვერის შეცდომა', createdAt: '2026-02-28T15:45:00Z' },
  { id: 'sl-6', type: 'products', direction: 'download', status: 'success', message: '8 ახალი პროდუქტი იმპორტირებულია RS.GE-დან', count: 8, createdAt: '2026-02-27T09:30:00Z' },
]

export function RsGePage() {
  const [status, setStatus] = useState<RsGeStatus>('disconnected')
  const [serviceUser, setServiceUser] = useState('')
  const [servicePass, setServicePass] = useState('')
  const [companyTin, setCompanyTin] = useState('404123456')
  const [syncLogs] = useState<SyncLog[]>(demoSyncLogs)
  const [syncing, setSyncing] = useState(false)
  const [autoSync, setAutoSync] = useState(true)
  const [activeTab, setActiveTab] = useState<'auth' | 'sync' | 'logs'>('auth')

  const handleConnect = () => {
    if (!serviceUser || !servicePass) return
    setStatus('connecting')
    setTimeout(() => {
      setStatus('connected')
    }, 1800)
  }

  const handleDisconnect = () => {
    setStatus('disconnected')
    setServiceUser('')
    setServicePass('')
  }

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 2500)
  }

  const statusConfig = {
    disconnected: { label: 'არ არის დაკავშირებული', color: '#6b7280', bg: '#f3f4f6', icon: Unlink },
    connecting: { label: 'დაკავშირება...', color: '#d97706', bg: '#fef3c7', icon: RefreshCw },
    connected: { label: 'დაკავშირებულია', color: '#16a34a', bg: '#dcfce7', icon: CheckCircle2 },
    error: { label: 'შეცდომა', color: '#dc2626', bg: '#fee2e2', icon: XCircle },
  }

  const currentStatus = statusConfig[status]
  const StatusIcon = currentStatus.icon

  const tabs = [
    { id: 'auth' as const, label: 'ავტორიზაცია', icon: ShieldCheck },
    { id: 'sync' as const, label: 'სინქრონიზაცია', icon: RefreshCw },
    { id: 'logs' as const, label: 'ისტორია', icon: Clock },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-[0.9375rem]"
            style={{ background: '#1d4ed815', color: '#1d4ed8', border: '1px solid #1d4ed830' }}
          >
            RS
          </div>
          <div>
            <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'RS.GE ინტეგრაცია'}</h1>
            <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              {'შემოსავლების სამსახურის სისტემასთან კავშირი'}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-3.5 py-2 rounded-full text-[0.8125rem] font-medium"
          style={{ background: currentStatus.bg, color: currentStatus.color }}
        >
          <StatusIcon className={`w-4 h-4 ${status === 'connecting' ? 'animate-spin' : ''}`} />
          {currentStatus.label}
        </div>
      </div>

      {/* Status Card */}
      {status === 'connected' && (
        <div
          className="flex items-center gap-4 px-5 py-4 rounded-xl"
          style={{ background: '#dcfce7', border: '1px solid #bbf7d0' }}
        >
          <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: '#16a34a' }} />
          <div className="flex-1">
            <div className="text-[0.9375rem] font-semibold" style={{ color: '#14532d' }}>{'RS.GE დაკავშირებულია'}</div>
            <div className="text-[0.8125rem] mt-0.5" style={{ color: '#166534' }}>
              {'საიდენტიფიკაციო კოდი:'} {companyTin} {' — ბოლო სინქრონიზაცია: 01.03.2026, 14:30'}
            </div>
          </div>
          <button
            onClick={handleSync}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[0.8125rem] font-medium"
            style={{ background: '#16a34a', color: 'white', border: '1px solid #15803d' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {'სინქრონიზაცია'}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--secondary)' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[0.875rem] font-medium transition-all flex-1 justify-center"
              style={isActive
                ? { background: 'var(--card)', color: 'var(--foreground)', boxShadow: '0 1px 3px rgb(0 0 0/0.08)' }
                : { color: 'var(--muted-foreground)' }
              }
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Auth Tab */}
      {activeTab === 'auth' && (
        <div className="rounded-xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {status === 'connected' ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#16a34a15', color: '#16a34a' }}>
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[1rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'აქტიური კავშირი'}</h3>
                  <p className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{'RS.GE სერვისული ანგარიშით დაკავშირებული'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="px-4 py-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
                  <div className="text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'სტატუსი'}</div>
                  <div className="text-[0.9375rem] font-semibold mt-1" style={{ color: '#16a34a' }}>{'აქტიური'}</div>
                </div>
                <div className="px-4 py-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
                  <div className="text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'კომპანიის კოდი'}</div>
                  <div className="text-[0.9375rem] font-semibold mt-1 font-mono" style={{ color: 'var(--foreground)' }}>{companyTin}</div>
                </div>
                <div className="px-4 py-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
                  <div className="text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'სერვის მომხმარებელი'}</div>
                  <div className="text-[0.9375rem] font-semibold mt-1" style={{ color: 'var(--foreground)' }}>{serviceUser || 'jabson_api'}</div>
                </div>
              </div>

              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.8125rem] font-medium"
                style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
              >
                <Unlink className="w-4 h-4" />
                {'კავშირის გაწყვეტა'}
              </button>
            </div>
          ) : (
            <div className="space-y-6 max-w-[480px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#1d4ed815', color: '#1d4ed8' }}>
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[1rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'RS.GE ავტორიზაცია'}</h3>
                  <p className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{'შეიყვანეთ RS.GE სერვისული ანგარიშის მონაცემები'}</p>
                </div>
              </div>

              <div
                className="flex items-start gap-3 px-4 py-3 rounded-lg"
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#2563eb' }} />
                <div className="text-[0.8125rem]" style={{ color: '#1e40af' }}>
                  {'RS.GE სერვისული ანგარიში იქმნება შემოსავლების სამსახურის ვებ-გვერდზე. გთხოვთ, გამოიყენოთ სერვისული (არა პირადი) მომხმარებელი.'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    {'საიდენტიფიკაციო კოდი'} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={companyTin}
                    onChange={(e) => setCompanyTin(e.target.value)}
                    placeholder="მაგ: 404123456"
                    className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none font-mono"
                    style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    {'სერვის მომხმარებელი'} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={serviceUser}
                    onChange={(e) => setServiceUser(e.target.value)}
                    placeholder="მაგ: jabson_api"
                    className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none"
                    style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    {'სერვის პაროლი'} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    value={servicePass}
                    onChange={(e) => setServicePass(e.target.value)}
                    placeholder="********"
                    className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none"
                    style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>

              <button
                onClick={handleConnect}
                disabled={status === 'connecting' || !serviceUser || !servicePass}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[0.875rem] font-medium transition-all disabled:opacity-50"
                style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}
              >
                {status === 'connecting' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                {status === 'connecting' ? 'დაკავშირება...' : 'დაკავშირება'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sync Tab */}
      {activeTab === 'sync' && (
        <div className="space-y-4">
          {/* Auto sync toggle */}
          <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                <div>
                  <div className="text-[0.9375rem] font-medium" style={{ color: 'var(--foreground)' }}>{'ავტომატური სინქრონიზაცია'}</div>
                  <div className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{'ყოველ 30 წუთში ავტომატურად'}</div>
                </div>
              </div>
              <button
                onClick={() => setAutoSync(!autoSync)}
                className="w-11 h-6 rounded-full relative cursor-pointer transition-colors"
                style={{ background: autoSync ? '#16a34a' : '#d1d5db' }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                  style={{ left: autoSync ? 'calc(100% - 20px)' : '4px' }}
                />
              </button>
            </div>
          </div>

          {/* Sync Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Upload, title: 'ზედნადებების ატვირთვა', desc: 'გადაუგზავნეთ ახალი ზედნადებები RS.GE-ს', action: 'upload', color: '#3b82f6' },
              { icon: Upload, title: 'ანგარიშ-ფაქტურები', desc: 'გამოწერილი ანგარიშ-ფაქტურების ატვირთვა', action: 'upload', color: '#8b5cf6' },
              { icon: Download, title: 'პროდუქტების იმპორტი', desc: 'RS.GE კატალოგიდან პროდუქტების ჩამოტვირთვა', action: 'download', color: '#16a34a' },
              { icon: Download, title: 'დღგ მონაცემები', desc: 'დღგ-ს დეკლარაციის მონაცემების ჩამოტვირთვა', action: 'download', color: '#f59e0b' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="rounded-xl p-5"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: item.color + '15', color: item.color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{item.title}</div>
                      <div className="text-[0.8125rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleSync}
                    disabled={status !== 'connected'}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-[0.8125rem] font-medium transition-all disabled:opacity-40"
                    style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
                  >
                    {syncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
                    {status !== 'connected' ? 'ჯერ დააკავშირეთ' : syncing ? 'მიმდინარეობს...' : 'დაწყება'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'სინქრონიზაციის ისტორია'}</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {syncLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-4 px-5 py-3.5">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: log.status === 'success' ? '#dcfce7' : log.status === 'error' ? '#fee2e2' : '#fef3c7',
                    color: log.status === 'success' ? '#16a34a' : log.status === 'error' ? '#dc2626' : '#d97706',
                  }}
                >
                  {log.direction === 'upload' ? <Upload className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.875rem] font-medium" style={{ color: 'var(--foreground)' }}>{log.message}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{formatDate(log.createdAt)}</span>
                    {log.count && (
                      <span className="text-[0.6875rem] font-medium px-1.5 py-0.5 rounded" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
                        {log.count} {'ჩანაწერი'}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className="text-[0.75rem] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: log.status === 'success' ? '#dcfce7' : log.status === 'error' ? '#fee2e2' : '#fef3c7',
                    color: log.status === 'success' ? '#15803d' : log.status === 'error' ? '#dc2626' : '#92400e',
                  }}
                >
                  {log.status === 'success' ? 'წარმატებული' : log.status === 'error' ? 'შეცდომა' : 'მიმდინარე'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
