'use client'

import { BarChart3, TrendingUp, Package, Users, Download, FileText, Calendar, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { monthlySalesData, topProducts, paymentBreakdown, formatCurrency } from '@/lib/demo-data'

const categoryData = [
  { name: 'სასმელი', revenue: 12400, items: 680 },
  { name: 'საკვები', revenue: 8600, items: 420 },
  { name: 'რძის პროდუქტი', revenue: 5800, items: 210 },
  { name: 'ტკბილეული', revenue: 4200, items: 340 },
  { name: 'ჰიგიენა', revenue: 2100, items: 95 },
  { name: 'საყოფაცხოვრებო', revenue: 1800, items: 42 },
]

const CAT_COLORS = ['#3b82f6', '#f59e0b', '#22c55e', '#ec4899', '#8b5cf6', '#06b6d4']

const profitData = [
  { month: 'სექ', revenue: 18500, cost: 14200, profit: 4300 },
  { month: 'ოქტ', revenue: 21300, cost: 15800, profit: 5500 },
  { month: 'ნოე', revenue: 19800, cost: 14500, profit: 5300 },
  { month: 'დეკ', revenue: 28500, cost: 19200, profit: 9300 },
  { month: 'იან', revenue: 22100, cost: 16300, profit: 5800 },
  { month: 'თებ', revenue: 24800, cost: 17100, profit: 7700 },
]

const reports = [
  { icon: DollarSign, title: 'გაყიდვების ანგარიში', desc: 'დეტალური გაყიდვების სტატისტიკა პერიოდების მიხედვით', color: '#16a34a' },
  { icon: Package, title: 'მარაგის ანგარიში', desc: 'მარაგის მდგომარეობა და ინვენტარიზაციის ისტორია', color: '#3b82f6' },
  { icon: Users, title: 'კლიენტების ანგარიში', desc: 'კლიენტების აქტივობა და ლოიალობის სტატისტიკა', color: '#8b5cf6' },
  { icon: FileText, title: 'rs.ge ანგარიში', desc: 'ზედნადებები და ანგარიშ-ფაქტურების ისტორია', color: '#f59e0b' },
]

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'ანგარიშები'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {'ბიზნეს ანალიტიკა და დეტალური ანგარიშები'}
          </p>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[0.8125rem] font-medium" style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}>
          <Download className="w-4 h-4" />{'PDF ექსპორტი'}
        </button>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((r) => {
          const Icon = r.icon
          return (
            <button key={r.title} className="rounded-xl p-5 text-left transition-all hover:-translate-y-0.5" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 2px 0 rgb(0 0 0/0.05)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${r.color}15`, color: r.color }}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{r.title}</div>
              <div className="text-[0.8125rem] mt-1" style={{ color: 'var(--muted-foreground)' }}>{r.desc}</div>
            </button>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue vs Cost vs Profit */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'შემოსავალი / ხარჯი / მოგება'}</span>
          </div>
          <div className="p-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--foreground)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} name="შემოსავალი" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} name="ხარჯი" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="მოგება" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Revenue */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'კატეგორიების შემოსავალი'}</span>
          </div>
          <div className="p-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} width={100} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--foreground)' }} formatter={(value: number) => [`${value} ₾`, 'შემოსავალი']} />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                  {categoryData.map((_, i) => <Cell key={i} fill={CAT_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'ტოპ 5 პროდუქტი (თვე)'}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--secondary)' }}>
                <th className="px-5 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>#</th>
                <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'პროდუქტი'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'რაოდენობა'}</th>
                <th className="px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'შემოსავალი'}</th>
                <th className="px-5 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'წილი'}</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => {
                const total = topProducts.reduce((sum, x) => sum + x.revenue, 0)
                const pct = ((p.revenue / total) * 100).toFixed(1)
                return (
                  <tr key={p.name} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-5 py-3.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[0.75rem] font-bold" style={{ background: i < 3 ? '#16a34a' : 'var(--secondary)', color: i < 3 ? 'white' : 'var(--muted-foreground)' }}>
                        {i + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[0.875rem] font-medium" style={{ color: 'var(--foreground)' }}>{p.name}</td>
                    <td className="px-4 py-3.5 text-right text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{p.quantity}</td>
                    <td className="px-4 py-3.5 text-right text-[0.9375rem] font-semibold" style={{ color: 'var(--primary)' }}>{formatCurrency(p.revenue)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: 'var(--secondary)' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#16a34a' }} />
                        </div>
                        <span className="text-[0.8125rem] font-medium w-10 text-right" style={{ color: 'var(--muted-foreground)' }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
