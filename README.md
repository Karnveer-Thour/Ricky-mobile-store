# 🛍️ Ricky Mobile Store

> A full-stack e-commerce platform for mobile devices — built with a NestJS API, a React/Vite customer storefront, and a Next.js admin management portal.

![Backend Tests](https://img.shields.io/badge/backend%20tests-22%20passed-brightgreen)
![Sprint](https://img.shields.io/badge/sprint--1-in%20progress-blue)
![BMAD Score](https://img.shields.io/badge/BMAD%20score-10%2F10-gold)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## 📁 Monorepo Structure

```
Ricky-mobile-store/
├── store_backend/           # NestJS REST API + Socket.io (port 3000)
├── store-web/               # React + Vite customer storefront (port 5173)
├── store-management-system/ # Next.js admin management portal (port 3001)
├── docs/
│   └── architecture.md      # Full system architecture documentation
├── _bmad-output/            # BMAD planning artifacts (PRD, spec, epics, sprint)
└── project-context.md       # High-level project context for AI agents
```

---

## 🧰 Tech Stack

| Layer | Technology |
|:---|:---|
| API | NestJS, TypeORM, SQLite / PostgreSQL, Socket.io, Swagger |
| Storefront | React 18, Vite, TypeScript, React Router |
| Admin Portal | Next.js 15, Redux Toolkit, Material UI, TypeScript |
| Auth | Firebase Admin SDK (JWT bearer token guard) |
| Testing | Jest (backend), Vitest + RTL (frontend), Playwright (E2E) |

---

## ⚙️ Prerequisites

- **Node.js** 18+ and **npm** 9+
- **SQLite** (default, no setup needed) or **PostgreSQL** 14+ for production
- A Firebase service account JSON (for auth-guarded endpoints — optional in dev)

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repo-url>
cd Ricky-mobile-store
```

### 2. Start the API backend
```bash
cd store_backend
npm install
cp .env.example .env          # Edit DB_TYPE and JWT_SECRET as needed
npm run start:dev             # Starts on http://localhost:3000
```

### 3. Start the customer storefront
```bash
cd store-web
npm install
npm run dev                   # Starts on http://localhost:5173
```

### 4. Start the admin management portal
```bash
cd store-management-system
npm install
npm run dev                   # Starts on http://localhost:3001
```

> **Swagger API docs** are available at `http://localhost:3000/api-docs/v1` once the backend is running.

---

## 📦 Sub-project READMEs

| Project | README | Description |
|:---|:---|:---|
| `store_backend` | [README](./store_backend/README.md) | NestJS API — endpoints, env vars, DB config, Socket.io |
| `store-web` | [README](./store-web/README.md) | Customer storefront — features, scripts, env vars |
| `store-management-system` | [README](./store-management-system/README.md) | Admin portal — features, Redux slices, scripts |

---

## 📐 Architecture

Full system architecture is documented in [`docs/architecture.md`](./docs/architecture.md), covering:
- Dual database configuration (SQLite ↔ PostgreSQL)
- REST API routing and module layout
- Client state management (React Context / Redux)
- Security guardrails and Firebase Auth
- Testing strategy (3-tier pyramid)

---

## 🧪 Running Tests

```bash
# Backend unit tests (22 tests, 21 suites)
cd store_backend && npm run test

# Storefront component tests
cd store-web && npm run test

# Admin portal Redux slice tests
cd store-management-system && npm run test
```

---

## 📊 Project Status

| Metric | Status |
|:---|:---|
| BMAD Methodology Score | **10 / 10** ✅ |
| Sprint 1 Stories | 11 total · 3 done · 7 in review · 1 ready-for-dev |
| Backend Test Suite | **22 / 22 passing** ✅ |
| Documentation | PRD · Spec · Architecture · Epics · Sprint Status |

---

## 📄 License

This project is [MIT licensed](./LICENSE).
