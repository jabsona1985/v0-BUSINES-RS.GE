'use client'

import { useState } from 'react'
import {
  Plus, Edit2, Trash2, X, FolderOpen, Tag, GripVertical, Package,
  Search, MoreHorizontal, Check
} from 'lucide-react'
import { categories as demoCategories, products } from '@/lib/demo-data'

interface Category {
  id: string
  name: string
  color: string
  icon: string
  productCount?: number
}

const colorPalette = [
  '#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
  '#a855f7', '#84cc16',
]

export function CategoriesPage() {
  const [categoryList, setCategoryList] = useState<Category[]>(
    demoCategories.map((c) => ({
      ...c,
      productCount: products.filter((p) => p.category === c.name).length,
    }))
  )
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const totalProducts = categoryList.reduce((sum, c) => sum + (c.productCount || 0), 0)
  const filtered = categoryList.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = (id: string) => {
    setCategoryList((prev) => prev.filter((c) => c.id !== id))
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'კატეგორიები'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {categoryList.length} {'კატეგორია,'} {totalProducts} {'პროდუქტი'}
          </p>
        </div>
        <button
          onClick={() => { setEditingCategory(null); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium transition-all"
          style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}
        >
          <Plus className="w-4 h-4" />
          {'ახალი კატეგორია'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#16a34a15', color: '#16a34a' }}>
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'სულ კატეგორია'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{categoryList.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'სულ პროდუქტი'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{totalProducts}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'საშუალო/კატეგორია'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>
              {categoryList.length > 0 ? Math.round(totalProducts / categoryList.length) : 0}
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="relative flex-1 max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="კატეგორიის ძიება..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-[0.875rem] outline-none"
            style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cat) => (
          <div
            key={cat.id}
            className="rounded-xl p-5 transition-all group"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgb(0 0 0/0.06)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: cat.color + '18', border: `1px solid ${cat.color}30` }}
                >
                  <div className="w-4 h-4 rounded-full" style={{ background: cat.color }} />
                </div>
                <div>
                  <div className="text-[1rem] font-semibold" style={{ color: 'var(--foreground)' }}>{cat.name}</div>
                  <div className="text-[0.8125rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    {cat.productCount || 0} {'პროდუქტი'}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditingCategory(cat); setShowModal(true) }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ color: 'var(--muted-foreground)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {deleteConfirm === cat.id ? (
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: '#fee2e2', color: '#dc2626' }}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(cat.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ color: '#ef4444' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Mini color bar */}
            <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--secondary)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  background: cat.color,
                  width: `${Math.min(((cat.productCount || 0) / Math.max(totalProducts, 1)) * 100 * 3, 100)}%`,
                }}
              />
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button
          onClick={() => { setEditingCategory(null); setShowModal(true) }}
          className="rounded-xl p-5 flex flex-col items-center justify-center gap-3 min-h-[140px] transition-all"
          style={{ border: '2px dashed var(--border)', color: 'var(--muted-foreground)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted-foreground)' }}
        >
          <Plus className="w-6 h-6" />
          <span className="text-[0.875rem] font-medium">{'ახალი კატეგორია'}</span>
        </button>
      </div>

      {filtered.length === 0 && search && (
        <div className="py-12 text-center">
          <FolderOpen className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--muted-foreground)', opacity: 0.3 }} />
          <div className="text-[1rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'კატეგორია ვერ მოიძებნა'}</div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => { setShowModal(false); setEditingCategory(null) }}
          onSave={(cat) => {
            if (editingCategory) {
              setCategoryList((prev) => prev.map((c) => (c.id === cat.id ? cat : c)))
            } else {
              setCategoryList((prev) => [...prev, { ...cat, productCount: 0 }])
            }
            setShowModal(false)
            setEditingCategory(null)
          }}
        />
      )}
    </div>
  )
}

function CategoryModal({
  category,
  onClose,
  onSave,
}: {
  category: Category | null
  onClose: () => void
  onSave: (c: Category) => void
}) {
  const [name, setName] = useState(category?.name || '')
  const [color, setColor] = useState(category?.color || colorPalette[0])

  const handleSubmit = () => {
    if (!name.trim()) return
    onSave({
      id: category?.id || `cat-${Date.now()}`,
      name: name.trim(),
      color,
      icon: 'tag',
      productCount: category?.productCount,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-[440px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>
              {category ? 'კატეგორიის რედაქტირება' : 'ახალი კატეგორია'}
            </h2>
            <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              {'დაასახელეთ და აირჩიეთ ფერი'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 space-y-5">
          {/* Preview */}
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: color + '18', border: `2px solid ${color}40` }}
              >
                <div className="w-5 h-5 rounded-full" style={{ background: color }} />
              </div>
              <div>
                <div className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{name || 'კატეგორია'}</div>
                <div className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{category?.productCount || 0} {'პროდუქტი'}</div>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>
              {'სახელი'} <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="მაგ: სასმელი, საკვები..."
              className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              autoFocus
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>
              {'ფერი'}
            </label>
            <div className="flex flex-wrap gap-2">
              {colorPalette.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: c + '20',
                    border: color === c ? `2.5px solid ${c}` : '2.5px solid transparent',
                    boxShadow: color === c ? `0 0 0 2px ${c}30` : 'none',
                  }}
                >
                  <div className="w-4 h-4 rounded-full" style={{ background: c }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end px-6 py-5">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}>
            {'გაუქმება'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-5 py-2 rounded-lg text-[0.875rem] font-medium disabled:opacity-50"
            style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}
          >
            {category ? 'შენახვა' : 'დამატება'}
          </button>
        </div>
      </div>
    </div>
  )
}
