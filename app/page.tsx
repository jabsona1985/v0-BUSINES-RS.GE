'use client'

import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/jabson/sidebar'
import { TopBar } from '@/components/jabson/topbar'
import { CommandPalette } from '@/components/jabson/command-palette'
import { DashboardPage } from '@/components/jabson/pages/dashboard-page'
import { InventoryPage } from '@/components/jabson/pages/inventory-page'
import { POSPage } from '@/components/jabson/pages/pos-page'
import { SalesPage } from '@/components/jabson/pages/sales-page'
import { CustomersPage } from '@/components/jabson/pages/customers-page'
import { SuppliersPage } from '@/components/jabson/pages/suppliers-page'
import { AdjustmentsPage } from '@/components/jabson/pages/adjustments-page'
import { TransfersPage } from '@/components/jabson/pages/transfers-page'
import { AlertsPage } from '@/components/jabson/pages/alerts-page'
import { AuditLogPage } from '@/components/jabson/pages/audit-log-page'
import { ReportsPage } from '@/components/jabson/pages/reports-page'
import { SettingsPage } from '@/components/jabson/pages/settings-page'
import { PlaceholderPage } from '@/components/jabson/pages/placeholder-page'
import { RsGePage } from '@/components/jabson/pages/rsge-page'
import { CategoriesPage } from '@/components/jabson/pages/categories-page'
import { DistributorOrdersPage } from '@/components/jabson/pages/distributor-orders-page'
import { PurchasesPage } from '@/components/jabson/pages/purchases-page'
import { CashRegisterPage } from '@/components/jabson/pages/cash-register-page'
import { WaybillsPage } from '@/components/jabson/pages/waybills-page'
import { InvoicesPage } from '@/components/jabson/pages/invoices-page'
import { AccountingPage } from '@/components/jabson/pages/accounting-page'
import { CompanyPage } from '@/components/jabson/pages/company-page'

export default function JabsonApp() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const navigate = useCallback((page: string) => {
    setActivePage(page)
    setMobileMenuOpen(false)
  }, [])

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage />
      case 'inventory': return <InventoryPage />
      case 'pos': return <POSPage />
      case 'sales': return <SalesPage />
      case 'customers': return <CustomersPage />
      case 'suppliers': return <SuppliersPage />
      case 'adjustments': return <AdjustmentsPage />
      case 'transfers': return <TransfersPage />
      case 'alerts': return <AlertsPage />
      case 'audit-log': return <AuditLogPage />
      case 'reports': return <ReportsPage />
      case 'settings': return <SettingsPage />
      case 'rsge': return <RsGePage />
      case 'categories': return <CategoriesPage />
      case 'distributor-orders': return <DistributorOrdersPage />
      case 'purchases': return <PurchasesPage />
      case 'cash-register': return <CashRegisterPage />
      case 'waybills': return <WaybillsPage />
      case 'invoices': return <InvoicesPage />
      case 'accounting': return <AccountingPage />
      case 'company': return <CompanyPage />
      default: return <PlaceholderPage pageId={activePage} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }} suppressHydrationWarning>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgb(0 0 0/0.4)' }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`hidden lg:block ${sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'} transition-all duration-300 flex-shrink-0`}>
        <Sidebar
          activePage={activePage}
          onNavigate={navigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar
          activePage={activePage}
          onNavigate={navigate}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          onToggleSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
          sidebarCollapsed={sidebarCollapsed}
          onOpenCommand={() => setCommandOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-7">
          {renderPage()}
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        onNavigate={navigate}
      />
    </div>
  )
}
