'use client'

import { useState } from 'react'
import {
  Plus, Search, Filter, Download, Upload, MoreHorizontal, Edit2, Trash2, X,
  Package, AlertTriangle, ChevronDown, BarChart3, Eye
} from 'lucide-react'
import { products as demoProducts, categories, formatCurrency, type Product } from '@/lib/demo-data'

function getStockStatus(stock: number, minStock: number): { label: string; color: string; dotColor: string } {
  if (stock === 0) return { label: 'ამოწურული', color: '#6b7280', dotColor: '#9ca3af' }
  if (stock <= minStock * 0.5) return { label: 'კრიტიკული', color: '#dc2626', dotColor: '#ef4444' }
  if (stock <= minStock) return { label: 'დაბალი', color: '#d97706', dotColor: '#f59e0b' }
  return { label: 'ნორმა', color: '#16a34a', dotColor: '#22c55e' }
}

export function InventoryPage() {
  const [productList, setProductList] = useState<Product[]>(demoProducts)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewProduct, setViewProduct] = useState<Product | null>(null)

  const filtered = productList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search)
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    const matchesStock = stockFilter === 'all' ||
      (stockFilter === 'low' && p.stock <= p.minStock && p.stock > 0) ||
      (stockFilter === 'out' && p.stock === 0) ||
      (stockFilter === 'ok' && p.stock > p.minStock)
    return matchesSearch && matchesCategory && matchesStock
  })

  const totalValue = productList.reduce((sum, p) => sum + p.price * p.stock, 0)
  const lowStockCount = productList.filter((p) => p.stock <= p.minStock && p.stock > 0).length
  const outOfStockCount = productList.filter((p) => p.stock === 0).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ინვენტარი'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {productList.length} {'პროდუქტი — საერთო ღირებულება:'} {formatCurrency(totalValue)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[0.8125rem] font-medium transition-colors"
            style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
          >
            <Upload className="w-4 h-4" />
            {'იმპორტი'}
          </button>
          <button
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[0.8125rem] font-medium transition-colors"
            style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
          >
            <Download className="w-4 h-4" />
            {'ექსპორტი'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium transition-all"
            style={{
              background: '#16a34a',
              color: 'white',
              border: '1.5px solid #15803d',
              boxShadow: '0 1px 3px rgb(22 163 74/0.3)',
            }}
          >
            <Plus className="w-4 h-4" />
            {'ახალი პროდუქტი'}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#16a34a15', color: '#16a34a' }}>
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'სულ პროდუქტი'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{productList.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'დაბალი მარაგი'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#d97706' }}>{lowStockCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#ef444415', color: '#ef4444' }}>
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ამოწურული'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#dc2626' }}>{outOfStockCount}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className="flex items-center gap-3 flex-wrap px-4 py-3 rounded-xl"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ძიება სახელით, SKU, ბარკოდით..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-[0.875rem] outline-none transition-all"
            style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-[0.875rem] cursor-pointer"
          style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
        >
          <option value="all">{'ყველა კატეგორია'}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-[0.875rem] cursor-pointer"
          style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
        >
          <option value="all">{'მარაგის სტატუსი'}</option>
          <option value="ok">{'ნორმა'}</option>
          <option value="low">{'დაბალი'}</option>
          <option value="out">{'ამოწურული'}</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--secondary)' }}>
                <th className="px-5 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'პროდუქტი'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'SKU'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'კატეგორია'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ფასი'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'თვითღირებ.'}</th>
                <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'მარაგი'}</th>
                <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'სტატუსი'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{''}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const status = getStockStatus(product.stock, product.minStock)
                return (
                  <tr key={product.id} className="transition-colors group" style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[1.125rem]" style={{ background: product.categoryColor + '15' }}>
                          <Package className="w-4 h-4" style={{ color: product.categoryColor }} />
                        </div>
                        <div>
                          <div className="text-[0.875rem] font-medium" style={{ color: 'var(--foreground)' }}>{product.name}</div>
                          <div className="text-[0.75rem] font-mono" style={{ color: 'var(--muted-foreground)' }}>{product.barcode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[0.875rem] font-mono" style={{ color: 'var(--muted-foreground)' }}>{product.sku}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium"
                        style={{ background: product.categoryColor + '15', color: product.categoryColor, border: `1px solid ${product.categoryColor}30` }}
                      >
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{formatCurrency(product.price)}</td>
                    <td className="px-4 py-3.5 text-right text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{formatCurrency(product.costPrice)}</td>
                    <td className="px-4 py-3.5 text-center text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>
                      {product.stock} {product.unit}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium" style={{ color: status.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: status.dotColor, boxShadow: `0 0 0 3px ${status.dotColor}30` }} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewProduct(product)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color: 'var(--muted-foreground)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color: 'var(--muted-foreground)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProductList((prev) => prev.filter((p) => p.id !== product.id))}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color: '#ef4444' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Package className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--muted-foreground)', opacity: 0.3 }} />
            <div className="text-[1rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'პროდუქტი ვერ მოიძებნა'}</div>
            <div className="text-[0.875rem] mt-1" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>{'შეცვალეთ ფილტრები ან დაამატეთ ახალი'}</div>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setShowAddModal(false); setEditingProduct(null) }}
          onSave={(product) => {
            if (editingProduct) {
              setProductList((prev) => prev.map((p) => p.id === product.id ? product : p))
            } else {
              setProductList((prev) => [...prev, product])
            }
            setShowAddModal(false)
            setEditingProduct(null)
          }}
        />
      )}

      {/* View Product Modal */}
      {viewProduct && (
        <ProductDetailModal product={viewProduct} onClose={() => setViewProduct(null)} />
      )}
    </div>
  )
}

