'use client'

import { useState, useEffect } from 'react'
import { DollarSign, CreditCard, Receipt, Clock, Lock, Unlock, Plus, Minus, X, Printer } from 'lucide-react'
import { demoCashSessions, demoCashMovements, demoTeamMembers, formatCurrency, type CashSession, type CashMovement } from '@/lib/demo-data'

export function CashRegisterPage() {
  const [sessions] = useState<CashSession[]>(demoCashSessions)
  const [currentSession, setCurrentSession] = useState<CashSession | null>(null)
  const [movements, setMovements] = useState<CashMovement[]>(demoCashMovements)
  const [elapsedTime, setElapsedTime] = useState('0:00:00')
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [showOpenModal, setShowOpenModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  // Movement form
  const [movementType, setMovementType] = useState<'in' | 'out'>('in')
  const [movementAmount, setMovementAmount] = useState('')
  const [movementDescription, setMovementDescription] = useState('')

  // Open session form
  const [openingCash, setOpeningCash] = useState('')
  const [selectedCashier, setSelectedCashier] = useState('')

  // Close session form
  const [actualCash, setActualCash] = useState('')
  const [closeNote, setCloseNote] = useState('')

  // Timer for elapsed time
  useEffect(() => {
    if (!currentSession) return
    const interval = setInterval(() => {
      const start = new Date(currentSession.openedAt).getTime()
      const now = Date.now()
      const diff = now - start
      const hours = Math.floor(diff / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setElapsedTime(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [currentSession])

  const lastSession = sessions[0]

  const handleOpenSession = () => {
    const newSession: CashSession = {
      id: `cs-${Date.now()}`,
      status: 'open',
      openedBy: demoTeamMembers.find(m => m.id === selectedCashier)?.name || 'Unknown',
      openingCash: Number(openingCash) || 0,
      closingCash: null,
      expectedCash: null,
      totalSales: 0,
      totalCash: 0,
      totalCard: 0,
      receiptCount: 0,
      openedAt: new Date().toISOString(),
      closedAt: null,
    }
    setCurrentSession(newSession)
    setMovements([{
      id: `cm-${Date.now()}`,
      sessionId: newSession.id,
      type: 'in',
      amount: Number(openingCash) || 0,
      description: 'საწყისი ნაღდი',
      createdAt: new Date().toISOString(),
    }])
    setShowOpenModal(false)
    setOpeningCash('')
    setSelectedCashier('')
  }

  const handleAddMovement = () => {
    if (!currentSession || !movementAmount) return
    const newMovement: CashMovement = {
      id: `cm-${Date.now()}`,
      sessionId: currentSession.id,
      type: movementType,
      amount: Number(movementAmount),
      description: movementDescription || (movementType === 'in' ? 'შემოსვლა' : 'გასვლა'),
      createdAt: new Date().toISOString(),
    }
    setMovements([newMovement, ...movements])
    setMovementAmount('')
    setMovementDescription('')
  }

  const totalCashIn = movements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.amount, 0)
  const totalCashOut = movements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.amount, 0)
  const expectedCash = currentSession ? currentSession.openingCash + currentSession.totalCash + totalCashIn - totalCashOut - currentSession.openingCash : 0
  const actualExpected = currentSession ? currentSession.openingCash + totalCashIn - totalCashOut : 0

  const handleCloseSession = () => {
    if (!currentSession) return
    const closedSession: CashSession = {
      ...currentSession,
      status: 'closed',
      closingCash: Number(actualCash),
      expectedCash: actualExpected,
      closedAt: new Date().toISOString(),
    }
    setCurrentSession(null)
    setShowCloseModal(false)
    setShowReportModal(true)
    setActualCash('')
    setCloseNote('')
  }

  const difference = Number(actualCash) - actualExpected

  // No open session state
  if (!currentSession) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'სალარო'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {'სალაროს სმენის მართვა'}
          </p>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="w-full max-w-[420px] rounded-2xl p-8 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#f59e0b15' }}>
              <Lock className="w-8 h-8" style={{ color: '#f59e0b' }} />
            </div>
            <h2 className="text-[1.25rem] font-bold mb-2" style={{ color: 'var(--foreground)' }}>{'სალაროს სმენი დახურულია'}</h2>
            
            {lastSession && (
              <div className="text-[0.875rem] mb-6 space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                <p>{'ბოლო სმენა:'} {new Date(lastSession.closedAt || '').toLocaleDateString('ka-GE', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                <p>{'მოლარე:'} {lastSession.openedBy}</p>
                <p>{'ჯამი:'} {formatCurrency(lastSession.totalSales)}</p>
              </div>
            )}

            <button
              onClick={() => setShowOpenModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[0.9375rem] font-semibold"
              style={{ background: '#16a34a', color: 'white', boxShadow: '0 2px 8px rgb(22 163 74/0.3)' }}
            >
              <Unlock className="w-5 h-5" />
              {'სმენის გახსნა'}
            </button>
          </div>
        </div>

        {/* Open Session Modal */}
        {showOpenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
            <div className="w-full max-w-[400px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
              <div className="flex items-start justify-between px-6 pt-6 pb-4">
                <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{'სმენის გახსნა'}</h2>
                <button onClick={() => setShowOpenModal(false)} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
              </div>
              <div className="px-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'საწყისი ნაღდი'}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={openingCash}
                      onChange={(e) => setOpeningCash(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-8 rounded-lg text-[0.9375rem]"
                      style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                      placeholder="0.00"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{'₾'}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მოლარე'}</label>
                  <select
                    value={selectedCashier}
                    onChange={(e) => setSelectedCashier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
                    style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                  >
                    <option value="">{'აირჩიეთ მოლარე'}</option>
                    {demoTeamMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 px-6 py-5">
                <button onClick={() => setShowOpenModal(false)} className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
                  {'გაუქმება'}
                </button>
                <button
                  onClick={handleOpenSession}
                  disabled={!openingCash || !selectedCashier}
                  className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium disabled:opacity-50"
                  style={{ background: '#16a34a', color: 'white' }}
                >
                  {'გახსნა'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Session Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
            <div className="w-full max-w-[400px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }} data-no-print>
              <div className="flex items-start justify-between px-6 pt-6 pb-4">
                <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{'სმენის ანგარიში'}</h2>
                <button onClick={() => setShowReportModal(false)} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
              </div>
              <div className="px-6 space-y-3">
                <div className="text-center py-4">
                  <div className="text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{'სულ გაყიდვები'}</div>
                  <div className="text-[2rem] font-bold" style={{ color: '#16a34a' }}>{formatCurrency(lastSession?.totalSales || 0)}</div>
                </div>
                <div className="space-y-2 py-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="flex justify-between text-[0.875rem]">
                    <span style={{ color: 'var(--muted-foreground)' }}>{'ნაღდი გაყიდვები'}</span>
                    <span style={{ color: 'var(--foreground)' }}>{formatCurrency(lastSession?.totalCash || 0)}</span>
                  </div>
                  <div className="flex justify-between text-[0.875rem]">
                    <span style={{ color: 'var(--muted-foreground)' }}>{'ბარათით გაყიდვები'}</span>
                    <span style={{ color: 'var(--foreground)' }}>{formatCurrency(lastSession?.totalCard || 0)}</span>
                  </div>
                  <div className="flex justify-between text-[0.875rem]">
                    <span style={{ color: 'var(--muted-foreground)' }}>{'ჩეკების რაოდენობა'}</span>
                    <span style={{ color: 'var(--foreground)' }}>{lastSession?.receiptCount || 0}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 px-6 py-5">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
                  <Printer className="w-4 h-4" />
                  {'ბეჭდვა'}
                </button>
                <button onClick={() => setShowReportModal(false)} className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: '#16a34a', color: 'white' }}>
                  {'დახურვა'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Open session state
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'სალარო'}</h1>
        <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
          {'აქტიური სმენი - '}{currentSession.openedBy}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <Clock className="w-5 h-5" style={{ color: '#8b5cf6' }} />
          <div>
            <div className="text-[0.7rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'გასული'}</div>
            <div className="text-[1rem] font-bold font-mono" style={{ color: 'var(--foreground)' }}>{elapsedTime}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <DollarSign className="w-5 h-5" style={{ color: '#16a34a' }} />
          <div>
            <div className="text-[0.7rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ნაღდი'}</div>
            <div className="text-[1rem] font-bold" style={{ color: 'var(--foreground)' }}>{formatCurrency(currentSession.totalCash + totalCashIn - totalCashOut)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <CreditCard className="w-5 h-5" style={{ color: '#3b82f6' }} />
          <div>
            <div className="text-[0.7rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ბარათი'}</div>
            <div className="text-[1rem] font-bold" style={{ color: 'var(--foreground)' }}>{formatCurrency(currentSession.totalCard)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <Receipt className="w-5 h-5" style={{ color: '#f59e0b' }} />
          <div>
            <div className="text-[0.7rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ჩეკები'}</div>
            <div className="text-[1rem] font-bold" style={{ color: 'var(--foreground)' }}>{currentSession.receiptCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: '#16a34a15', border: '1px solid #16a34a30' }}>
          <DollarSign className="w-5 h-5" style={{ color: '#16a34a' }} />
          <div>
            <div className="text-[0.7rem] font-medium" style={{ color: '#16a34a' }}>{'სულ'}</div>
            <div className="text-[1rem] font-bold" style={{ color: '#16a34a' }}>{formatCurrency(currentSession.totalCash + currentSession.totalCard)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Cash Movement */}
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="text-[0.9375rem] font-semibold mb-4" style={{ color: 'var(--foreground)' }}>{'ნაღდი ფულის მოძრაობა'}</h3>
            
            {/* Toggle */}
            <div className="flex rounded-lg p-1 mb-4" style={{ background: 'var(--secondary)' }}>
              <button
                onClick={() => setMovementType('in')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[0.8125rem] font-medium transition-all"
                style={{ background: movementType === 'in' ? 'var(--card)' : 'transparent', color: movementType === 'in' ? '#16a34a' : 'var(--muted-foreground)' }}
              >
                <Plus className="w-4 h-4" />
                {'შემოსვლა'}
              </button>
              <button
                onClick={() => setMovementType('out')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[0.8125rem] font-medium transition-all"
                style={{ background: movementType === 'out' ? 'var(--card)' : 'transparent', color: movementType === 'out' ? '#ef4444' : 'var(--muted-foreground)' }}
              >
                <Minus className="w-4 h-4" />
                {'გასვლა'}
              </button>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type="number"
                  value={movementAmount}
                  onChange={(e) => setMovementAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-8 rounded-lg text-[0.9375rem]"
                  style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                  placeholder="თანხა"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{'₾'}</span>
              </div>
              <input
                type="text"
                value={movementDescription}
                onChange={(e) => setMovementDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
                style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                placeholder="აღწერა"
              />
              <button
                onClick={handleAddMovement}
                disabled={!movementAmount}
                className="w-full py-2.5 rounded-lg text-[0.875rem] font-medium disabled:opacity-50"
                style={{ background: movementType === 'in' ? '#16a34a' : '#ef4444', color: 'white' }}
              >
                {'დამატება'}
              </button>
            </div>
          </div>

          {/* Movement History */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'მოძრაობის ისტორია'}</h3>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {movements.map((m) => (
                <div key={m.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ background: m.type === 'in' ? '#dcfce7' : '#fee2e2' }}>
                      {m.type === 'in' ? <Plus className="w-4 h-4" style={{ color: '#16a34a' }} /> : <Minus className="w-4 h-4" style={{ color: '#ef4444' }} />}
                    </div>
                    <div>
                      <div className="text-[0.875rem] font-medium" style={{ color: 'var(--foreground)' }}>{m.description}</div>
                      <div className="text-[0.75rem]" style={{ color: 'var(--muted-foreground)' }}>{new Date(m.createdAt).toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                  <span className="text-[0.9375rem] font-semibold" style={{ color: m.type === 'in' ? '#16a34a' : '#ef4444' }}>
                    {m.type === 'in' ? '+' : '-'}{formatCurrency(m.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Session Summary */}
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="text-[0.9375rem] font-semibold mb-4" style={{ color: 'var(--foreground)' }}>{'სმენის შეჯამება'}</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-[0.875rem]">
                <span style={{ color: 'var(--muted-foreground)' }}>{'გახსნა'}</span>
                <span style={{ color: 'var(--foreground)' }}>{new Date(currentSession.openedAt).toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between text-[0.875rem]">
                <span style={{ color: 'var(--muted-foreground)' }}>{'საწყისი ნაღდი'}</span>
                <span style={{ color: 'var(--foreground)' }}>{formatCurrency(currentSession.openingCash)}</span>
              </div>
              <div className="pt-3" style={{ borderTop: '1px dashed var(--border)' }}>
                <div className="flex justify-between text-[0.875rem]">
                  <span style={{ color: 'var(--muted-foreground)' }}>{'გაყიდვები ნაღდი'}</span>
                  <span style={{ color: 'var(--foreground)' }}>{formatCurrency(currentSession.totalCash)}</span>
                </div>
                <div className="flex justify-between text-[0.875rem] mt-2">
                  <span style={{ color: 'var(--muted-foreground)' }}>{'გაყიდვები ბარათი'}</span>
                  <span style={{ color: 'var(--foreground)' }}>{formatCurrency(currentSession.totalCard)}</span>
                </div>
                <div className="flex justify-between text-[0.875rem] mt-2">
                  <span style={{ color: '#16a34a' }}>{'შემოსვლა'}</span>
                  <span style={{ color: '#16a34a' }}>+{formatCurrency(totalCashIn - currentSession.openingCash)}</span>
                </div>
                <div className="flex justify-between text-[0.875rem] mt-2">
                  <span style={{ color: '#ef4444' }}>{'გასვლა'}</span>
                  <span style={{ color: '#ef4444' }}>-{formatCurrency(totalCashOut)}</span>
                </div>
              </div>
              <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex justify-between">
                  <span className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'მოსალოდნელი'}</span>
                  <span className="text-[1.125rem] font-bold" style={{ color: '#16a34a' }}>{formatCurrency(actualExpected)}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCloseModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[0.9375rem] font-semibold"
            style={{ background: '#dc2626', color: 'white', boxShadow: '0 2px 8px rgb(220 38 38/0.3)' }}
          >
            <Lock className="w-5 h-5" />
            {'სმენის დახურვა'}
          </button>
        </div>
      </div>

      {/* Close Session Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }} data-no-print>
          <div className="w-full max-w-[400px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{'სმენის დახურვა'}</h2>
              <button onClick={() => setShowCloseModal(false)} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 space-y-4">
              <div className="flex justify-between text-[0.9375rem] p-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
                <span style={{ color: 'var(--muted-foreground)' }}>{'მოსალოდნელი ნაღდი'}</span>
                <span className="font-bold" style={{ color: 'var(--foreground)' }}>{formatCurrency(actualExpected)}</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ფაქტიური ნაღდი'}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={actualCash}
                    onChange={(e) => setActualCash(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-8 rounded-lg text-[0.9375rem]"
                    style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="0.00"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{'₾'}</span>
                </div>
              </div>
              {actualCash && (
                <div className="flex justify-between text-[0.9375rem] p-3 rounded-lg" style={{ background: difference >= 0 ? '#dcfce7' : '#fee2e2' }}>
                  <span style={{ color: difference >= 0 ? '#16a34a' : '#dc2626' }}>{'სხვაობა'}</span>
                  <span className="font-bold" style={{ color: difference >= 0 ? '#16a34a' : '#dc2626' }}>
                    {difference >= 0 ? '+' : ''}{formatCurrency(difference)}
                  </span>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'შენიშვნა'}</label>
                <textarea
                  value={closeNote}
                  onChange={(e) => setCloseNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem] resize-none"
                  style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-2 px-6 py-5">
              <button onClick={() => setShowCloseModal(false)} className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
                {'გაუქმება'}
              </button>
              <button
                onClick={handleCloseSession}
                disabled={!actualCash}
                className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium disabled:opacity-50"
                style={{ background: '#dc2626', color: 'white' }}
              >
                {'სმენის დახურვა'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
