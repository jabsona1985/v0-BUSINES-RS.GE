'use client'

import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, DollarSign, PiggyBank, Download, X, ArrowUp, ArrowDown, FileText, Info } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { demoTransactions, incomeCategories, expenseCategories, formatCurrency, sales as demoSales, demoPurchaseOrders, type Transaction } from '@/lib/demo-data'
import { exportTransactionsToExcel, exportVATReportToExcel } from '@/lib/excel'

const tabs = [
  { id: 'history', label: 'ისტორია' },
  { id: 'income', label: 'შემოსავალი' },
  { id: 'expenses', label: 'ხარჯები' },
  { id: 'report', label: 'ანგარიში' },
  { id: 'vat', label: 'დღგ' },
]

const PIE_COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444']

export function AccountingPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions)
  const [activeTab, setActiveTab] = useState('history')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [vatMonth, setVatMonth] = useState('იანვარი 2024')

  // VAT calculations
  const salesVAT = demoSales.filter(s => !s.isReturn).map(s => ({
    date: s.createdAt,
    receiptNumber: s.receiptNumber,
    base: s.subtotal / 1.18,
    vatAmount: s.vatAmount,
    total: s.total,
  }))
  const totalSalesVAT = salesVAT.reduce((sum, r) => sum + r.vatAmount, 0)

  const purchasesVAT = demoPurchaseOrders.filter(p => p.status === 'received').map(p => ({
    date: p.createdAt,
    orderNumber: p.orderNumber,
    base: p.total / 1.18,
    vatAmount: p.total - (p.total / 1.18),
    total: p.total,
  }))
  const totalPurchasesVAT = purchasesVAT.reduce((sum, r) => sum + r.vatAmount, 0)
  const vatPayable = totalSalesVAT - totalPurchasesVAT

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const profit = totalIncome - totalExpense
  const balance = profit

  const filtered = transactions.filter(t => typeFilter === 'all' || t.type === typeFilter)

  // Income by category for chart
  const incomeByCategory = incomeCategories.map(cat => ({
    name: cat,
    value: transactions.filter(t => t.type === 'income' && t.category === cat).reduce((sum, t) => sum + t.amount, 0)
  })).filter(c => c.value > 0)

  // Expense by category for chart
  const expenseByCategory = expenseCategories.map(cat => ({
    name: cat,
    value: transactions.filter(t => t.type === 'expense' && t.category === cat).reduce((sum, t) => sum + t.amount, 0)
  })).filter(c => c.value > 0)

  // Monthly data for bar chart
  const monthlyIncomeData = [
    { month: 'ოქტ', income: 18500 },
    { month: 'ნოე', income: 21300 },
    { month: 'დეკ', income: 19800 },
    { month: 'იან', income: totalIncome },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ბუღალტერია'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {'ფინანსური მართვა და ანგარიშგება'}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium transition-all"
          style={{ background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}
        >
          <Plus className="w-4 h-4" />
          {'ტრანზაქცია'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#16a34a15', color: '#16a34a' }}>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'შემოსავალი (ამ თვე)'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#16a34a' }}>{formatCurrency(totalIncome)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#ef444415', color: '#ef4444' }}>
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ხარჯი (ამ თვე)'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#ef4444' }}>{formatCurrency(totalExpense)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: profit >= 0 ? '#16a34a15' : '#ef444415', color: profit >= 0 ? '#16a34a' : '#ef4444' }}>
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მოგება'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: profit >= 0 ? '#16a34a' : '#ef4444' }}>{formatCurrency(profit)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[0.75rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ბალანსი'}</div>
            <div className="text-[1.25rem] font-bold" style={{ color: '#3b82f6' }}>{formatCurrency(balance)}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--secondary)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2 rounded-lg text-[0.875rem] font-medium transition-all"
            style={{
              background: activeTab === tab.id ? 'var(--card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow: activeTab === tab.id ? '0 1px 2px rgb(0 0 0/0.05)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-[0.875rem] cursor-pointer"
              style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
            >
              <option value="all">{'ყველა'}</option>
              <option value="income">{'შემოსავალი'}</option>
              <option value="expense">{'ხარჯი'}</option>
            </select>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--secondary)' }}>
                  <th className="px-5 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'თარიღი'}</th>
                  <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ტიპი'}</th>
                  <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'კატეგორია'}</th>
                  <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'აღწერა'}</th>
                  <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'რეფ.'}</th>
                  <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'თანხა'}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <td className="px-5 py-3.5 text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{t.createdAt}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.75rem] font-medium" style={{ background: t.type === 'income' ? '#dcfce7' : '#fee2e2', color: t.type === 'income' ? '#15803d' : '#dc2626' }}>
                        {t.type === 'income' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {t.type === 'income' ? 'შემოსავალი' : 'ხარჯი'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{t.category}</td>
                    <td className="px-4 py-3.5 text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{t.description}</td>
                    <td className="px-4 py-3.5 text-[0.8125rem] font-mono" style={{ color: 'var(--muted-foreground)' }}>{t.reference || '---'}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-[0.9375rem] font-semibold" style={{ color: t.type === 'income' ? '#16a34a' : '#ef4444' }}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'income' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'თვიური შემოსავალი'}</span>
            </div>
            <div className="p-5 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyIncomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--foreground)' }} formatter={(value: number) => [`${value} ₾`, 'შემოსავალი']} />
                  <Bar dataKey="income" fill="#16a34a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-[0.9375rem] font-semibold mb-4" style={{ color: 'var(--foreground)' }}>{'კატეგორიების მიხედვით'}</div>
            <div className="space-y-3">
              {incomeByCategory.map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{cat.name}</span>
                  </div>
                  <span className="text-[0.875rem] font-semibold" style={{ color: '#16a34a' }}>{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'ხარჯების განაწილება'}</span>
            </div>
            <div className="p-5 h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {expenseByCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--foreground)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-[0.9375rem] font-semibold mb-4" style={{ color: 'var(--foreground)' }}>{'კატეგორიების მიხედვით'}</div>
            <div className="space-y-3">
              {expenseByCategory.map((cat, i) => {
                const pct = ((cat.value / totalExpense) * 100).toFixed(1)
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{cat.name}</span>
                      </div>
                      <span className="text-[0.875rem] font-semibold" style={{ color: '#ef4444' }}>{formatCurrency(cat.value)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--secondary)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      </div>
                      <span className="text-[0.75rem] w-10 text-right" style={{ color: 'var(--muted-foreground)' }}>{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-[1rem] font-bold mb-4" style={{ color: 'var(--foreground)' }}>{'P&L - იანვარი 2024'}</div>
            <div className="space-y-3">
              <div className="text-[0.9375rem] font-semibold" style={{ color: '#16a34a' }}>{'შემოსავალი'}</div>
              {incomeByCategory.map(cat => (
                <div key={cat.name} className="flex justify-between text-[0.875rem] pl-4">
                  <span style={{ color: 'var(--muted-foreground)' }}>{cat.name}</span>
                  <span style={{ color: 'var(--foreground)' }}>{formatCurrency(cat.value)}</span>
                </div>
              ))}
              <div className="flex justify-between text-[0.9375rem] font-medium pt-1" style={{ borderTop: '1px dashed var(--border)' }}>
                <span style={{ color: 'var(--foreground)' }}>{'სულ შემოსავალი'}</span>
                <span style={{ color: '#16a34a' }}>{formatCurrency(totalIncome)}</span>
              </div>
            </div>
            <div className="space-y-3 mt-6">
              <div className="text-[0.9375rem] font-semibold" style={{ color: '#ef4444' }}>{'ხარჯები'}</div>
              {expenseByCategory.map(cat => (
                <div key={cat.name} className="flex justify-between text-[0.875rem] pl-4">
                  <span style={{ color: 'var(--muted-foreground)' }}>{cat.name}</span>
                  <span style={{ color: 'var(--foreground)' }}>-{formatCurrency(cat.value)}</span>
                </div>
              ))}
              <div className="flex justify-between text-[0.9375rem] font-medium pt-1" style={{ borderTop: '1px dashed var(--border)' }}>
                <span style={{ color: 'var(--foreground)' }}>{'სულ ხარჯები'}</span>
                <span style={{ color: '#ef4444' }}>-{formatCurrency(totalExpense)}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 space-y-2" style={{ borderTop: '2px solid var(--border)' }}>
              <div className="flex justify-between text-[1.125rem] font-bold">
                <span style={{ color: 'var(--foreground)' }}>{'წმ. მოგება'}</span>
                <span style={{ color: profit >= 0 ? '#16a34a' : '#ef4444' }}>{formatCurrency(profit)}</span>
              </div>
              <div className="flex justify-between text-[0.875rem]">
                <span style={{ color: 'var(--muted-foreground)' }}>{'მარჟა'}</span>
                <span style={{ color: 'var(--foreground)' }}>{totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(0) : 0}%</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => exportTransactionsToExcel(transactions)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-[0.9375rem] font-medium" 
              style={{ background: '#16a34a', color: 'white' }}
            >
              <Download className="w-5 h-5" />
              {'Excel ჩამოტვირთვა'}
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-[0.9375rem] font-medium" style={{ background: 'var(--card)', color: 'var(--foreground)', border: '1.5px solid var(--border)' }}>
              <Download className="w-5 h-5" />
              {'PDF ჩამოტვირთვა'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'vat' && (
        <div className="space-y-4">
          {/* VAT Header */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" style={{ color: '#16a34a' }} />
              <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'დღგ-ს ანგარიში'}</span>
            </div>
            <select
              value={vatMonth}
              onChange={(e) => setVatMonth(e.target.value)}
              className="px-3 py-2 rounded-lg text-[0.875rem]"
              style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
            >
              <option>{'იანვარი 2024'}</option>
              <option>{'დეკემბერი 2023'}</option>
              <option>{'ნოემბერი 2023'}</option>
            </select>
          </div>

          {/* VAT Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: '#dcfce7', border: '1px solid #bbf7d0' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#16a34a', color: 'white' }}>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[0.75rem] font-medium" style={{ color: '#15803d' }}>{'გაყიდვ. დღგ'}</div>
                <div className="text-[1.25rem] font-bold" style={{ color: '#16a34a' }}>+{formatCurrency(totalSalesVAT)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: '#fee2e2', border: '1px solid #fecaca' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#dc2626', color: 'white' }}>
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[0.75rem] font-medium" style={{ color: '#dc2626' }}>{'შეძ. დღგ'}</div>
                <div className="text-[1.25rem] font-bold" style={{ color: '#dc2626' }}>-{formatCurrency(totalPurchasesVAT)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#d97706', color: 'white' }}>
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[0.75rem] font-medium" style={{ color: '#92400e' }}>{'გადასახ.'}</div>
                <div className="text-[1.25rem] font-bold" style={{ color: '#d97706' }}>{formatCurrency(vatPayable)}</div>
              </div>
            </div>
          </div>

          {/* Sales VAT Table */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'გაყიდვებიდან დღგ'}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--secondary)' }}>
                    <th className="px-4 py-2 text-left text-[0.75rem] font-semibold uppercase" style={{ color: 'var(--muted-foreground)' }}>{'თარიღი'}</th>
                    <th className="px-4 py-2 text-left text-[0.75rem] font-semibold uppercase" style={{ color: 'var(--muted-foreground)' }}>{'ჩეკი'}</th>
                    <th className="px-4 py-2 text-right text-[0.75rem] font-semibold uppercase" style={{ color: 'var(--muted-foreground)' }}>{'ბაზა'}</th>
                    <th className="px-4 py-2 text-right text-[0.75rem] font-semibold uppercase" style={{ color: 'var(--muted-foreground)' }}>{'დღგ 18%'}</th>
                    <th className="px-4 py-2 text-right text-[0.75rem] font-semibold uppercase" style={{ color: 'var(--muted-foreground)' }}>{'ჯამი'}</th>
                  </tr>
                </thead>
                <tbody>
                  {salesVAT.slice(0, 5).map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="px-4 py-2.5 text-[0.8125rem]" style={{ color: 'var(--foreground)' }}>{r.date}</td>
                      <td className="px-4 py-2.5 text-[0.8125rem] font-mono" style={{ color: 'var(--foreground)' }}>{r.receiptNumber}</td>
                      <td className="px-4 py-2.5 text-right text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{formatCurrency(r.base)}</td>
                      <td className="px-4 py-2.5 text-right text-[0.8125rem] font-semibold" style={{ color: '#16a34a' }}>{formatCurrency(r.vatAmount)}</td>
                      <td className="px-4 py-2.5 text-right text-[0.8125rem]" style={{ color: 'var(--foreground)' }}>{formatCurrency(r.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--secondary)' }}>
                    <td colSpan={3} className="px-4 py-2.5 text-right text-[0.8125rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'სულ:'}</td>
                    <td className="px-4 py-2.5 text-right text-[0.9375rem] font-bold" style={{ color: '#16a34a' }}>{formatCurrency(totalSalesVAT)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Purchases VAT Table */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'შეძენებიდან დღგ'}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--secondary)' }}>
                    <th className="px-4 py-2 text-left text-[0.75rem] font-semibold uppercase" style={{ color: 'var(--muted-foreground)' }}>{'თარიღი'}</th>
                    <th className="px-4 py-2 text-left text-[0.75rem] font-semibold uppercase" style={{ color: 'var(--muted-foreground)' }}>{'PO ნომ.'}</th>
                    <th className="px-4 py-2 text-right text-[0.75rem] font-semibold uppercase" style={{ color: 'var(--muted-foreground)' }}>{'ბაზა'}</th>
                    <th className="px-4 py-2 text-right text-[0.75rem] font-semibold uppercase" style={{ color: 'var(--muted-foreground)' }}>{'დღგ 18%'}</th>
                    <th className="px-4 py-2 text-right text-[0.75rem] font-semibold uppercase" style={{ color: 'var(--muted-foreground)' }}>{'ჯამი'}</th>
                  </tr>
                </thead>
                <tbody>
                  {purchasesVAT.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="px-4 py-2.5 text-[0.8125rem]" style={{ color: 'var(--foreground)' }}>{r.date}</td>
                      <td className="px-4 py-2.5 text-[0.8125rem] font-mono" style={{ color: 'var(--foreground)' }}>{r.orderNumber}</td>
                      <td className="px-4 py-2.5 text-right text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{formatCurrency(r.base)}</td>
                      <td className="px-4 py-2.5 text-right text-[0.8125rem] font-semibold" style={{ color: '#dc2626' }}>{formatCurrency(r.vatAmount)}</td>
                      <td className="px-4 py-2.5 text-right text-[0.8125rem]" style={{ color: 'var(--foreground)' }}>{formatCurrency(r.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--secondary)' }}>
                    <td colSpan={3} className="px-4 py-2.5 text-right text-[0.8125rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'სულ:'}</td>
                    <td className="px-4 py-2.5 text-right text-[0.9375rem] font-bold" style={{ color: '#dc2626' }}>{formatCurrency(totalPurchasesVAT)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: '#dbeafe', border: '1px solid #bfdbfe' }}>
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#2563eb' }} />
            <div className="text-[0.8125rem]" style={{ color: '#1e40af' }}>
              {'ეს ანგარიში საინფორმაციოა. დეკლარაცია rs.ge-ზე ხელით შეიტანება.'}
            </div>
          </div>

          {/* Export Button */}
          <button 
            onClick={() => exportVATReportToExcel(salesVAT, purchasesVAT, vatMonth)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[0.9375rem] font-medium" 
            style={{ background: '#16a34a', color: 'white' }}
          >
            <Download className="w-5 h-5" />
            {'Excel-ში ექსპორტი'}
          </button>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <TransactionModal
          onClose={() => setShowAddModal(false)}
          onSave={(t) => { setTransactions([t, ...transactions]); setShowAddModal(false) }}
        />
      )}
    </div>
  )
}

function TransactionModal({ onClose, onSave }: { onClose: () => void; onSave: (t: Transaction) => void }) {
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const categories = type === 'income' ? incomeCategories : expenseCategories

  const handleSave = () => {
    const newTransaction: Transaction = {
      id: `tr-${Date.now()}`,
      type,
      amount: Number(amount),
      category: category || categories[0],
      description,
      createdAt: date,
    }
    onSave(newTransaction)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-[420px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ახალი ტრანზაქცია'}</h2>
          <button onClick={onClose} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 space-y-4">
          {/* Type Toggle */}
          <div className="flex rounded-lg p-1" style={{ background: 'var(--secondary)' }}>
            <button
              onClick={() => { setType('income'); setCategory('') }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[0.8125rem] font-medium transition-all"
              style={{ background: type === 'income' ? 'var(--card)' : 'transparent', color: type === 'income' ? '#16a34a' : 'var(--muted-foreground)' }}
            >
              <ArrowUp className="w-4 h-4" />
              {'შემოსავალი'}
            </button>
            <button
              onClick={() => { setType('expense'); setCategory('') }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[0.8125rem] font-medium transition-all"
              style={{ background: type === 'expense' ? 'var(--card)' : 'transparent', color: type === 'expense' ? '#ef4444' : 'var(--muted-foreground)' }}
            >
              <ArrowDown className="w-4 h-4" />
              {'ხარჯი'}
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'თანხა'}</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-8 rounded-lg text-[0.9375rem]"
                style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{'₾'}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'კატეგორია'}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
            >
              <option value="">{'აირჩიეთ კატეგორია'}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'აღწერა'}</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              placeholder="აღწერა"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'თარიღი'}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>
        </div>
        <div className="flex gap-2 px-6 py-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
            {'გაუქმება'}
          </button>
          <button
            onClick={handleSave}
            disabled={!amount || !category}
            className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium disabled:opacity-50"
            style={{ background: type === 'income' ? '#16a34a' : '#ef4444', color: 'white' }}
          >
            {'შენახვა'}
          </button>
        </div>
      </div>
    </div>
  )
}
