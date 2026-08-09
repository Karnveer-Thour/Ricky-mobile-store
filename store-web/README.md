# 🛒 Ricky Mobile Store — Customer Storefront

> The customer-facing shopping experience for Ricky Mobile Store. Browse the product catalog, manage your cart and wishlist, track live order delivery, calculate EMI installments, and chat with support — all in a modern React + Vite application.

![Vite](https://img.shields.io/badge/Vite-6-purple)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tests](https://img.shields.io/badge/tests-Vitest-green)

---

## 📋 Overview

| Property | Value |
|:---|:---|
| Framework | React 18 + Vite 6 |
| Language | TypeScript 5 |
| State Management | React Context API (`AppContext`) |
| Routing | React Router v6 |
| Testing | Vitest + React Testing Library |
| Dev Port | `http://localhost:5173` |

---

## ⚙️ Prerequisites

- Node.js 18+
- npm 9+
- `store_backend` running on `http://localhost:3000` (or configure `VITE_API_URL`)

---

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Set the backend URL if not running on default port
echo "VITE_API_URL=http://localhost:3000" > .env

# 3. Start the development server
npm run dev
# → http://localhost:5173
```

---

## 🌍 Environment Variables

Create a `.env` file in the `store-web/` directory:

| Variable | Default | Description |
|:---|:---|:---|
| `VITE_API_URL` | `http://localhost:3000` | Base URL for the NestJS backend API |

---

## 📜 Available Scripts

```bash
npm run dev      # Start dev server with hot-reload (http://localhost:5173)
npm run build    # Compile and bundle for production (outputs to dist/)
npm run test     # Run all unit and component tests with Vitest
```

---

## ✨ Key Features

### 🛍️ Product Catalog
- Browse all mobile phones and smart watches
- Filter and sort by category, price, and availability
- View detailed product pages with colour variant selection and image gallery

### 🛒 Cart & Checkout
- Add products to cart with quantity control
- Slide-out cart panel with live item count badge
- EMI installment calculator on product detail and checkout pages
- Clear cart or adjust quantities at any time

### ❤️ Wishlist
- Toggle products in/out of a personal wishlist
- Wishlist persists across the current session via AppContext

### 📦 Live Order Tracking
- Enter an order ID to track delivery on a live map
- Real-time location updates via Socket.io connection to backend

### 💬 Support Chat
- In-app chat widget connecting to the backend support system
- Canned welcome message on first load; agent response simulation

### ⭐ Product Reviews
- View customer star ratings (1–5) and written reviews on product detail pages
- Submit a review (authenticated users)

---

## 🏗️ Project Structure

```
store-web/
├── src/
│   ├── app/
│   │   ├── AppContext.tsx        # Global state: cart, wishlist, chat, order tracking
│   │   ├── AppContext.spec.tsx   # Component integration tests
│   │   └── test/setup.ts        # Vitest + jsdom setup
│   ├── pages/
│   │   ├── CatalogPage.tsx      # Product listing page
│   │   ├── ProductDetailPage.tsx # Product detail with EMI widget
│   │   └── CheckoutPage.tsx     # Checkout flow
│   ├── components/              # Shared UI components
│   └── data/
│       └── data.ts              # Static product seed data
├── vite.config.ts               # Vite + Vitest configuration
└── tsconfig.json
```

---

## 🧪 Testing

```bash
npm run test     # Run Vitest test suite
```

Tests are located in `src/**/*.spec.tsx` files. The main test suite covers:
- `AppContext` — cart operations, wishlist toggle, order tracking state, support chat with timer mocks

**Current status:** All tests passing ✅

---

## 🔗 Related

- [Backend API](../store_backend/README.md)
- [Admin Portal](../store-management-system/README.md)
- [Architecture Docs](../docs/architecture.md)