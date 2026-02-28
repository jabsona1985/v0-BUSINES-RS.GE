'use client'

import { useState } from 'react'
import { Search, Bell, Moon, Sun, Menu, X } from 'lucide-react'
import { notifications as demoNotifications, type Notification, formatDate } from '@/lib/demo-data'

interface TopBarProps {
  onToggleSidebar?: () => void
  sidebarCollapsed?: boolean
  onOpenCommand?: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export function TopBar({ onToggleSidebar, onOpenCommand, darkMode, onToggleDarkMode }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState<Notification[]>(demoNotifications)
  const unreadCount = notifs.filter((n) => !n.isRead).length

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-6 h-[60px]"
      style={{
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 rounded-lg transition-colors"
        style={{ color: 'var(--muted-foreground)' }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-[420px] relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--muted-foreground)' }} />
        <button
          onClick={onOpenCommand}
          className="w-full text-left px-3.5 py-2 pl-10 rounded-full text-[0.875rem] transition-all cursor-pointer"
          style={{
            background: 'var(--secondary)',
            border: '1.5px solid var(--border)',
            color: 'var(--muted-foreground)',
          }}
        >
          {'ძიება...'}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-0.5">
            <kbd className="text-[0.625rem] font-semibold font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--border)', color: 'var(--muted-foreground)' }}>
              {'Ctrl'}
            </kbd>
            <kbd className="text-[0.625rem] font-semibold font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--border)', color: 'var(--muted-foreground)' }}>
              K
            </kbd>
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={onToggleDarkMode}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: 'var(--muted-foreground)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors relative"
            style={{ color: 'var(--muted-foreground)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#ef4444', border: '2px solid var(--card)' }} />
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div
                className="absolute right-0 top-12 z-50 w-[360px] rounded-xl overflow-hidden"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'შეტყობინებები'}</span>
                  <button
                    onClick={() => {
                      setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })))
                    }}
                    className="text-[0.75rem] font-medium"
                    style={{ color: 'var(--primary)' }}
                  >
                    {'ყველას წაკითხვა'}
                  </button>
                </div>
                <div className="max-h-[340px] overflow-y-auto">
                  {notifs.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer"
                      style={{ background: n.isRead ? 'transparent' : 'var(--accent)' }}
                      onClick={() => {
                        setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)))
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{
                          background: n.type === 'stock_alert' ? '#ef4444' : n.type === 'sale' ? '#16a34a' : n.type === 'distributor_order' ? '#f59e0b' : '#3b82f6',
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.8125rem] font-medium" style={{ color: 'var(--foreground)' }}>{n.title}</div>
                        <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{n.body}</div>
                        <div className="text-[0.6875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                          {formatDate(n.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
