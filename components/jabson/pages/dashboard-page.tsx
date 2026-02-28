'use client'

import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, BarChart3, Receipt } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'
import { dailyStats, weeklySalesData, monthlySalesData, topProducts, paymentBreakdown, formatCurrency, sales } from '@/lib/demo-data'

const statCards = [
  {
    label: "დღის გაყიდვები",
    value: dailyStats.todaySales,
    change: dailyStats.todaySalesChange,
    color: '#16a34a',
    gradient: 'linear-gradient(90deg, #16a34a, #4ade80)',
    icon: DollarSign,
  },
  {
    label: "შეკვეთები",
    value: dailyStats.todayOrders,
    change: dailyStats.todayOrdersChange,
    isCurrency: false,
    color: '#3b82f6',
    gradient: 'linear-gradient(90deg, #3b82f6, #93c5fd)',
    icon: ShoppingBag,
  },
  {
    label: "მოგება",
    value: dailyStats.todayProfit,
    change: dailyStats.todayProfitChange,
    color: '#8b5cf6',
    gradient: 'linear-gradient(90deg, #8b5cf6, #c4b5fd)',
    icon: BarChart3,
  },
  {
    label: "საშუალო ჩეკი",
    value: dailyStats.avgCheck,
    change: dailyStats.avgCheckChange,
    color: '#f59e0b',
    gradient: 'linear-gradient(90deg, #f59e0b, #fde68a)',
    icon: Receipt,
  },
]

const PIE_COLORS = ['#16a34a', '#3b82f6', '#f59e0b']

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'დაფა'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {'მთავარი მაღაზია — 1 მარტი, 2026'}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 rounded-lg text-[0.875rem] font-medium"
            style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
            defaultValue="today"
          >
            <option value="today">{'დღეს'}</option>
            <option value="week">{'კვირა'}</option>
            <option value="month">{'თვე'}</option>
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const isUp = stat.change > 0
          return (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-xl p-5 transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 2px 0 rgb(0 0 0/0.05)' }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
                style={{ background: stat.gradient }}
              />
              <div className="flex items-center justify-between mb-3">
                <span className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15`, color: stat.color }}>
                  <Icon className="w-[18px] h-[18px]" />
                </div>
              </div>
              <div className="text-[1.75rem] font-bold leading-none" style={{ color: 'var(--foreground)' }}>
                {stat.isCurrency === false ? stat.value : formatCurrency(stat.value)}
              </div>
              <div className="flex items-center gap-1 mt-2 text-[0.75rem]" style={{ color: isUp ? '#16a34a' : '#dc2626' }}>
                {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span className="font-medium">{Math.abs(stat.change)}%</span>
                <span style={{ color: 'var(--muted-foreground)' }}>{'გუშინთან'}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Sales Chart */}
        <div
          className="lg:col-span-2 rounded-xl overflow-hidden"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'კვირის გაყიდვები'}</span>
          </div>
          <div className="p-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    fontSize: 13,
                    color: 'var(--foreground)',
                  }}
                  formatter={(value: number) => [`${value} ₾`, 'გაყიდვები']}
                />
                <Bar dataKey="sales" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'გადახდის მეთოდები'}</span>
          </div>
          <div className="p-5 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentBreakdown}
                  dataKey="value"
                  nameKey="method"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {paymentBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    fontSize: 13,
                    color: 'var(--foreground)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="px-5 pb-4 space-y-2">
            {paymentBreakdown.map((p, i) => (
              <div key={p.method} className="flex items-center gap-2 text-[0.8125rem]">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                <span style={{ color: 'var(--foreground)' }}>{p.method}</span>
                <span className="ml-auto font-medium" style={{ color: 'var(--muted-foreground)' }}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Trend */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'6 თვის ტრენდი'}</span>
          </div>
          <div className="p-5 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    fontSize: 13,
                    color: 'var(--foreground)',
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#16a34a" fill="#16a34a" fillOpacity={0.1} name="გაყიდვები" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="#ef4444" fillOpacity={0.05} name="ხარჯები" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'ტოპ პროდუქტები'}</span>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3 px-5 py-3.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[0.75rem] font-bold"
                  style={{ background: i < 3 ? '#16a34a' : 'var(--secondary)', color: i < 3 ? 'white' : 'var(--muted-foreground)' }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.875rem] font-medium truncate" style={{ color: 'var(--foreground)' }}>{product.name}</div>
                  <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{product.quantity} {'გაყიდული'}</div>
                </div>
                <span className="text-[0.875rem] font-semibold" style={{ color: 'var(--primary)' }}>{formatCurrency(product.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'ბოლო გაყიდვები'}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--secondary)' }}>
                <th className="px-5 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ჩეკი'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'კლიენტი'}</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'მეთოდი'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'თანხა'}</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 5).map((sale) => (
                <tr key={sale.id} className="transition-colors hover:bg-[var(--secondary)]">
                  <td className="px-5 py-3 text-[0.875rem] font-mono font-medium" style={{ color: 'var(--foreground)' }}>{sale.receiptNumber}</td>
                  <td className="px-4 py-3 text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{sale.customerName || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium"
                      style={{
                        background: sale.paymentMethod === 'cash' ? '#dcfce7' : sale.paymentMethod === 'card' ? '#dbeafe' : '#fef3c7',
                        color: sale.paymentMethod === 'cash' ? '#15803d' : sale.paymentMethod === 'card' ? '#1d4ed8' : '#92400e',
                      }}
                    >
                      {sale.paymentMethod === 'cash' ? 'ნაღდი' : sale.paymentMethod === 'card' ? 'ბარათი' : 'გადარიცხვა'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{formatCurrency(sale.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
