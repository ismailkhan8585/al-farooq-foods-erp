'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Boxes,
  ChevronDown,
  Download,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
  UserCheck,
  Building2,
  WifiOff,
  X,
  FileText,
  Receipt,
  Store,
  Phone,
} from 'lucide-react'

import {
  loadDatabase,
  saveDatabase,
  exportDatabaseJSON,
  type AppDatabase,
  type ModuleKey,
  moduleLabels,
  initialDatabase,
  formatPKR,
} from '@/lib/db'

import dynamic from 'next/dynamic'
import DashboardView from './dashboard-view'
import type { SalesSubTab } from './sales-view'
import type { PurchasesExpensesSubTab } from './purchases-expenses-view'
import type { ProductsSubTab } from './products-view'
import type { ReportCategoryKey } from './reports-view'
import NotificationsPopover from './notifications-popover'
import GlobalSearch from './global-search'
import { ThemeToggle } from './theme-toggle'

// Lightweight fallback skeleton for code-split modules
function ModuleLoadingSkeleton() {
  return (
    <div className="view-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ height: '36px', width: '220px', borderRadius: '8px', background: 'var(--border)', opacity: 0.5 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ height: '110px', borderRadius: '12px', background: 'var(--card-bg, #161a22)', border: '1px solid var(--border)', opacity: 0.6 }} />
        <div style={{ height: '110px', borderRadius: '12px', background: 'var(--card-bg, #161a22)', border: '1px solid var(--border)', opacity: 0.6 }} />
        <div style={{ height: '110px', borderRadius: '12px', background: 'var(--card-bg, #161a22)', border: '1px solid var(--border)', opacity: 0.6 }} />
      </div>
      <div style={{ height: '360px', borderRadius: '12px', background: 'var(--card-bg, #161a22)', border: '1px solid var(--border)', opacity: 0.5 }} />
    </div>
  )
}

const PosView = dynamic(() => import('./pos-view'), { loading: () => <ModuleLoadingSkeleton /> })
const SalesView = dynamic(() => import('./sales-view'), { loading: () => <ModuleLoadingSkeleton /> })
const CustomerManagementView = dynamic(() => import('./customer-management-view'), { loading: () => <ModuleLoadingSkeleton /> })
const PurchasesExpensesView = dynamic(() => import('./purchases-expenses-view'), { loading: () => <ModuleLoadingSkeleton /> })
const SuppliersManagementView = dynamic(() => import('./suppliers-management-view'), { loading: () => <ModuleLoadingSkeleton /> })
const ProductsView = dynamic(() => import('./products-view'), { loading: () => <ModuleLoadingSkeleton /> })
const RawMaterialsView = dynamic(() => import('./raw-materials-view'), { loading: () => <ModuleLoadingSkeleton /> })
const EmployeesView = dynamic(() => import('./employees-view'), { loading: () => <ModuleLoadingSkeleton /> })
const ReportsView = dynamic(() => import('./reports-view'), { loading: () => <ModuleLoadingSkeleton /> })
const SettingsView = dynamic(() => import('./settings-view'), { loading: () => <ModuleLoadingSkeleton /> })

const preloadModule = (mod: ModuleKey | string) => {
  switch (mod) {
    case 'pos': import('./pos-view'); break
    case 'sales': import('./sales-view'); break
    case 'customer-management':
    case 'phonebook': import('./customer-management-view'); break
    case 'purchase':
    case 'expenses': import('./purchases-expenses-view'); break
    case 'suppliers-management': import('./suppliers-management-view'); break
    case 'products': import('./products-view'); break
    case 'raw-materials': import('./raw-materials-view'); break
    case 'employees': import('./employees-view'); break
    case 'reports': import('./reports-view'); break
    case 'settings': import('./settings-view'); break
    default: break
  }
}