function ProductModal({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (p: Product) => void }) {
  const [form, setForm] = useState<Partial<Product>>(product || {
    name: '', sku: '', barcode: '', category: categories[0].name, categoryColor: categories[0].color,
    price: 0, costPrice: 0, stock: 0, minStock: 0, unit: 'ც', vatRate: 0.18, isActive: true, posVisible: true,
  })

  const handleSubmit = () => {
    const newProduct: Product = {
      id: product?.id || `p-${Date.now()}`,
      name: form.name || '',
      sku: form.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
      barcode: form.barcode || '',
      category: form.category || categories[0].name,
      categoryColor: categories.find((c) => c.name === form.category)?.color || '#16a34a',
      price: form.price || 0,
      costPrice: form.costPrice || 0,
      stock: form.stock || 0,
      minStock: form.minStock || 0,
      unit: form.unit || 'ც',
      vatRate: form.vatRate || 0.18,
      isActive: form.isActive !== false,
      posVisible: form.posVisible !== false,
      updatedAt: new Date().toISOString().split('T')[0],
    }
    onSave(newProduct)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{product ? 'პროდუქტის რედაქტირება' : 'ახალი პროდუქტი'}</h2>
            <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{'შეავსეთ პროდუქტის ინფორმაცია'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ color: 'var(--muted-foreground)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'სახელი'} <span style={{ color: '#ef4444' }}>*</span></label>
            <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none transition-all" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} placeholder="მაგ: კოკა-კოლა 0.5ლ" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>SKU</label>
              <input value={form.sku || ''} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none transition-all" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ბარკოდი'}</label>
              <input value={form.barcode || ''} onChange={(e) => setForm({ ...form, barcode: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none transition-all" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'კატეგორია'}</label>
            <select value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value, categoryColor: categories.find((c) => c.name === e.target.value)?.color })} className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] cursor-pointer" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}>
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ფასი'} <span style={{ color: '#ef4444' }}>*</span></label>
              <div className="relative">
                <input type="number" step="0.01" value={form.price || ''} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none transition-all" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[0.875rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'₾'}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'თვითღირებულება'}</label>
              <div className="relative">
                <input type="number" step="0.01" value={form.costPrice || ''} onChange={(e) => setForm({ ...form, costPrice: parseFloat(e.target.value) || 0 })} className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none transition-all" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[0.875rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'₾'}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მარაგი'}</label>
              <input type="number" value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: parseFloat(e.target.value) || 0 })} className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მინ. მარაგი'}</label>
              <input type="number" value={form.minStock || ''} onChange={(e) => setForm({ ...form, minStock: parseFloat(e.target.value) || 0 })} className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ერთეული'}</label>
              <select value={form.unit || 'ც'} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] cursor-pointer" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}>
                <option value="ც">{'ცალი'}</option>
                <option value="კგ">{'კილოგრამი'}</option>
                <option value="ლ">{'ლიტრი'}</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end px-6 py-5">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}>{'გაუქმება'}</button>
          <button onClick={handleSubmit} className="px-5 py-2 rounded-lg text-[0.875rem] font-medium" style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}>{product ? 'შენახვა' : 'დამატება'}</button>
        </div>
      </div>
    </div>
  )
}

function ProductDetailModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const status = getStockStatus(product.stock, product.minStock)
  const profit = product.price - product.costPrice
  const margin = product.costPrice > 0 ? ((profit / product.costPrice) * 100).toFixed(1) : '0'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-[480px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: product.categoryColor + '15' }}>
              <Package className="w-6 h-6" style={{ color: product.categoryColor }} />
            </div>
            <div>
              <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{product.name}</h2>
              <p className="text-[0.8125rem] font-mono" style={{ color: 'var(--muted-foreground)' }}>{product.sku} / {product.barcode}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <DetailItem label="ფასი" value={formatCurrency(product.price)} />
            <DetailItem label="თვითღირებულება" value={formatCurrency(product.costPrice)} />
            <DetailItem label="მოგება" value={formatCurrency(profit)} valueColor="#16a34a" />
            <DetailItem label="მარჟა" value={`${margin}%`} valueColor="#16a34a" />
            <DetailItem label="მარაგი" value={`${product.stock} ${product.unit}`} />
            <DetailItem label="სტატუსი" value={status.label} valueColor={status.color} />
            <DetailItem label="კატეგორია" value={product.category} />
            <DetailItem label="დღგ" value={`${(product.vatRate * 100).toFixed(0)}%`} />
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="px-3 py-2.5 rounded-lg" style={{ background: 'var(--secondary)' }}>
      <div className="text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
      <div className="text-[0.9375rem] font-semibold mt-0.5" style={{ color: valueColor || 'var(--foreground)' }}>{value}</div>
    </div>
  )
}
