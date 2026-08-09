# Ricky Mobile Store Project Context

This document provides a consolidated system overview, detailing the technology stacks, directory structures, and entry points for all three main components of the Ricky Mobile Store.

---

## Workspace Components

The project consists of three main sub-projects:

```
Ricky-mobile-store/
├── store_backend/             # NestJS Backend API Service
├── store-web/                 # Vite + React Client Storefront
└── store-management-system/   # Next.js Admin Panel Portal
```

---

## 1. Backend Service (`store_backend`)

A progressive Node.js API service built with **NestJS** and **TypeScript** to serve storefront data, process transactions, and manage user assets.

*   **Port**: Run on port `8001` (by default configured in [store_backend/.env](file:///c:/Users/karan/OneDrive/Desktop/Ricky-mobile-store/store_backend/.env)).
*   **Technologies**:
    *   **Framework**: NestJS (v11)
    *   **Database ORM**: TypeORM (v0.3)
    *   **Database Types**: Supporting SQLite (default for development/local testing) and PostgreSQL (for production).
    *   **Security & Auth**: Firebase Admin SDK (auth, verification), JWT, bcrypt.
    *   **Documentation**: Swagger API docs available at `/api-docs/v1`.
*   **Core Directory Structure**:
    *   `src/main.ts` — Server entry point and configuration (CORS, Global Pipes, Swagger).
    *   `src/app.module.ts` — Root application module importing core features and providers.
    *   `src/Database/` — TypeORM configuration and data source definitions.
    *   `src/Core/` — Gateways, Guards, Swagger, and Firebase integration.
    *   `src/Modules/` — Domain modules: `User`, `Product`, `Category`, `Chat`, `Cart`, `Wishlist`, `Payment`, `Sale` (Orders), `Accepted_cities`.

---

## 2. Customer Storefront (`store-web`)

A high-performance single page application (SPA) client storefront allowing customers to browse mobile phones, add to cart, and chat with customer support.

*   **Port**: Runs on port `5173`.
*   **Technologies**:
    *   **Framework**: React (v18)
    *   **Build System**: Vite (v6)
    *   **Styling**: TailwindCSS (v4) with Custom Shadcn and MUI themes.
    *   **Routing**: React Router (v7)
*   **Core Directory Structure**:
    *   `src/main.tsx` — Client entry point.
    *   `src/app/App.tsx` — Root component layout and routes definition.
    *   `src/app/AppContext.tsx` — Context provider managing global storefront states (cart, wishlist, chat message cache).
    *   `src/app/services/` — Axios/Fetch service communicating with the backend.

---

## 3. Admin Panel (`store-management-system`)

An administration portal for store operators to manage inventory, track rider locations, review user activities, and handle support chats.

*   **Port**: Runs on port `3001`.
*   **Technologies**:
    *   **Framework**: Next.js (v15) using React (v19)
    *   **State Management**: Redux Toolkit (RTK) with `redux-persist`.
    *   **Styling**: Material UI (MUI), TailwindCSS.
*   **Core Directory Structure**:
    *   `src/app/layout.tsx` — Next.js layout bootstrap.
    *   `src/app/auth/` — Login and register portals.
    *   `src/app/home/` — Admin workspace pages (dashboard, products, orders, chat features).
    *   `src/store/` — Redux store configuration and slices (`app`, `auth`, `products`, `orders`, `chat`).
    *   `src/services/` — Frontend fetch services for admin API interactions.

---

## Integration Interfaces & Communication

*   **Rest API**: Client storefronts communicate with the NestJS backend via HTTP REST endpoints (e.g. `GET /product`, `POST /orders`, `POST /user/login`).
*   **Real-time Socket Gateways**: Live chat messages and real-time rider tracking are synchronized via Socket.io channels handled by the backend `GatewayModule`.
*   **Firebase Authentication**: Firebase is used to secure client/admin credentials and verify session identity tokens.