export default function BusinessApp() {
  const [db, setDb] = useState<AppDatabase>(initialDatabase)
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard')
  const [salesTab, setSalesTab] = useState<SalesSubTab>('invoices')
  const [customerTab, setCustomerTab] = useState<'customers' | 'phonebook'>('customers')
  const [purchaseTab, setPurchaseTab] = useState<PurchasesExpensesSubTab>('purchases')
  const [productsTab, setProductsTab] = useState<ProductsSubTab>('catalog')
  const [reportsCategory, setReportsCategory] = useState<ReportCategoryKey>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [isOwner, setIsOwner] = useState(true)
  const [isClientLoaded, setIsClientLoaded] = useState(false)

  // Load from offline persistent storage on mount
  useEffect(() => {
    const loaded = loadDatabase()
    setDb(loaded)
    setIsClientLoaded(true)
  }, [])

  // Card spotlight: feed cursor position to the hovered card as --mx / --my (CSS draws the glow)
  useEffect(() => {
    const CARD_SELECTOR =
      '.stat-card, .metric-card, .cc-card, .pos-product-card, [id^="pos-card-"], [id^="product-card-"], [id^="employee-card-"], [id^="raw-material-card-"], [id^="contact-card-"], #purchase-kpi-cards > div'
    let frame = 0
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.(CARD_SELECTOR) as HTMLElement | null
      if (!card) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', `${e.clientX - r.left}px`)
        card.style.setProperty('--my', `${e.clientY - r.top}px`)
      })
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  // Sync back to offline localStorage whenever db updates
  const handleSaveDatabase = (updated: AppDatabase) => {
    setDb(updated)
    saveDatabase(updated)
  }

  // Smart Navigation Handler: supports core modules + direct routing to subtabs
  const handleNavigate = (key: ModuleKey | string, subTab?: string) => {
    // Check if key is a legacy/sub-route and route appropriately
    if (key === 'customer-management' || key === 'customers') {
      setActiveModule('customer-management')
      setCustomerTab(subTab === 'phonebook' ? 'phonebook' : 'customers')
    } else if (key === 'phonebook') {
      setActiveModule('customer-management')
      setCustomerTab('phonebook')
    } else if (key === 'suppliers-management' || key === 'suppliers') {
      setActiveModule('suppliers-management')
    } else if (['invoices', 'counter-sales', 'wholesalers'].includes(key)) {
      setActiveModule('sales')
      const mapped = key === 'counter-sales' ? 'pos' : (key as SalesSubTab)
      setSalesTab(mapped)
    } else if (key === 'expenses') {
      setActiveModule('purchase')
      setPurchaseTab('expenses')
    } else if (key === 'purchases' || key === 'purchase') {
      setActiveModule('purchase')
      setPurchaseTab(subTab === 'expenses' ? 'expenses' : 'purchases')
    } else if (['production', 'stock'].includes(key)) {
      setActiveModule('products')
      setProductsTab(key === 'stock' ? 'stock' : 'production')
    } else if (['daily-summary', 'monthly-summary', 'yearly-summary', 'profit-loss', 'cash-bank', 'sales-report', 'purchase-report', 'expense-report', 'supplier-report', 'customer-report', 'salary-report', 'inventory-report'].includes(key)) {
      setActiveModule('reports')
      if (key === 'sales-report') setReportsCategory('sales')
      else if (key === 'purchase-report') setReportsCategory('purchases')
      else if (key === 'expense-report') setReportsCategory('expenses')
      else if (key === 'supplier-report') setReportsCategory('suppliers')
      else if (key === 'customer-report') setReportsCategory('customers')
      else if (key === 'salary-report') setReportsCategory('salary')
      else if (key === 'inventory-report') setReportsCategory('inventory')
      else setReportsCategory('overview')
    } else {
      setActiveModule(key as ModuleKey)
      if (subTab) {
        if (key === 'sales') setSalesTab(subTab as SalesSubTab)
        if (key === 'purchase') setPurchaseTab(subTab as PurchasesExpensesSubTab)
        if (key === 'customer-management') setCustomerTab(subTab === 'phonebook' ? 'phonebook' : 'customers')
        if (key === 'products') setProductsTab(subTab as ProductsSubTab)
        if (key === 'reports') setReportsCategory(subTab as ReportCategoryKey)
      }
    }
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-frame">
      {/* FLAT & SIMPLE SIDEBAR NAVIGATION */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <Image
            src="/al-farooq-foods-logo.png"
            alt="AL FAROOQ FOODS"
            width={220}
            height={52}
            className="brand-logo"
            priority
          />
          <button className="icon-button close-nav" onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>

        <div className="workspace">
          <div className="workspace-avatar">AF</div>
          <div>
            <strong>AL FAROOQ FOODS</strong>
            <span>Food & Beverage Plant</span>
          </div>
          <ChevronDown className="workspace-chevron" />
        </div>

        {/* Core Top-Level Sidebar Nav Items */}
        <nav className="nav-list" aria-label="Core Business Navigation">
          {/* 1. Dashboard */}
          <button
            className={`nav-item ${activeModule === 'dashboard' ? 'nav-item-active' : ''}`}
            onClick={() => handleNavigate('dashboard')}
            id="nav-dashboard"
          >
            <LayoutDashboard />
            <span>Dashboard</span>
          </button>

          {/* 2. POS (Standalone Point-of-Sale Page) */}
          <button
            className={`nav-item ${activeModule === 'pos' ? 'nav-item-active' : ''}`}
            onClick={() => handleNavigate('pos')}
            onMouseEnter={() => preloadModule('pos')}
            id="nav-pos"
          >
            <Store />
            <span>POS</span>
          </button>

          {/* 3. Sales */}
          <button
            className={`nav-item ${activeModule === 'sales' ? 'nav-item-active' : ''}`}
            onClick={() => handleNavigate('sales')}
            onMouseEnter={() => preloadModule('sales')}
            id="nav-sales"
          >
            <ShoppingBag />
            <span>Sales</span>
            <span className="nav-count">{db.invoices.length}</span>
          </button>

          {/* 4. Customer Management (Includes Phone Book Directory) */}
          <button
            className={`nav-item ${activeModule === 'customer-management' || activeModule === 'phonebook' ? 'nav-item-active' : ''}`}
            onClick={() => handleNavigate('customer-management', 'customers')}
            onMouseEnter={() => preloadModule('customer-management')}
            id="nav-customer-management"
          >
            <UserCheck />
            <span>Customer Management</span>
            <span className="nav-count">{db.customers.length}</span>
          </button>

          {/* 5. Purchases & Expenses (Unified Module) */}
          <button
            className={`nav-item ${activeModule === 'purchase' || activeModule === 'expenses' ? 'nav-item-active' : ''}`}
            onClick={() => handleNavigate('purchase', 'purchases')}
            onMouseEnter={() => preloadModule('purchase')}
            id="nav-purchases-expenses"
          >
            <Truck />
            <span>Purchases & Expenses</span>
            <span className="nav-count">{db.purchases.length + db.expenses.length}</span>
          </button>

          {/* 6. Suppliers (Vendor Hub) */}
          <button
            className={`nav-item ${activeModule === 'suppliers-management' ? 'nav-item-active' : ''}`}
            onClick={() => handleNavigate('suppliers-management')}
            onMouseEnter={() => preloadModule('suppliers-management')}
            id="nav-suppliers"
          >
            <Building2 />
            <span>Suppliers</span>
            <span className="nav-count">{db.suppliers.length}</span>
          </button>

          {/* 7. Products */}
          <button
            className={`nav-item ${activeModule === 'products' ? 'nav-item-active' : ''}`}
            onClick={() => handleNavigate('products')}
            onMouseEnter={() => preloadModule('products')}
            id="nav-products"
          >
            <Package />
            <span>Products</span>
            <span className="nav-count">{db.products.length}</span>
          </button>

          {/* 9. Raw Material */}
          <button
            className={`nav-item ${activeModule === 'raw-materials' ? 'nav-item-active' : ''}`}
            onClick={() => handleNavigate('raw-materials')}
            onMouseEnter={() => preloadModule('raw-materials')}
            id="nav-raw-materials"
          >
            <Boxes />
            <span>Raw Material</span>
            <span className="nav-count">{db.rawMaterials.length}</span>
          </button>

          {/* 10. Employees */}
          <button
            className={`nav-item ${activeModule === 'employees' ? 'nav-item-active' : ''}`}
            onClick={() => handleNavigate('employees')}
            onMouseEnter={() => preloadModule('employees')}
            id="nav-employees"
          >
            <Users />
            <span>Employees</span>
            <span className="nav-count">{db.employees?.length || 0}</span>
          </button>

          {/* 11. Reports */}
          <button
            className={`nav-item ${activeModule === 'reports' ? 'nav-item-active' : ''}`}
            onClick={() => handleNavigate('reports')}
            onMouseEnter={() => preloadModule('reports')}
            id="nav-reports"
          >
            <TrendingUp />
            <span>Reports</span>
          </button>

          {/* 12. Settings */}
          <button
            className={`nav-item ${activeModule === 'settings' ? 'nav-item-active' : ''}`}
            onClick={() => handleNavigate('settings')}
            onMouseEnter={() => preloadModule('settings')}
            id="nav-settings"
          >
            <Settings />
            <span>Settings</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-foot">
          <div className="offline-card">
            <div className="offline-icon">
              <WifiOff />
            </div>
            <div>
              <strong>100% Offline App</strong>
              <span>Fast local database active</span>
            </div>
          </div>

          <div className="user-card cursor-pointer" onClick={() => setIsOwner(!isOwner)}>
            <div className="user-avatar">{isOwner ? 'OM' : 'ST'}</div>
            <div>
              <strong>{isOwner ? 'Umar Farooq (Owner)' : 'Floor Supervisor (Staff)'}</strong>
              <span>{isOwner ? 'Super Admin' : 'Operator Access'}</span>
            </div>
            <ChevronDown />
          </div>
        </div>
      </aside>

      {/* MAIN VIEW AREA */}
      <main className="main-area">
        {/* Top Navbar */}
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>

          <div className="breadcrumb hidden sm:flex">
            <span>AL FAROOQ FOODS</span>
            <span>/</span>
            <strong>{moduleLabels[activeModule] || 'Workspace'}</strong>
          </div>

          {/* Quick Universal Admin Search */}
          <GlobalSearch db={db} onNavigate={handleNavigate} />

          <div className="top-actions">
            <div className="role-pill" onClick={() => setIsOwner(!isOwner)} title="Click to toggle role">
              <Shield className="w-3.5 h-3.5" />
              <span>{isOwner ? 'Owner View' : 'Staff View'}</span>
            </div>

            {/* Smart Action Alerts Notification Bell */}
            <NotificationsPopover db={db} onNavigate={handleNavigate} />

            {/* Light / Dark mode switch */}
            <ThemeToggle />

            <button
              className="icon-button"
              title="Quick Backup JSON"
              onClick={() => exportDatabaseJSON(db)}
            >
              <Download />
            </button>

            <button className="icon-button" onClick={() => handleNavigate('settings')} title="Settings">
              <Settings />
            </button>

            <div className="top-avatar">{isOwner ? 'AF' : 'ST'}</div>
          </div>
        </header>

        {/* Body Content Router */}
        <div className="content">
          {activeModule === 'dashboard' && (
            <DashboardView
              db={db}
              onNavigate={handleNavigate}
              onOpenReceipt={() => setShowReceiptModal(true)}
              isOwner={isOwner}
            />
          )}

          {activeModule === 'pos' && (
            <PosView
              db={db}
              onSaveDatabase={handleSaveDatabase}
              onNavigate={handleNavigate}
            />
          )}

          {activeModule === 'sales' && (
            <SalesView
              db={db}
              initialTab={salesTab}
              onSaveDatabase={handleSaveDatabase}
              onNavigate={handleNavigate}
            />
          )}

          {(activeModule === 'customer-management' || activeModule === 'phonebook') && (
            <CustomerManagementView
              db={db}
              initialTab={customerTab}
              onSaveDatabase={handleSaveDatabase}
              onNavigate={handleNavigate}
            />
          )}

          {(activeModule === 'purchase' || activeModule === 'expenses') && (
            <PurchasesExpensesView
              db={db}
              initialTab={purchaseTab}
              onSaveDatabase={handleSaveDatabase}
              onNavigate={handleNavigate}
            />
          )}

          {activeModule === 'suppliers-management' && (
            <SuppliersManagementView
              db={db}
              onSaveDatabase={handleSaveDatabase}
              onNavigate={handleNavigate}
            />
          )}

          {activeModule === 'products' && (
            <ProductsView
              db={db}
              initialTab={productsTab}
              onSaveDatabase={handleSaveDatabase}
              onNavigate={handleNavigate}
            />
          )}

          {activeModule === 'raw-materials' && (
            <RawMaterialsView
              db={db}
              onSaveDatabase={handleSaveDatabase}
              onNavigateToSupplier={() => handleNavigate('purchase', 'suppliers')}
            />
          )}

          {activeModule === 'employees' && (
            <EmployeesView db={db} onSaveDatabase={handleSaveDatabase} />
          )}

          {activeModule === 'reports' && (
            <ReportsView
              db={db}
              initialCategory={reportsCategory}
              onSaveDatabase={handleSaveDatabase}
              isOwner={isOwner}
            />
          )}

          {activeModule === 'settings' && (
            <SettingsView
              db={db}
              isOwner={isOwner}
              setIsOwner={setIsOwner}
              onSaveDatabase={handleSaveDatabase}
            />
          )}
        </div>
      </main>

      {/* Payment Receipt Modal */}
      {showReceiptModal && (
        <div className="payment-overlay">
          <div className="receipt-modal">
            <button className="receipt-close" onClick={() => setShowReceiptModal(false)}>
              <X />
            </button>
            <div className="receipt-success">
              <div className="receipt-confetti">✦ · ✦ · ✦</div>
              <div className="receipt-check">✓</div>
            </div>
            <p className="receipt-amount">
              <small>Rs</small>150,000<sup>00</sup>
            </p>
            <h2>Payment Received Successfully</h2>
            <div className="recipient-initials">HN</div>
            <h3>Haji Noor Muhammad</h3>
            <p className="recipient-phone">Noor Beverages · 0344 9549051</p>
            <div className="receipt-actions">
              <button
                onClick={() => {
                  setShowReceiptModal(false)
                  handleNavigate('sales', 'invoices')
                }}
              >
                <FileText />
                <span>View Invoice Record</span>
                <ChevronDown className="rotate-270" />
              </button>
              <button onClick={() => setShowReceiptModal(false)}>
                <CheckCircleIcon />
                <span>Done / Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <path d="m9 11 3 3L22 4"/>
    </svg>
  )
}
