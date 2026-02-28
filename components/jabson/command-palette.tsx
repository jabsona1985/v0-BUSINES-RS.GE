'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  Users,
  Settings,
  BarChart3,
  ClipboardList,
  ArrowLeftRight,
  FileText,
  Calculator,
  ArrowRight,
  Globe,
  FolderOpen,
  Truck,
} from 'lucide-react'
import { products } from '@/lib/demo-data'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: string) => void
}

const pages = [
  { id: 'dashboard', label: 'დაფა', icon: LayoutDashboard },
  { id: 'pos', label: 'POS — გაყიდვა', icon: ShoppingCart },
  { id: 'inventory', label: 'ინვენტარი', icon: Package },
  { id: 'sales', label: 'გაყიდვები', icon: Receipt },
  { id: 'customers', label: 'კლიენტები', icon: Users },
  { id: 'categories', label: 'კატეგორიები', icon: FolderOpen },
  { id: 'distributor-orders', label: 'დისტრ. შეკვეთები', icon: Truck },
  { id: 'rsge', label: 'RS.GE ინტეგრაცია', icon: Globe },
  { id: 'adjustments', label: 'ინვენტარიზაცია', icon: ClipboardList },
  { id: 'transfers', label: 'გადატანები', icon: ArrowLeftRight },
  { id: 'accounting', label: 'ბუღალტერია', icon: Calculator },
  { id: 'reports', label: 'ანგარიშები', icon: BarChart3 },
  { id: 'waybills', label: 'ზედნადები', icon: FileText },
  { id: 'settings', label: 'პარამეტრები', icon: Settings },
]

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredPages = pages.filter((p) =>
    p.label.toLowerCase().includes(query.toLowerCase())
  )

  const filteredProducts = query.length > 0
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.barcode.includes(query) ||
        p.sku.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : []

  const allItems = [
    ...filteredPages.map((p) => ({ type: 'page' as const, ...p })),
    ...filteredProducts.map((p) => ({ type: 'product' as const, id: p.id, label: p.name, sku: p.sku, price: p.price })),
  ]

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, allItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && allItems[selectedIndex]) {
      const item = allItems[selectedIndex]
      if (item.type === 'page') {
        onNavigate(item.id)
        onClose()
      } else if (item.type === 'product') {
        onNavigate('inventory')
        onClose()
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }, [allItems, selectedIndex, onNavigate, onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center pt-[8vh]"
      style={{ background: 'rgb(0 0 0/0.4)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-[580px] rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
        style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ძიება გვერდების, პროდუქტების..."
            className="flex-1 text-[1.0625rem] bg-transparent outline-none font-sans"
            style={{ color: 'var(--foreground)' }}
          />
          <kbd className="text-[0.6875rem] font-mono font-semibold px-2 py-0.5 rounded" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[380px] overflow-y-auto">
          {filteredPages.length > 0 && (
            <>
              <div
                className="px-5 pt-3 pb-1 text-[0.6875rem] font-bold uppercase tracking-[0.08em]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {'გვერდები'}
              </div>
              {filteredPages.map((page, idx) => {
                const Icon = page.icon
                const isSelected = idx === selectedIndex
                return (
                  <button
                    key={page.id}
                    onClick={() => {
                      onNavigate(page.id)
                      onClose()
                    }}
                    className="flex items-center gap-3.5 px-5 py-3 w-full text-left transition-colors"
                    style={{
                      background: isSelected ? 'var(--accent)' : 'transparent',
                      color: 'var(--foreground)',
                    }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-[0.9rem]">{page.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0" style={isSelected ? { opacity: 0.5 } : {}} />
                  </button>
                )
              })}
            </>
          )}

          {filteredProducts.length > 0 && (
            <>
              <div
                className="px-5 pt-3 pb-1 text-[0.6875rem] font-bold uppercase tracking-[0.08em]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {'პროდუქტები'}
              </div>
              {filteredProducts.map((product, idx) => {
                const globalIdx = filteredPages.length + idx
                const isSelected = globalIdx === selectedIndex
                return (
                  <button
                    key={product.id}
                    onClick={() => {
                      onNavigate('inventory')
                      onClose()
                    }}
                    className="flex items-center gap-3.5 px-5 py-3 w-full text-left transition-colors"
                    style={{
                      background: isSelected ? 'var(--accent)' : 'transparent',
                      color: 'var(--foreground)',
                    }}
                  >
                    <Package className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                    <div className="flex-1">
                      <span className="text-[0.9rem]">{product.name}</span>
                      <span className="text-[0.75rem] ml-2" style={{ color: 'var(--muted-foreground)' }}>{product.sku}</span>
                    </div>
                    <span className="text-[0.875rem] font-semibold" style={{ color: 'var(--primary)' }}>
                      {product.price.toFixed(2)} {'₾'}
                    </span>
                  </button>
                )
              })}
            </>
          )}

          {allItems.length === 0 && query.length > 0 && (
            <div className="py-12 text-center" style={{ color: 'var(--muted-foreground)' }}>
              <div className="text-[1rem] font-medium">{'შედეგი ვერ მოიძებნა'}</div>
              <div className="text-[0.875rem] mt-1">{'სცადეთ სხვა საძიებო სიტყვა'}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-4 px-5 py-2.5 border-t text-[0.75rem]" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
          <span>{'↑↓ ნავიგაცია'}</span>
          <span>{'↵ გადასვლა'}</span>
          <span>{'ESC დახურვა'}</span>
        </div>
      </div>
    </div>
  )
}
