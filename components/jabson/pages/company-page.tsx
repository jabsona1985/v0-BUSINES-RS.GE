'use client'

import { useState } from 'react'
import { Plus, Edit2, Building2, Users, BarChart3, MapPin, Phone, X, Check } from 'lucide-react'
import { demoBranches, demoTeamMembers, roleLabels, formatCurrency, type Branch, type TeamMember } from '@/lib/demo-data'

const tabs = [
  { id: 'branches', label: 'ფილიალები', icon: Building2 },
  { id: 'team', label: 'გუნდი', icon: Users },
  { id: 'stats', label: 'სტატისტიკა', icon: BarChart3 },
]

export function CompanyPage() {
  const [activeTab, setActiveTab] = useState('branches')
  const [branches, setBranches] = useState<Branch[]>(demoBranches)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(demoTeamMembers)
  const [showBranchModal, setShowBranchModal] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [showInviteModal, setShowInviteModal] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold" style={{ color: 'var(--foreground)' }}>{'კომპანია'}</h1>
          <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {'ფილიალების და გუნდის მართვა'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--secondary)' }}>
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[0.875rem] font-medium transition-all"
              style={{
                background: activeTab === tab.id ? 'var(--card)' : 'transparent',
                color: activeTab === tab.id ? 'var(--foreground)' : 'var(--muted-foreground)',
                boxShadow: activeTab === tab.id ? '0 1px 2px rgb(0 0 0/0.05)' : 'none'
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Branches Tab */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setEditingBranch(null); setShowBranchModal(true) }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium"
              style={{ background: '#16a34a', color: 'white' }}
            >
              <Plus className="w-4 h-4" />
              {'ახალი ფილიალი'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch) => (
              <div key={branch.id} className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[1rem] font-semibold" style={{ color: 'var(--foreground)' }}>{branch.name}</h3>
                      {branch.isMain && (
                        <span className="px-2 py-0.5 rounded-full text-[0.6875rem] font-medium" style={{ background: '#16a34a', color: 'white' }}>
                          {'მთავარი'}
                        </span>
                      )}
                    </div>
                    <span className={`inline-flex items-center gap-1 mt-1 text-[0.75rem] font-medium ${branch.isActive ? '' : ''}`} style={{ color: branch.isActive ? '#16a34a' : '#6b7280' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: branch.isActive ? '#16a34a' : '#9ca3af' }} />
                      {branch.isActive ? 'აქტიური' : 'არააქტიური'}
                    </span>
                  </div>
                  <button
                    onClick={() => { setEditingBranch(branch); setShowBranchModal(true) }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ color: 'var(--muted-foreground)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>
                    <MapPin className="w-4 h-4" />
                    {branch.address}
                  </div>
                  <div className="flex items-center gap-2 text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>
                    <Phone className="w-4 h-4" />
                    {branch.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium"
              style={{ background: '#16a34a', color: 'white' }}
            >
              <Plus className="w-4 h-4" />
              {'მოწვევა'}
            </button>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--secondary)' }}>
                  <th className="px-5 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'სახელი'}</th>
                  <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ელ-ფოსტა'}</th>
                  <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'როლი'}</th>
                  <th className="px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'ფილიალი'}</th>
                  <th className="px-4 py-3 text-center text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{'სტატუსი'}</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => {
                  const branch = branches.find(b => b.id === member.branchId)
                  return (
                    <tr key={member.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[0.8125rem] font-bold" style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', color: 'white' }}>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-[0.875rem] font-medium" style={{ color: 'var(--foreground)' }}>{member.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{member.email}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium" style={{
                          background: member.role === 'owner' ? '#fef3c7' : member.role === 'admin' ? '#dbeafe' : member.role === 'manager' ? '#dcfce7' : '#f3f4f6',
                          color: member.role === 'owner' ? '#92400e' : member.role === 'admin' ? '#1d4ed8' : member.role === 'manager' ? '#15803d' : '#6b7280',
                        }}>
                          {roleLabels[member.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[0.875rem]" style={{ color: 'var(--muted-foreground)' }}>{branch?.name || '---'}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 text-[0.75rem] font-medium" style={{ color: member.isActive ? '#16a34a' : '#6b7280' }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: member.isActive ? '#16a34a' : '#9ca3af' }} />
                          {member.isActive ? 'აქტიური' : 'არააქტიური'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {branches.map((branch) => (
              <div key={branch.id} className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{branch.name}</h3>
                  {branch.isMain && (
                    <span className="px-2 py-0.5 rounded-full text-[0.6875rem] font-medium" style={{ background: '#16a34a', color: 'white' }}>
                      {'მთავარი'}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{'გაყიდვები'}</span>
                    <span className="text-[1rem] font-bold" style={{ color: '#16a34a' }}>{formatCurrency(branch.isMain ? 23400 : 12800)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{'ჩეკები'}</span>
                    <span className="text-[1rem] font-semibold" style={{ color: 'var(--foreground)' }}>{branch.isMain ? 145 : 89}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{'მოგება'}</span>
                    <span className="text-[1rem] font-bold" style={{ color: '#16a34a' }}>{formatCurrency(branch.isMain ? 8900 : 4200)}</span>
                  </div>
                </div>
              </div>
            ))}
            {/* Total Card */}
            <div className="rounded-xl p-5" style={{ background: '#16a34a15', border: '1px solid #16a34a30' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[0.9375rem] font-semibold" style={{ color: 'var(--foreground)' }}>{'სულ'}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{'გაყიდვები'}</span>
                  <span className="text-[1rem] font-bold" style={{ color: '#16a34a' }}>{formatCurrency(36200)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{'ჩეკები'}</span>
                  <span className="text-[1rem] font-semibold" style={{ color: 'var(--foreground)' }}>234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[0.8125rem]" style={{ color: 'var(--muted-foreground)' }}>{'მოგება'}</span>
                  <span className="text-[1rem] font-bold" style={{ color: '#16a34a' }}>{formatCurrency(13100)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Branch Modal */}
      {showBranchModal && (
        <BranchModal
          branch={editingBranch}
          onClose={() => { setShowBranchModal(false); setEditingBranch(null) }}
          onSave={(branch) => {
            if (editingBranch) {
              setBranches(prev => prev.map(b => b.id === branch.id ? branch : b))
            } else {
              setBranches(prev => [...prev, branch])
            }
            setShowBranchModal(false)
            setEditingBranch(null)
          }}
        />
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          branches={branches}
          onClose={() => setShowInviteModal(false)}
          onInvite={(member) => {
            setTeamMembers(prev => [...prev, member])
            setShowInviteModal(false)
          }}
        />
      )}
    </div>
  )
}

function BranchModal({ branch, onClose, onSave }: { branch: Branch | null; onClose: () => void; onSave: (b: Branch) => void }) {
  const [name, setName] = useState(branch?.name || '')
  const [address, setAddress] = useState(branch?.address || '')
  const [phone, setPhone] = useState(branch?.phone || '')
  const [isMain, setIsMain] = useState(branch?.isMain || false)

  const handleSave = () => {
    const newBranch: Branch = {
      id: branch?.id || `br-${Date.now()}`,
      name,
      address,
      phone,
      isMain,
      isActive: true,
    }
    onSave(newBranch)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-[420px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{branch ? 'ფილიალის რედაქტირება' : 'ახალი ფილიალი'}</h2>
          <button onClick={onClose} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'სახელი'}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              placeholder="ფილიალის სახელი"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'მისამართი'}</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              placeholder="მისამართი"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ტელეფონი'}</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              placeholder="ტელეფონი"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className="w-5 h-5 rounded flex items-center justify-center transition-colors"
              style={{ background: isMain ? '#16a34a' : 'var(--secondary)', border: isMain ? 'none' : '1.5px solid var(--border)' }}
              onClick={() => setIsMain(!isMain)}
            >
              {isMain && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{'მთავარი ფილიალი'}</span>
          </label>
        </div>
        <div className="flex gap-2 px-6 py-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
            {'გაუქმება'}
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !address}
            className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium disabled:opacity-50"
            style={{ background: '#16a34a', color: 'white' }}
          >
            {'შენახვა'}
          </button>
        </div>
      </div>
    </div>
  )
}

function InviteModal({ branches, onClose, onInvite }: { branches: Branch[]; onClose: () => void; onInvite: (m: TeamMember) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<TeamMember['role']>('cashier')
  const [branchId, setBranchId] = useState(branches[0]?.id || '')

  const handleInvite = () => {
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name,
      email,
      role,
      branchId,
      isActive: true,
    }
    onInvite(newMember)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgb(0 0 0/0.5)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-[420px] rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.15)' }}>
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <h2 className="text-[1.125rem] font-bold" style={{ color: 'var(--foreground)' }}>{'თანამშრომლის მოწვევა'}</h2>
          <button onClick={onClose} style={{ color: 'var(--muted-foreground)' }}><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'სახელი'}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              placeholder="სახელი და გვარი"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ელ-ფოსტა'}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'როლი'}</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as TeamMember['role'])}
              className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
            >
              <option value="admin">{roleLabels.admin}</option>
              <option value="manager">{roleLabels.manager}</option>
              <option value="cashier">{roleLabels.cashier}</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium" style={{ color: 'var(--muted-foreground)' }}>{'ფილიალი'}</label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-[0.9375rem]"
              style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
            >
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2 px-6 py-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
            {'გაუქმება'}
          </button>
          <button
            onClick={handleInvite}
            disabled={!name || !email}
            className="flex-1 py-2.5 rounded-lg text-[0.875rem] font-medium disabled:opacity-50"
            style={{ background: '#16a34a', color: 'white' }}
          >
            {'მოწვევა'}
          </button>
        </div>
      </div>
    </div>
  )
}
