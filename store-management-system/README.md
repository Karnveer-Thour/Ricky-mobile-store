# 🖥️ Ricky Mobile Store — Admin Management Portal

> The internal administration dashboard for Ricky Mobile Store. Manage products, customers, orders, inventory, dispatch tracking, WhatsApp integration, and live support chat — built with Next.js 15, Redux Toolkit, and Material UI.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Redux](https://img.shields.io/badge/Redux%20Toolkit-latest-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tests](https://img.shields.io/badge/tests-Vitest-green)

---

## 📋 Overview

| Property         | Value                           |
| :--------------- | :------------------------------ |
| Framework        | Next.js 15 (App Router)         |
| Language         | TypeScript 5                    |
| State Management | Redux Toolkit + `redux-persist` |
| UI Library       | Material UI (MUI)               |
| Testing          | Vitest + React Testing Library  |
| Dev Port         | `http://localhost:3001`         |

---

## ⚙️ Prerequisites

- Node.js 18+
- npm 9+
- `store_backend` running on `http://localhost:3000` (or configure `NEXT_PUBLIC_API_URL`)

---

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure environment variables
cp .env.example .env.local   # then edit as needed

# 3. Start the development server
npm run dev
# → http://localhost:3001
```

---

## 🌍 Environment Variables

Create a `.env.local` file in the `store-management-system/` directory:

| Variable                         | Default                                           | Description                                      |
| :------------------------------- | :------------------------------------------------ | :----------------------------------------------- |
| `NEXT_PUBLIC_API_URL`            | `http://localhost:3000`                           | Base URL for the NestJS backend API              |
| `NEXT_PUBLIC_APP_TITLE`          | `Ricky Mobile Store Admin`                        | Browser tab title for the portal                 |
| `NEXT_PUBLIC_UPI_SPLIT_PAY_URL`  | `https://upi.rickystore.in/pay/rms-split-pay`     | UPI split-pay link used in support chat replies  |
| `NEXT_PUBLIC_CHECKOUT_RETRY_URL` | `https://rickymobilestore.in/checkout?retry=true` | Checkout retry link used in support chat replies |

---

## 📜 Available Scripts

```bash
npm run dev      # Start dev server with hot-reload (http://localhost:3001)
npm run build    # Compile and export for production
npm run start    # Serve the production build
npm run lint     # Lint all source files (Next.js ESLint config)
npm run format   # Format all files with Prettier
npm run test     # Run all unit tests with Vitest
```

---

## ✨ Admin Features

### 📊 Dashboard

- KPI summary cards (total sales, active orders, low stock alerts)
- Sales trend charts and recent activity feed

### 📱 Products

- Full product catalog CRUD (create, edit, soft-delete)
- Colour variant and quantity management
- Category assignment and pricing controls
- CSV bulk import and export

### 👥 Customers

- Customer account management (view, add, update)
- Customer rating and manual login toggle

### 📦 Orders

- Order listing with status filters
- Order detail view with line items and delivery address
- Link to live dispatch tracking

### 🗺️ Dispatch Tracking

- Live map view of delivery rider locations
- Socket.io-powered real-time position updates

### 🏷️ Inventory

- Stock level monitoring per product variant
- Low-stock alerts and reorder management

### 💬 Chat (Support)

- Admin view of customer support conversations
- Send and receive messages via Socket.io in real-time

### 📲 WhatsApp Integration

- Send order updates and promotional messages via WhatsApp API

### 🏙️ Cities

- Manage the list of cities where delivery is active (accepted cities whitelist)

### 🗂️ Categories

- Create and manage product categories

### 💰 Sales

- Sales history, revenue reports, and EMI transaction records

---

## 🗃️ Redux Store Overview

The portal uses a centralised Redux store with `redux-persist` for session continuity across page reloads.

| Slice      | State Managed                                       |
| :--------- | :-------------------------------------------------- |
| `Auth`     | Admin profile, access token, login state            |
| `Products` | Product list cache for catalog tables               |
| `Orders`   | Active orders, dispatch tracking registry           |
| `DarkMode` | Theme preference (`isDarkMode: boolean`)            |
| `Alert`    | Global toast notification state (type, message, id) |
| `Chat`     | Support chat message streams                        |

---

## 🏗️ Project Structure

```
store-management-system/
├── src/
│   ├── app/
│   │   ├── home/features/        # Feature pages (products, customers, orders, etc.)
│   │   ├── test/setup.ts         # Vitest + jsdom setup
│   │   └── layout.tsx            # Root layout with Redux Provider
│   ├── components/               # Shared UI components (Button, Input, Select, etc.)
│   ├── store/
│   │   ├── index.ts              # Redux store configuration with persist
│   │   └── slices/               # Redux slices (alert, auth, darkmode, etc.)
│   ├── types/                    # TypeScript type definitions
│   └── constants/
│       └── index.ts              # App-wide constants and env var defaults
├── vitest.config.ts              # Vitest configuration
└── tsconfig.json
```

---

## 🧪 Testing

```bash
npm run test     # Run Vitest test suite
```

Tests are located in `src/**/*.spec.ts` files. Current coverage:

- `alert.slice.spec.ts` — Redux alert slice: SUCCESSALERT, ERRORALERT, CLOSEALERT actions

**Current status:** All tests passing ✅

---

## 🔗 Related

- [Backend API](../store_backend/README.md)
- [Customer Storefront](../store-web/README.md)
- [Architecture Docs](../docs/architecture.md)
