'use client'

import { useState } from 'react'
import { Settings, Building2, Printer, CreditCard, Bell, Shield, Globe, Users, Check } from 'lucide-react'

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'general', label: 'ზოგადი', icon: Settings },
    { id: 'company', label: 'კომპანია', icon: Building2 },
    { id: 'pos', label: 'POS / ჩეკი', icon: Printer },
    { id: 'payment', label: 'გადახდა', icon: CreditCard },
    { id: 'notifications', label: 'შეტყობინებები', icon: Bell },
    { id: 'security', label: 'უსაფრთხოება', icon: Shield },
    { id: 'team', label: 'გუნდი', icon: Users },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'პარამეტრები'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {'სისტემის კონფიგურაცია და პერსონალიზაცია'}
          </p>
        </div>
        <button
          onClick={save}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium transition-all"
          style={saved ? { background: '#dcfce7', color: '#15803d', border: '1.5px solid #bbf7d0' } : { background: '#16a34a', color: 'white', border: '1.5px solid #15803d', boxShadow: '0 1px 3px rgb(22 163 74/0.3)' }}
        >
          {saved ? <><Check className="w-4 h-4" />{'შენახულია'}</> : 'შენახვა'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-[200px] flex-shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-[0.875rem] font-medium text-left transition-all"
                style={isActive
                  ? { background: 'var(--accent)', color: 'var(--primary)', fontWeight: 600 }
                  : { color: 'var(--muted-foreground)', background: 'transparent' }
                }
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Settings Content */}
        <div className="flex-1 rounded-xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-[1rem] font-semibold mb-4" style={{ color: 'var(--foreground)' }}>{'ზოგადი პარამეტრები'}</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ენა'}</label>
                    <select className="w-full max-w-[300px] px-3.5 py-2.5 rounded-lg text-[0.9375rem] cursor-pointer" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} defaultValue="ka">
                      <option value="ka">{'ქართული'}</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ვალუტა'}</label>
                    <select className="w-full max-w-[300px] px-3.5 py-2.5 rounded-lg text-[0.9375rem] cursor-pointer" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} defaultValue="gel">
                      <option value="gel">{'ლარი (₾)'}</option>
                      <option value="usd">USD ($)</option>
                      <option value="eur">EUR</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'დღგ-ს განაკვეთი'}</label>
                    <input type="number" defaultValue={18} className="w-full max-w-[300px] px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} />
                  </div>
                  <div className="flex items-center justify-between max-w-[400px] px-4 py-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
                    <div>
                      <div className="text-[0.875rem] font-medium" style={{ color: 'var(--foreground)' }}>{'დღგ-ს ავტომატური დარიცხვა'}</div>
                      <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{'ყველა პროდუქტზე ავტომატურად'}</div>
                    </div>
                    <div className="w-11 h-6 rounded-full relative cursor-pointer" style={{ background: '#16a34a' }}>
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-4">
              <h3 className="text-[1rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'კომპანიის ინფორმაცია'}</h3>
              {[
                { label: 'კომპანიის სახელი', value: 'შპს "JabsOn Demo"' },
                { label: 'საიდენტიფიკაციო კოდი', value: '404123456' },
                { label: 'მისამართი', value: 'თბილისი, რუსთაველის 12' },
                { label: 'ტელეფონი', value: '+995 322 123 456' },
                { label: 'ელ.ფოსტა', value: 'info@jabson.ge' },
              ].map((field) => (
                <div key={field.label} className="space-y-1.5">
                  <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{field.label}</label>
                  <input defaultValue={field.value} className="w-full max-w-[400px] px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pos' && (
            <div className="space-y-4">
              <h3 className="text-[1rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'POS პარამეტრები'}</h3>
              {[
                { title: 'ავტომატური ჩეკის ბეჭდვა', desc: 'გადახდის შემდეგ' },
                { title: 'ხმის სიგნალი სკანერზე', desc: 'ბარკოდის წაკითხვისას' },
                { title: 'დაბალი მარაგის გაფრთხილება', desc: 'გაყიდვისას თუ მარაგი დაბალია' },
              ].map((s) => (
                <div key={s.title} className="flex items-center justify-between max-w-[400px] px-4 py-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
                  <div>
                    <div className="text-[0.875rem] font-medium" style={{ color: 'var(--foreground)' }}>{s.title}</div>
                    <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{s.desc}</div>
                  </div>
                  <div className="w-11 h-6 rounded-full relative cursor-pointer" style={{ background: '#16a34a' }}>
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-[1rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'უსაფრთხოების პარამეტრები'}</h3>
              <div className="flex items-center justify-between max-w-[400px] px-4 py-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
                <div>
                  <div className="text-[0.875rem] font-medium" style={{ color: 'var(--foreground)' }}>{'ორფაქტორიანი ავტორიზაცია'}</div>
                  <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{'2FA ყველა ადმინისტრატორისთვის'}</div>
                </div>
                <div className="w-11 h-6 rounded-full relative cursor-pointer" style={{ background: '#d1d5db' }}>
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between max-w-[400px] px-4 py-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
                <div>
                  <div className="text-[0.875rem] font-medium" style={{ color: 'var(--foreground)' }}>{'აუდიტ ლოგი'}</div>
                  <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{'ყველა მოქმედების ჩაწერა'}</div>
                </div>
                <div className="w-11 h-6 rounded-full relative cursor-pointer" style={{ background: '#16a34a' }}>
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'სესიის ვადა (წუთი)'}</label>
                <input type="number" defaultValue={60} className="w-full max-w-[300px] px-3.5 py-2.5 rounded-lg text-[0.9375rem] outline-none" style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }} />
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-4">
              <h3 className="text-[1rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'გუნდის წევრები'}</h3>
              {[
                { name: 'ნინო ბერიძე', email: 'nino@jabson.ge', role: 'ადმინისტრატორი' },
                { name: 'დავით ქუთათელაძე', email: 'davit@jabson.ge', role: 'გამყიდველი' },
                { name: 'მარიამ ჯავახიშვილი', email: 'mariam@jabson.ge', role: 'ბუღალტერი' },
              ].map((member) => (
                <div key={member.email} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[0.8125rem] font-bold" style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', color: 'white' }}>
                    {member.name.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.875rem] font-medium" style={{ color: 'var(--foreground)' }}>{member.name}</div>
                    <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{member.email}</div>
                  </div>
                  <span className="text-[0.75rem] font-medium px-2.5 py-0.5 rounded-full" style={{
                    background: member.role === 'ადმინისტრატორი' ? '#dbeafe' : member.role === 'ბუღალტერი' ? '#fef3c7' : '#dcfce7',
                    color: member.role === 'ადმინისტრატორი' ? '#1d4ed8' : member.role === 'ბუღალტერი' ? '#92400e' : '#15803d',
                  }}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          )}

          {(activeTab === 'payment' || activeTab === 'notifications') && (
            <div className="py-8 text-center">
              <Globe className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--muted-foreground)', opacity: 0.3 }} />
              <div className="text-[1rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მალე დაემატება'}</div>
              <div className="text-[0.875rem] mt-1" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>{'ეს ფუნქცია მალე ხელმისაწვდომი იქნება'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
