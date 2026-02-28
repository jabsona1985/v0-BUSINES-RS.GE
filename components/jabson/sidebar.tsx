'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  Users,
  Truck,
  BarChart3,
  Settings,
  CreditCard,
  ArrowLeftRight,
  ClipboardList,
  FileText,
  Building2,
  Shield,
  ChevronDown,
  LogOut,
  Bell,
  ChevronLeft,
  Layers,
  Calculator,
  AlertTriangle,
  Globe,
} from 'lucide-react'

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

const navSections = [
  {
    label: 'მთავარი',
    items: [
      { id: 'dashboard', label: 'დაფა', icon: LayoutDashboard },
      { id: 'pos', label: 'POS - გაყიდვა', icon: ShoppingCart, badge: 'LIVE' },
    ],
  },
  {
    label: 'მართვა',
    items: [
      { id: 'inventory', label: 'ინვენტარი', icon: Package },
      { id: 'categories', label: 'კატეგორიები', icon: Layers },
      { id: 'sales', label: 'გაყიდვები', icon: Receipt },
      { id: 'purchases', label: 'შესყიდვები', icon: Truck },
      { id: 'distributor-orders', label: 'დისტრ. შეკვეთები', icon: Truck, badgeCount: 1 },
      { id: 'customers', label: 'კლიენტები', icon: Users },
      { id: 'suppliers', label: 'მომწოდებლები', icon: Layers },
    ],
  },
  {
    label: 'საწყობი',
    items: [
      { id: 'adjustments', label: 'ინვენტარიზაცია', icon: ClipboardList },
      { id: 'transfers', label: 'გადატანები', icon: ArrowLeftRight },
      { id: 'alerts', label: 'მარაგის ალერტები', icon: AlertTriangle, badgeCount: 3 },
    ],
  },
  {
    label: 'ფინანსები',
    items: [
      { id: 'accounting', label: 'ბუღალტერია', icon: Calculator },
      { id: 'reports', label: 'ანგარიშები', icon: BarChart3 },
      { id: 'cash-register', label: 'სალარო', icon: CreditCard },
    ],
  },
  {
    label: 'rs.ge',
    items: [
      { id: 'rsge', label: 'RS.GE ინტეგრაცია', icon: Globe },
      { id: 'waybills', label: 'ზედნადები', icon: FileText },
      { id: 'invoices', label: 'ანგარიშ-ფაქტურა', icon: FileText },
    ],
  },
  {
    label: 'ადმინი',
    items: [
      { id: 'audit-log', label: 'აუდიტ ლოგი', icon: Shield },
      { id: 'company', label: 'კომპანია', icon: Building2 },
      { id: 'settings', label: 'პარამეტრები', icon: Settings },
    ],
  },
]

export function Sidebar({ activePage, onNavigate, collapsed = false, onToggleCollapse }: SidebarProps) {
  const [branchOpen, setBranchOpen] = useState(false)

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{ background: 'var(--sidebar-bg, #0f1724)', borderRight: '1px solid var(--sidebar-border, #1e2d3d)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: 'var(--sidebar-border, #1e2d3d)' }}>
        <div
          className="flex items-center justify-center rounded-xl font-extrabold text-sm flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #16a34a, #4ade80)',
            color: 'white',
            boxShadow: '0 4px 14px 0 rgb(22 163 74/0.35)',
          }}
        >
          {'J'}
        </div>
        {!collapsed && (
          <div>
            <div className="text-[1.1rem] font-bold" style={{ color: 'white' }}>JabsOn</div>
            <div className="text-[0.6875rem] font-medium" style={{ color: '#4ade80' }}>PRO გეგმა</div>
          </div>
        )}
        {!collapsed && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="ml-auto p-1 rounded-md transition-colors hover:bg-[#1a2940]"
            style={{ color: '#9ca3af' }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Branch Switcher */}
      {!collapsed && (
        <div className="mx-3 mt-3">
          <button
            onClick={() => setBranchOpen(!branchOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all"
            style={{
              background: '#1a2940',
              border: '1px solid #1e2d3d',
              color: 'white',
            }}
          >
            <div className="text-left">
              <div className="text-[0.875rem] font-medium">{'მთავარი მაღაზია'}</div>
              <div className="text-[0.6875rem]" style={{ color: '#9ca3af' }}>{'მთავარი ფილიალი'}</div>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${branchOpen ? 'rotate-180' : ''}`} style={{ color: '#9ca3af' }} />
          </button>
          {branchOpen && (
            <div className="mt-1 rounded-xl overflow-hidden" style={{ background: '#1a2940', border: '1px solid #1e2d3d' }}>
              <button className="w-full text-left px-3.5 py-2 text-[0.8125rem] hover:bg-[#253553] transition-colors" style={{ color: '#e2e8f0' }}>
                {'მთავარი მაღაზია'}
              </button>
              <button className="w-full text-left px-3.5 py-2 text-[0.8125rem] hover:bg-[#253553] transition-colors" style={{ color: '#9ca3af' }}>
                {'ფილიალი #2 - ვაკე'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'none' }}>
        {navSections.map((section) => (
          <div key={section.label} className="pt-4 pb-1">
            {!collapsed && (
              <div
                className="px-6 mb-1 text-[0.625rem] font-bold uppercase tracking-[0.1em]"
                style={{ color: '#4b5563' }}
              >
                {section.label}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-3 mx-2.5 my-0.5 rounded-[10px] transition-all text-left w-[calc(100%-20px)] ${
                    collapsed ? 'justify-center px-0 py-2.5' : 'px-3.5 py-2.5'
                  }`}
                  style={
                    isActive
                      ? {
                          background: 'linear-gradient(135deg, #166534, #15803d)',
                          color: 'white',
                          fontWeight: 500,
                          boxShadow: '0 2px 8px rgb(22 163 74/0.4)',
                        }
                      : {
                          color: '#9ca3af',
                          background: 'transparent',
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#1a2940'
                      e.currentTarget.style.color = '#e2e8f0'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#9ca3af'
                    }
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" style={{ opacity: isActive ? 1 : 0.7 }} />
                  {!collapsed && (
                    <>
                      <span className="text-[0.875rem]">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-[0.625rem] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#16a34a', color: 'white' }}>
                          {item.badge}
                        </span>
                      )}
                      {item.badgeCount && (
                        <span
                          className="ml-auto text-[0.6875rem] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                          style={{ background: '#dc2626', color: 'white' }}
                        >
                          {item.badgeCount}
                        </span>
                      )}
                    </>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-3 border-t" style={{ borderColor: 'var(--sidebar-border, #1e2d3d)' }}>
        <div className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-[10px] cursor-pointer hover:bg-[#1a2940] transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[0.8125rem] font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', color: 'white' }}
          >
            ნბ
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-[0.8125rem] font-medium truncate" style={{ color: '#e2e8f0' }}>ნინო ბერიძე</div>
              <div className="text-[0.6875rem] truncate" style={{ color: '#6b7280' }}>nino@jabson.ge</div>
            </div>
          )}
          {!collapsed && <LogOut className="w-4 h-4 flex-shrink-0" style={{ color: '#6b7280' }} />}
        </div>
      </div>
    </aside>
  )
}
