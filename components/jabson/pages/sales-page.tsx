'use client'

import { useState } from 'react'
import { Search, Download, Eye, X, Receipt, Calendar, Filter, RefreshCw, RotateCcw, Printer, Check } from 'lucide-react'
import { sales as demoSales, formatCurrency, formatDate, type Sale, type SaleItem } from '@/lib/demo-data'
import { exportSalesToExcel } from '@/lib/excel'

interface ReturnItem {
  item: SaleItem
  selected: boolean
  returnQty: number
}

export function SalesPage() {
  const [salesList, setSalesList] = useState<Sale[]>(demoSales)
  const [search, setSearch] = useState('')
  const [methodFilter, setMethodFilter] = useState<string>('all')
  const [viewSale, setViewSale] = useState<Sale | null>(null)
  const [returnSale, setReturnSale] = useState<Sale | null>(null)
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([])
  const [returnReason, setReturnReason] = useState('')
  const [showReturnReceipt, setShowReturnReceipt] = useState<Sale | null>(null)

  const filtered = salesList.filter((s) => {
    const matchesSearch = s.receiptNumber.toLowerCase().includes(search.toLowerCase()) || (s.customerName || '').toLowerCase().includes(search.toLowerCase())
    const matchesMethod = methodFilter === 'all' || s.paymentMethod === methodFilter
    return matchesSearch && matchesMethod
  })

  const totalRevenue = filtered.reduce((sum, s) => sum + s.total, 0)
  const totalVat = filtered.reduce((sum, s) => sum + s.vatAmount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'გაყიდვები'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {filtered.length} {'ტრანზაქცია — შემოსავალი:'} {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              const allItems = salesList.flatMap(s => s.items.map(i => ({ ...i, saleReceiptNumber: s.receiptNumber })))
              exportSalesToExcel(salesList, allItems)
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[0.8125rem] font-medium" 
            style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
          >
            <Download className="w-4 h-4" />
            {'Excel-ში'}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#16a34a15', color: '#16a34a' }}><Receipt className="w-5 h-5" /></div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'სულ გაყიდვა'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{salesList.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#3b82f615', color: '#3b82f6' }}><Calendar className="w-5 h-5" /></div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'შემოსავალი'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{formatCurrency(totalRevenue)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#f59e0b15', color: '#f59e0b' }}><Filter className="w-5 h-5" /></div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'დღგ'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{formatCurrency(totalVat)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#8b5cf615', color: '#8b5cf6' }}><RefreshCw className="w-5 h-5" /></div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'უკან დაბრუნება'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: 'var(--foreground)' }}>{salesList.filter(s => s.isReturn).length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ძიება ჩეკის ნომრით, კლიენტით..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-[0.875rem] outline-none"
            style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
          />
        </div>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-[0.875rem] cursor-pointer"
          style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
        >
          <option value="all">{'ყველა მეთოდი'}</option>
          <option value="cash">{'ნაღდი'}</option>
          <option value="card">{'ბარათი'}</option>
          <option value="transfer">{'გადარიცხვა'}</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--secondary)' }}>
                <th className="px-5 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ჩეკი'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'კლიენტი'}</th>
                <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ნივთები'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'მეთოდი'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'თანხა'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'თარიღი'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{''}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sale) => (
                <tr 
                  key={sale.id} 
                  className="transition-colors group" 
                  style={{ 
                    borderBottom: '1px solid var(--border)',
                    background: sale.isReturn ? '#fef3c7' : 'transparent'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = sale.isReturn ? '#fef3c7' : 'var(--secondary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = sale.isReturn ? '#fef3c7' : 'transparent' }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {sale.isReturn && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.6875rem] font-bold" style={{ background: '#fbbf24', color: '#78350f' }}>
                          <RotateCcw className="w-3 h-3" />
                        </span>
                      )}
                      <span className="text-[0.875rem] font-mono font-medium" style={{ color: 'var(--foreground)' }}>{sale.receiptNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{sale.customerName || '---'}</td>
                  <td className="px-4 py-3.5 text-center text-[0.875rem] font-semibold" style={{ color: 'var(--foreground)' }}>{sale.items.length}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium" style={{
                      background: sale.paymentMethod === 'cash' ? '#dcfce7' : sale.paymentMethod === 'card' ? '#dbeafe' : '#fef3c7',
                      color: sale.paymentMethod === 'cash' ? '#15803d' : sale.paymentMethod === 'card' ? '#1d4ed8' : '#92400e',
                    }}>
                      {sale.paymentMethod === 'cash' ? 'ნაღდი' : sale.paymentMethod === 'card' ? 'ბარათი' : 'გადარიცხვა'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-[0.9375rem] font-semibold" style={{ color: sale.isReturn ? '#dc2626' : 'var(--foreground)' }}>
                    {sale.isReturn ? '-' : ''}{formatCurrency(Math.abs(sale.total))}
                  </td>
                  <td className="px-4 py-3.5 text-[0.8125rem] font-mono" style={{ color: 'var(--muted-foreground)' }}>{formatDate(sale.createdAt)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => setViewSale(sale)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ color: 'var(--muted-foreground)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!sale.isReturn && (
                        <button
                          onClick={() => {
                            setReturnSale(sale)
                            setReturnItems(sale.items.map(item => ({ item, selected: false, returnQty: item.quantity })))
                            setReturnReason('')
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color: '#d97706' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fef3c7' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                          title="დაბრუნება"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Detail Modal */}
      {viewSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-[520px] max-h-[85vh] overflow-y-auto rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{viewSale.receiptNumber}</h2>
                <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{formatDate(viewSale.createdAt)} - {viewSale.createdBy}</p>
              </div>
              <button onClick={() => setViewSale(null)} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 space-y-4">
              {viewSale.customerName && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--secondary)' }}>
                  <span className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'კლიენტი:'}</span>
                  <span className="text-[0.875rem] font-semibold" style={{ color: 'var(--foreground)' }}>{viewSale.customerName}</span>
                </div>
              )}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: 'var(--secondary)' }}>
                      <th className="px-4 py-2 text-left text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'პროდუქტი'}</th>
                      <th className="px-4 py-2 text-center text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'რაოდ.'}</th>
                      <th className="px-4 py-2 text-right text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'ფასი'}</th>
                      <th className="px-4 py-2 text-right text-[0.75rem] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{'ჯამი'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewSale.items.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="px-4 py-2.5 text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{item.name}</td>
                        <td className="px-4 py-2.5 text-center text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{formatCurrency(item.price)}</td>
                        <td className="px-4 py-2.5 text-right text-[0.875rem] font-semibold" style={{ color: 'var(--foreground)' }}>{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-1.5 px-1">
                <div className="flex justify-between text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>
                  <span>{'ჯამი'}</span><span>{formatCurrency(viewSale.subtotal)}</span>
                </div>
                {viewSale.discount > 0 && (
                  <div className="flex justify-between text-[0.875rem]" style={{ color: '#16a34a' }}>
                    <span>{'ფასდაკლება'}</span><span>-{formatCurrency(viewSale.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>
                  <span>{'დღგ'}</span><span>{formatCurrency(viewSale.vatAmount)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <span className="text-[1rem] font-bold" style={{ color: 'var(--foreground)' }}>{'სულ'}</span>
                  <span className="text-[1.5rem] font-extrabold" style={{ color: 'var(--primary)' }}>{formatCurrency(viewSale.total)}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <button onClick={() => setViewSale(null)} className="w-full py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}>{'დახურვა'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {returnSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-[520px] max-h-[85vh] overflow-y-auto rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-[1.125rem] font-bold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <RotateCcw className="w-5 h-5" style={{ color: '#d97706' }} />
                  {'გაყიდვის დაბრუნება'}
                </h2>
                <p className="text-[0.875rem] mt-0.5 font-mono" style={{ color: 'var(--muted-foreground)' }}>{'ჩეკი:'} {returnSale.receiptNumber}</p>
              </div>
              <button onClick={() => setReturnSale(null)} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
            </div>
            
            <div className="px-6 space-y-4">
              <p className="text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{'რომელი პროდუქტ(ებ)ი ბრუნდება?'}</p>
              
              {/* Items Selection */}
              <div className="space-y-2">
                {returnItems.map((ri, idx) => (
                  <div 
                    key={ri.item.id} 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer"
                    style={{ 
                      background: ri.selected ? '#fef3c7' : 'var(--secondary)',
                      border: ri.selected ? '1.5px solid #fbbf24' : '1.5px solid var(--border)'
                    }}
                    onClick={() => {
                      const newItems = [...returnItems]
                      newItems[idx].selected = !newItems[idx].selected
                      setReturnItems(newItems)
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={ri.selected} 
                      onChange={() => {}}
                      className="w-4 h-4 rounded accent-amber-500"
                    />
                    <div className="flex-1">
                      <div className="text-[0.875rem] font-medium" style={{ color: 'var(--foreground)' }}>{ri.item.name}</div>
                      <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{formatCurrency(ri.item.price)} x {ri.item.quantity}</div>
                    </div>
                    {ri.selected && (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{'რაოდ.:'}</span>
                        <select 
                          value={ri.returnQty}
                          onChange={(e) => {
                            const newItems = [...returnItems]
                            newItems[idx].returnQty = parseInt(e.target.value)
                            setReturnItems(newItems)
                          }}
                          className="px-2 py-1 rounded text-[0.8125rem]"
                          style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                        >
                          {Array.from({ length: ri.item.quantity }, (_, i) => i + 1).map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <span className="text-[0.9375rem] font-semibold" style={{ color: ri.selected ? '#d97706' : 'var(--foreground)' }}>
                      {formatCurrency(ri.selected ? ri.item.price * ri.returnQty : ri.item.total)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Return Total */}
              {returnItems.some(ri => ri.selected) && (
                <div className="flex justify-between items-baseline px-3 py-2 rounded-lg" style={{ background: '#fef3c7', border: '1px solid #fbbf24' }}>
                  <span className="text-[0.875rem] font-medium" style={{ color: '#92400e' }}>{'დასაბრუნებელი:'}</span>
                  <span className="text-[1.25rem] font-bold" style={{ color: '#d97706' }}>
                    {formatCurrency(returnItems.filter(ri => ri.selected).reduce((sum, ri) => sum + ri.item.price * ri.returnQty, 0))}
                  </span>
                </div>
              )}

              {/* Reason */}
              <div className="space-y-1.5">
                <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მიზეზი (არასავალდებულო)'}</label>
                <input
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="დაზიანებული პროდუქტი, არასწორი შეკვეთა..."
                  className="w-full px-3.5 py-2.5 rounded-lg text-[0.875rem] outline-none"
                  style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-5">
              <button 
                onClick={() => setReturnSale(null)} 
                className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium"
                style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}
              >
                {'გაუქმება'}
              </button>
              <button
                onClick={() => {
                  const selectedItems = returnItems.filter(ri => ri.selected)
                  if (selectedItems.length === 0) return

                  const returnTotal = selectedItems.reduce((sum, ri) => sum + ri.item.price * ri.returnQty, 0)
                  const returnVat = returnTotal * 0.18

                  const newReturnSale: Sale = {
                    id: `return-${Date.now()}`,
                    receiptNumber: `RT-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
                    isReturn: true,
                    returnOf: returnSale.id,
                    total: -returnTotal,
                    subtotal: -returnTotal,
                    vatAmount: -returnVat,
                    discount: 0,
                    items: selectedItems.map(ri => ({
                      ...ri.item,
                      id: `ret-${ri.item.id}`,
                      quantity: -ri.returnQty,
                      total: -(ri.item.price * ri.returnQty)
                    })),
                    paymentMethod: returnSale.paymentMethod,
                    createdAt: new Date().toISOString(),
                    createdBy: 'მოლარე'
                  }

                  setSalesList(prev => [newReturnSale, ...prev])
                  setShowReturnReceipt(newReturnSale)
                  setReturnSale(null)
                }}
                disabled={!returnItems.some(ri => ri.selected)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[0.875rem] font-medium disabled:opacity-50"
                style={{ background: '#d97706', color: 'white', border: '1.5px solid #b45309' }}
              >
                <RotateCcw className="w-4 h-4" />
                {'დაბრუნების დამუშავება'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Receipt Modal */}
      {showReturnReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-[380px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
            <div className="flex flex-col items-center py-8 px-6 text-center" data-print-receipt>
              <div className="text-[1.25rem] font-bold mb-1" style={{ color: 'var(--foreground)' }}>JabsOn PRO</div>
              <div className="text-[0.8125rem] mb-4" style={{ color: 'var(--muted-foreground)' }}>{'შპს "ჯაბსონი"'}</div>
              
              <div className="w-full border-t border-dashed my-2" style={{ borderColor: 'var(--border)' }} />
              
              <div className="flex items-center gap-2 mb-2">
                <RotateCcw className="w-5 h-5" style={{ color: '#d97706' }} />
                <span className="text-[1rem] font-bold uppercase" style={{ color: '#d97706' }}>{'დაბრუნების ქვითარი'}</span>
              </div>
              
              <div className="w-full border-t border-dashed my-2" style={{ borderColor: 'var(--border)' }} />
              
              <div className="w-full text-left space-y-1 mb-3">
                <div className="flex justify-between text-[0.8125rem]">
                  <span style={{ color: 'var(--muted-foreground)' }}>{'ნომ.:'}</span>
                  <span className="font-mono font-medium" style={{ color: 'var(--foreground)' }}>{showReturnReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between text-[0.8125rem]">
                  <span style={{ color: 'var(--muted-foreground)' }}>{'თარიღი:'}</span>
                  <span style={{ color: 'var(--foreground)' }}>{formatDate(showReturnReceipt.createdAt)}</span>
                </div>
                {showReturnReceipt.returnOf && (
                  <div className="flex justify-between text-[0.8125rem]">
                    <span style={{ color: 'var(--muted-foreground)' }}>{'ორიგ. ჩეკი:'}</span>
                    <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                      {salesList.find(s => s.id === showReturnReceipt.returnOf)?.receiptNumber || '-'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="w-full border-t border-dashed my-2" style={{ borderColor: 'var(--border)' }} />
              
              <div className="w-full space-y-2 mb-3">
                {showReturnReceipt.items.map(item => (
                  <div key={item.id} className="flex justify-between text-[0.875rem]">
                    <span style={{ color: 'var(--foreground)' }}>{item.name} x{Math.abs(item.quantity)}</span>
                    <span className="font-semibold" style={{ color: '#dc2626' }}>{formatCurrency(Math.abs(item.total))}</span>
                  </div>
                ))}
              </div>
              
              <div className="w-full border-t border-dashed my-2" style={{ borderColor: 'var(--border)' }} />
              
              <div className="flex justify-between w-full items-baseline">
                <span className="text-[1rem] font-bold" style={{ color: 'var(--foreground)' }}>{'დაბრუნება:'}</span>
                <span className="text-[1.5rem] font-extrabold" style={{ color: '#dc2626' }}>-{formatCurrency(Math.abs(showReturnReceipt.total))}</span>
              </div>
              
              <div className="w-full border-t border-dashed my-4" style={{ borderColor: 'var(--border)' }} />
              
              <p className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{'გმადლობთ!'}</p>
              
              <div className="flex gap-3 mt-6 w-full">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}>
                  <Printer className="w-4 h-4" />
                  {'ბეჭდვა'}
                </button>
                <button 
                  onClick={() => setShowReturnReceipt(null)} 
                  className="flex-1 px-4 py-2.5 rounded-lg text-[0.875rem] font-medium" 
                  style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d' }}
                >
                  {'დახურვა'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
