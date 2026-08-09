# 🔧 Ricky Mobile Store — Backend API

> NestJS REST API powering the Ricky Mobile Store platform. Provides product catalog management, order processing, customer authentication, live dispatch tracking via Socket.io, and a support chat system.

![Tests](https://img.shields.io/badge/tests-22%20passed-brightgreen)
![NestJS](https://img.shields.io/badge/NestJS-11-red)
![TypeORM](https://img.shields.io/badge/TypeORM-SQLite%20%2F%20PostgreSQL-blue)

---

## 📋 Overview

| Property | Value |
|:---|:---|
| Framework | NestJS 11 (TypeScript) |
| ORM | TypeORM |
| Databases | SQLite (dev) · PostgreSQL (prod) |
| Auth | Firebase Admin SDK (bearer JWT guard) |
| Real-time | Socket.io |
| Docs | Swagger/OpenAPI 3.0 at `/api-docs/v1` |
| Default Port | `3000` |

---

## ⚙️ Prerequisites

- Node.js 18+
- npm 9+
- SQLite (zero config, default) **or** PostgreSQL 14+ for production

---

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your local environment file
cp .env.example .env

# 3. Start in watch mode (SQLite by default)
npm run start:dev
```

---

## 🌍 Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Default | Description |
|:---|:---|:---|
| `PORT` | `3000` | HTTP server port |
| `DB_TYPE` | _(unset = sqlite)_ | `sqlite` or `postgres` |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USERNAME` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `DB_DATABASE` | `ricky_mobile_store` | Database name / SQLite file path |
| `DB_SYNCHRONIZE` | `true` | Auto-sync schema (disable in prod) |
| `DB_LOGGING` | `false` | Enable TypeORM query logging |
| `JWT_SECRET` | _(required)_ | JWT signing secret |
| `PASSWORD_PEPPER` | _(required)_ | Bcrypt pepper for password hashing |
| `TYPE` | `service_account` | Firebase credential type |
| `PROJECT_ID` | _(required for auth)_ | Firebase project ID |
| `PRIVATE_KEY_ID` | _(required for auth)_ | Firebase private key ID |
| `PRIVATE_KEY` | _(required for auth)_ | Firebase RSA private key (PEM) |
| `CLIENT_EMAIL` | _(required for auth)_ | Firebase service account email |
| `CLIENT_ID` | _(required for auth)_ | Firebase client ID |

> **SQLite quick start**: Leave `DB_TYPE` unset. The database file will be created automatically at `ricky_mobile_store.sqlite` in the project root.

---

## 📜 Available Scripts

```bash
npm run start        # Start in production mode
npm run start:dev    # Start with hot-reload (watch mode)
npm run start:prod   # Start compiled dist/main.js
npm run build        # Compile TypeScript to dist/
npm run test         # Run all unit tests (Jest)
npm run test:watch   # Run tests in watch mode
npm run test:cov     # Generate test coverage report
npm run lint         # Lint and auto-fix source files
npm run format       # Format source files with Prettier
```

---

## 🗄️ Database Configuration

The API resolves its DB connection dynamically via [`typeORM.config.ts`](./src/Database/typeORM.config.ts):

| Environment | Config |
|:---|:---|
| `DB_TYPE=sqlite` (or unset) | Uses SQLite file — no server required. Ideal for local dev and CI. |
| `DB_TYPE=postgres` | Connects to PostgreSQL using host/port/username/password from `.env`. |

`DB_SYNCHRONIZE=true` auto-applies schema changes. **Set to `false` in production** and use TypeORM migrations instead.

---

## 📡 REST API Reference

Full interactive docs at: **`http://localhost:3000/api-docs/v1`**

### User
| Method | Path | Description |
|:---|:---|:---|
| `POST` | `/user/register` | Register new customer account |
| `POST` | `/user/login` | Authenticate and receive JWT |
| `GET` | `/user/:id` | Get user profile |
| `PATCH` | `/user/:id` | Update user profile |

### Products
| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/product` | List products (paginated) |
| `POST` | `/product` | Create a new product |
| `GET` | `/product/:id` | Get product detail |
| `PATCH` | `/product/:id` | Update product |
| `DELETE` | `/product/:id` | Soft-delete product |
| `GET` | `/product/download-csv` | Export product catalog as CSV |
| `POST` | `/product/upload-csv` | Bulk import products from CSV |

### Product Reviews
| Method | Path | Description |
|:---|:---|:---|
| `POST` | `/product-review` | Submit a review with star rating (1–5) |
| `GET` | `/product-review` | List all reviews (paginated) |
| `PATCH` | `/product-review/:id` | Update a review |
| `DELETE` | `/product-review/:id` | Soft-delete a review |

### Orders
| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/orders` | List orders |
| `POST` | `/orders` | Create a new order |
| `GET` | `/orders/:id` | Get order detail |
| `PATCH` | `/orders/:id/location` | Update live dispatch location |

### Categories
| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/category` | List all categories |
| `POST` | `/category` | Create category |
| `PATCH` | `/category/:id` | Update category |
| `DELETE` | `/category/:id` | Delete category |

### Delivery Addresses
| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/delivery-address` | List saved delivery addresses |
| `POST` | `/delivery-address` | Save a delivery address |
| `DELETE` | `/delivery-address/:id` | Remove a delivery address |

### Accepted Cities
| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/accepted-cities` | List cities where delivery is active |
| `POST` | `/accepted-cities` | Add a city to the delivery whitelist |
| `DELETE` | `/accepted-cities/:id` | Remove a city |

---

## 🔌 Socket.io Events

The server exposes a Socket.io namespace for real-time support chat and live order tracking.

| Event | Direction | Payload | Description |
|:---|:---|:---|:---|
| `join-room` | client → server | `{ roomId: string }` | Join a support chat room |
| `message` | client → server | `{ roomId, text, sender }` | Send a chat message |
| `message` | server → client | `{ text, sender, timestamp }` | Receive a broadcast message |

---

## 🔒 Authentication

Protected endpoints use `FirebaseAuthGuard`. Pass a Firebase-issued bearer token in the `Authorization` header:

```
Authorization: Bearer <firebase-id-token>
```

For local development without Firebase, the guard can be set to mock mode in `app.module.ts`.

---

## 🧪 Testing

```bash
npm run test        # Run all 22 unit tests across 21 suites
npm run test:cov    # Generate coverage report in /coverage
```

**Current test status:** 22 / 22 passing ✅

All service classes are tested with mocked TypeORM repositories. No database connection is required to run tests.

---

## 📦 Module Overview

| Module | Responsibility |
|:---|:---|
| `User` | Registration, login, profile management |
| `Product` | Catalog CRUD, CSV import/export |
| `ProductReview` | Customer reviews with 1–5 star rating |
| `Category` | Product categorisation |
| `Order` | Order lifecycle management |
| `DeliveryAddress` | Customer shipping address storage |
| `AcceptedCities` | Delivery area whitelist |
| `Banks` | Bank/payment method reference data |
| `Sale` | Sales record tracking |
| `Chat` | Socket.io-powered support chat |
| `Global` | Cross-cutting utilities (health check, etc.) |
