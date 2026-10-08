# 🏭 AL FAROOQ FOODS — Enterprise ERP & POS System

<p align="center">
  <img src="public/al-farooq-foods-logo.png" alt="AL FAROOQ FOODS Logo" width="280" />
</p>

<p align="center">
  <strong>High-Performance, Offline-First Business Management & Point-of-Sale System</strong><br />
  Tailored for Food & Beverage Manufacturers (Juices, Mineral Water, Confectionery & Snacks).
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PWA-100%25_Offline-success?style=flat-square&logo=pwa" alt="PWA" />
  <img src="https://img.shields.io/badge/Theme-Dark%20%2F%20Light-orange?style=flat-square" alt="Theme" />
  <img src="https://img.shields.io/badge/Performance-Optimized-brightgreen?style=flat-square" alt="Performance" />
</p>

---

## 🌟 Executive Overview

**AL FAROOQ FOODS ERP** is a full-featured, enterprise-grade business management and Point-of-Sale platform engineered to operate reliably in industrial plant conditions and retail counter environments. Designed as an **offline-first Progressive Web App (PWA)**, it requires zero continuous internet connectivity to execute sales, update inventory, manage raw materials, track ledgers, and generate thermal receipts or PDF reports.

---

## 🛒 Point of Sale (POS) Counter System

The POS module is built for lightning-fast counter operations, high-volume retail transactions, and wholesale distribution billing.

### Key POS Capabilities:
- **⚡ Rapid Product Lookup & Category Filtering**:
  - Filter instantly by Category (Juices, Mineral Water, Confectionery, Snacks).
  - Search by product title, SKU code, or category in real-time.
- **🛍️ Dynamic Cart & Line Management**:
  - One-click item addition with auto-increment.
  - Granular quantity adjusters, item removal, and auto-computed line totals.
- **⏸️ Hold & Resume Carts (Multi-Customer Queue)**:
  - Park active carts on hold to attend to incoming priority customers.
  - Restore parked orders instantly with zero data loss.
- **👤 Customer & Ledger (Khata) Integration**:
  - Select existing customers (Counter Retail, Wholesaler, Distributor) or register a new customer directly inside the POS without leaving the screen.
  - Automatically records unpaid balances straight to customer ledger accounts.
- **💳 Multi-Mode Payment Processing**:
  - Support for Cash, Bank Transfer, Cheque, and Credit/Khata.
  - Automatic change calculation and discount handling.
- **🧾 Thermal Receipt & PDF Invoicing**:
  - One-click print-ready thermal counter receipts (58mm / 80mm).
  - High-resolution A4 invoice PDF export powered by `jsPDF` and `jspdf-autotable`.
- **📦 Live Stock Validation**:
  - In-stock counters with instant visual warnings when items hit reorder levels.

---

## 🏢 Core System Modules

| Module | Features & Capabilities |
| :--- | :--- |
| **📊 Dashboard** | Real-time financial metrics (Revenue, Receivables, Payables, Net Profit), quick action shortcuts, production charts, and low-stock alerts. |
| **🛒 Point of Sale (POS)** | Touch-friendly counter checkout, hold/park cart, barcode/product search, split payments, and thermal receipt printing. |
| **💼 Sales & Invoices** | Invoice generation, history log, payment tracking, return processing, and wholesale consignment management. |
| **👥 Customer Management** | Directory of Retailers, Wholesalers, Distributors, ledger balances (Udhaar / Khata), transaction history, and phonebook directory. |
| **🚚 Purchases & Expenses** | Supplier raw-material purchase records, operating expense tracking, payment vouchers, and expense categorizations. |
| **🏭 Suppliers Hub** | Comprehensive vendor database, procurement history, pending payables, and contact cards. |
| **📦 Products & Catalog** | Finished goods management, unit pricing, SKU codes, carton/bottle packaging specs, and SVG category illustrations. |
| **🧪 Raw Materials Warehouse** | 14 industrial raw materials cards with high-definition imagery (PET Preforms, Sugar, Flavors, Crowns, Citric Acid, Packaging Films, etc.), minimum threshold warnings, and reorder triggers. |
| **👷 Employees & Payroll** | Staff directory, wage/salary processing, advance payment tracking, roles, and attendance records. |
| **📈 Reports & Analytics** | Daily summaries, Profit & Loss statements, Cash & Bank flows, Tax summaries, and customizable PDF reports. |
| **⚙️ Settings & Backups** | Full offline JSON database backup & restore, factory reset, owner profile toggle, and company branding customization. |

---

## 🚀 Performance & Technical Architecture

- **Next.js Dynamic Code-Splitting (`next/dynamic`)**:
  All heavy modules (POS, Reports, Purchases, Employees, Settings) are code-split into lazy-loaded chunks. The initial page bundle loads in milliseconds.
- **Hover Preloading**:
  Sidebar navigation triggers background prefetching on mouse hover, delivering instant transitions when tabs are clicked.
- **100% Offline PWA (`sw.js`)**:
  Full service worker cache (`al-farooq-foods-v3`) pre-caches core assets, logos, product graphics, and all 14 industrial raw-material photos.
- **Zero-Flash Theme Engine**:
  High-contrast Dark and Light modes powered by an inline initialization script to eliminate theme flicker.
- **Persistent Offline Storage**:
  State-of-the-art `localStorage` database sync with JSON backup export and import safeguards.

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.18.0 or newer recommended)
- `npm` or `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/al-farooq-foods-erp.git
   cd al-farooq-foods-erp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Build & Deployment

### Build Locally
To test an optimized production bundle:
```bash
npm run build
npm start
```

### Deploy to Vercel
Deploying to [Vercel](https://vercel.com/) is effortless:
1. Push your repository to GitHub.
2. Import the project into your Vercel Dashboard.
3. Deploy with default Next.js settings (Build command: `npm run build`, Output: `.next`).

Or deploy via terminal:
```bash
npx vercel --prod
```

---

## 🔒 Security & Data Privacy

All business data is stored locally within the browser's persistent storage engine. No proprietary factory records, sales figures, or supplier contracts are transmitted to unverified external servers.

---

## 📄 License

Proprietary — Developed exclusively for **AL FAROOQ FOODS**. All rights reserved.
