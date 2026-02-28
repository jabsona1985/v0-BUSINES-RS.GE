'use client'

import { Clock, Sparkles } from 'lucide-react'

const pageInfo: Record<string, { title: string; description: string }> = {
  purchases: { title: 'შესყიდვები', description: 'მომწოდებლებისგან პროდუქტების შესყიდვა და მიღება' },
  accounting: { title: 'ბუღალტერია', description: 'ფინანსური ანგარიშგება, შემოსავლები, ხარჯები' },
  'cash-register': { title: 'სალარო', description: 'ნაღდი ფულის მართვა, შეტანა-გამოტანა' },
  waybills: { title: 'ზედნადები', description: 'rs.ge ზედნადებების შექმნა და მართვა' },
  invoices: { title: 'ანგარიშ-ფაქტურა', description: 'rs.ge ანგარიშ-ფაქტურების გამოწერა' },
  company: { title: 'კომპანია', description: 'კომპანიის ინფორმაცია და ფილიალების მართვა' },
}

export function PlaceholderPage({ pageId }: { pageId: string }) {
  const info = pageInfo[pageId] || { title: pageId, description: '' }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-[400px]">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{
          background: 'linear-gradient(135deg, var(--secondary), var(--card))',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0/0.05)',
        }}>
          <Clock className="w-8 h-8" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }} />
        </div>
        <h2 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{info.title}</h2>
        <p className="text-[0.9375rem] mt-2" style={{ color: 'var(--muted-foreground)' }}>{info.description}</p>
        <div className="flex items-center justify-center gap-2 mt-5 px-4 py-2.5 rounded-full mx-auto w-fit" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>
          <Sparkles className="w-4 h-4" />
          <span className="text-[0.8125rem] font-medium">{'მალე დაემატება PRO გეგმაში'}</span>
        </div>
      </div>
    </div>
  )
}
