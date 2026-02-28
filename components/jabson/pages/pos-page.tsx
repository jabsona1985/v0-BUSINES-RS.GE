'use client'

import { useState, useCallback } from 'react'
import { Search, X, Minus, Plus, CreditCard, Banknote, ArrowUpDown, Trash2, ShoppingCart, Printer, Check, Tag } from 'lucide-react'
import { products, categories, formatCurrency, type Product } from '@/lib/demo-data'

interface CartItem {
  product: Product
  quantity: number
}

export function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [cashGiven, setCashGiven] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery)
    const matchesCategory = activeCategory === 'all' || p.category === categories.find((c) => c.id === activeCategory)?.name
    return matchesSearch && matchesCategory && p.posVisible && p.isActive
  })

  const addToCart = useCallback((product: Product) => {
    if (product.stock <= 0) return
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) return prev
        return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) => prev.map((item) => {
      if (item.product.id !== productId) return item
      const newQty = item.quantity + delta
      if (newQty <= 0) return item
      if (newQty > item.product.stock) return item
      return { ...item, quantity: newQty }
    }))
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discountPct = promoApplied ? 10 : 0
  const discountAmount = subtotal * discountPct / 100
  const vatAmount = (subtotal - discountAmount) * 0.18
  const total = subtotal - discountAmount
  const change = paymentMethod === 'cash' && cashGiven ? parseFloat(cashGiven) - total : 0

  const handleCheckout = () => {
    setShowPaymentModal(false)
    setShowReceiptModal(true)
  }

  const handleNewSale = () => {
    setCart([])
    setShowReceiptModal(false)
    setPromoCode('')
    setPromoApplied(false)
    setCashGiven('')
  }

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden -m-6 lg:-m-7">
      {/* Left: Products */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--background)' }}>
        {/* POS Topbar */}
        <div className="sticky top-0 z-10 flex gap-3 items-center px-5 py-3.5" style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ძიება ან ბარკოდი..."
              className="w-full pl-9 pr-3 py-2 rounded-full text-[0.875rem] outline-none"
              style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 px-5 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setActiveCategory('all')}
            className="px-4 py-1.5 rounded-full text-[0.8125rem] font-medium whitespace-nowrap transition-all flex-shrink-0"
            style={activeCategory === 'all' ? { background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 2px 8px rgb(22 163 74/0.3)' } : { background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--muted-foreground)' }}
          >
            {'ყველა'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-4 py-1.5 rounded-full text-[0.8125rem] font-medium whitespace-nowrap transition-all flex-shrink-0"
              style={activeCategory === cat.id ? { background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 2px 8px rgb(22 163 74/0.3)' } : { background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--muted-foreground)' }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
            {filteredProducts.map((product) => {
              const inCart = cart.find((item) => item.product.id === product.id)
              const isOOS = product.stock <= 0
              return (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={isOOS}
                  className="relative flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all select-none"
                  style={{
                    background: inCart ? 'var(--accent)' : 'var(--card)',
                    border: `2px solid ${inCart ? '#16a34a' : 'var(--border)'}`,
                  }}
                >
                  <div className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl" style={{ background: product.categoryColor + '15' }}>
                    <ShoppingCart className="w-6 h-6" style={{ color: product.categoryColor }} />
                  </div>
                  <div className="text-[0.8125rem] font-medium leading-tight" style={{ color: 'var(--foreground)' }}>{product.name}</div>
                  <div className="text-[0.9375rem] font-bold" style={{ color: '#16a34a' }}>{formatCurrency(product.price)}</div>
                  <div className="text-[0.6875rem]" style={{ color: 'var(--muted-foreground)' }}>{product.stock} {product.unit}</div>
                  {inCart && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[0.6875rem] font-bold" style={{ background: '#16a34a', color: 'white' }}>
                      {inCart.quantity}
                    </div>
                  )}
                  {isOOS && (
                    <div className="absolute inset-0 rounded-xl flex items-center justify-center text-[0.75rem] font-semibold" style={{ background: 'rgb(0 0 0/0.45)', color: 'white', borderRadius: 12 }}>
                      {'ამოწურულია'}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-[380px] flex-shrink-0 flex flex-col" style={{ background: 'var(--card)', borderLeft: '1px solid var(--border)' }}>
        {/* Cart Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            <span className="text-[1rem] font-bold" style={{ color: 'var(--foreground)' }}>{'კალათა'}</span>
            {cart.length > 0 && (
              <span className="text-[0.75rem] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>
          {cart.length > 0 && (
            <button onClick={() => setCart([])} className="text-[0.8125rem] font-medium" style={{ color: '#ef4444' }}>{'გასუფთავება'}</button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: 'var(--muted-foreground)' }}>
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <div className="text-[0.9375rem] font-medium">{'კალათა ცარიელია'}</div>
              <div className="text-[0.8125rem] text-center">{'აირჩიეთ პროდუქტი მარცხენა პანელიდან'}</div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 px-2 py-3 rounded-lg transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.875rem] font-medium truncate" style={{ color: 'var(--foreground)' }}>{item.product.name}</div>
                  <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{formatCurrency(item.product.price)} x {item.quantity}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQuantity(item.product.id, -1)} className="w-7 h-7 rounded-md flex items-center justify-center" style={{ border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center text-[0.875rem] font-semibold" style={{ color: 'var(--foreground)' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, 1)} className="w-7 h-7 rounded-md flex items-center justify-center" style={{ border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[0.9375rem] font-semibold w-20 text-right" style={{ color: 'var(--foreground)' }}>
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
                <button onClick={() => removeFromCart(item.product.id)} className="w-7 h-7 rounded-md flex items-center justify-center" style={{ color: '#ef4444' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Promo Code */}
        {cart.length > 0 && (
          <div className="px-5 py-2 flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--muted-foreground)' }} />
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="პრომო კოდი"
                className="w-full pl-8 pr-3 py-2 rounded-lg text-[0.8125rem] outline-none"
                style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <button
              onClick={() => {
                if (promoCode.toLowerCase() === 'jabson10') setPromoApplied(true)
              }}
              className="px-3 py-2 rounded-lg text-[0.8125rem] font-medium"
              style={{ background: promoApplied ? '#dcfce7' : 'var(--secondary)', color: promoApplied ? '#15803d' : 'var(--foreground)', border: `1.5px solid ${promoApplied ? '#bbf7d0' : 'var(--border)'}` }}
            >
              {promoApplied ? 'გამოყენებულია' : 'გამოყენება'}
            </button>
          </div>
        )}

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-4 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>
                <span>{'ჯამი'}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-[0.875rem]" style={{ color: '#16a34a' }}>
                  <span>{'ფასდაკლება (-10%)'}</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>
                <span>{'დღგ (18%)'}</span>
                <span>{formatCurrency(vatAmount)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="text-[1rem] font-bold" style={{ color: 'var(--foreground)' }}>{'სულ'}</span>
                <span className="text-[1.5rem] font-extrabold" style={{ color: 'var(--foreground)' }}>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-3 gap-2 mt-4 mb-3">
              {([['cash', 'ნაღდი', Banknote], ['card', 'ბარათი', CreditCard], ['transfer', 'გადარიცხვა', ArrowUpDown]] as const).map(([method, label, Icon]) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className="flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg text-[0.8125rem] font-medium transition-all"
                  style={paymentMethod === method
                    ? { background: 'var(--accent)', color: 'var(--primary)', border: '2px solid var(--primary)' }
                    : { background: 'transparent', color: 'var(--muted-foreground)', border: '2px solid var(--border)' }
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0}
              className="w-full py-3.5 rounded-xl text-[1.0625rem] font-bold transition-all"
              style={{
                background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                color: 'white',
                boxShadow: '0 4px 14px 0 rgb(22 163 74/0.35)',
                border: 'none',
              }}
            >
              {'გადახდა — '}{formatCurrency(total)}
            </button>
          </div>
        )}
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-[420px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{'გადახდის დადასტურება'}</h2>
                <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{'თანხა: '}{formatCurrency(total)}</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 space-y-4">
              {paymentMethod === 'cash' && (
                <div className="space-y-1.5">
                  <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მიღებული თანხა'}</label>
                  <input
                    type="number"
                    value={cashGiven}
                    onChange={(e) => setCashGiven(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-lg text-[1.125rem] font-semibold text-center outline-none"
                    style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                    autoFocus
                  />
                  {parseFloat(cashGiven) >= total && (
                    <div className="flex justify-between px-3 py-2 rounded-lg text-[0.9375rem] font-semibold" style={{ background: '#dcfce7', color: '#15803d' }}>
                      <span>{'ხურდა'}</span>
                      <span>{formatCurrency(parseFloat(cashGiven) - total)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-5">
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 px-4 py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}>{'გაუქმება'}</button>
              <button
                onClick={handleCheckout}
                disabled={paymentMethod === 'cash' && (!cashGiven || parseFloat(cashGiven) < total)}
                className="flex-1 px-4 py-2.5 rounded-lg text-[0.875rem] font-medium disabled:opacity-50"
                style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d' }}
              >
                {'დადასტურება'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-[380px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
            <div className="flex flex-col items-center py-8 px-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#dcfce7' }}>
                <Check className="w-8 h-8" style={{ color: '#16a34a' }} />
              </div>
              <h2 className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{'გაყიდვა წარმატებულია!'}</h2>
              <div className="text-[1.75rem] font-extrabold mt-2" style={{ color: '#16a34a' }}>{formatCurrency(total)}</div>
              <div className="text-[0.875rem] mt-1 font-mono" style={{ color: 'var(--muted-foreground)' }}>RC-{String(Math.floor(Math.random() * 100000)).padStart(6, '0')}</div>
              <div className="flex gap-3 mt-6 w-full">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}>
                  <Printer className="w-4 h-4" />
                  {'ბეჭდვა'}
                </button>
                <button onClick={handleNewSale} className="flex-1 px-4 py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d' }}>
                  {'ახალი გაყიდვა'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
