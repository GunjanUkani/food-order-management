# 🍕 CraveDash - Food Order Management System

A full-stack, real-time Order Management feature for a food delivery application built with **React + Vite**, an **Express Node.js REST API**, **Server-Sent Events (SSE)** for live order status streaming, and **Vitest** for Test-Driven Development (TDD).

---

## 🌟 Key Features

### 1. 📋 Menu Display
- **Rich Food Catalog**: Pre-seeded with artisanal pizzas, Wagyu burgers, 16-hour bone broth ramen, poke bowls, lava cakes, and craft beverages.
- **Search & Category Filters**: Search by query string or filter by categories (*Pizzas*, *Burgers*, *Asian Noodles*, *Bowls & Salads*, *Desserts*, *Drinks*).
- **Dietary Indicators**: Badges for 🌱 Vegetarian and 🔥 Spicy items, preparation times, and customer ratings.

### 2. 🛒 Order Placement & Cart Management
- **Interactive Cart Drawer**: Real-time quantity modifier (+/-), item removal, itemized pricing breakdown.
- **Dynamic Pricing Engine**: Calculates Subtotal, Tax (8%), and Delivery Fee ($3.99, or **FREE** for orders over $35).
- **Checkout Form & Input Validation**: Real-time inline field validation for Customer Name, Address (min 5 chars), and Phone Number (digits format check).

### 3. ⏱️ Real-Time Order Tracking
- **Live Status Workflow**: Progresses through `ORDER_RECEIVED` → `PREPARING` → `OUT_FOR_DELIVERY` → `DELIVERED`.
- **Server-Sent Events (SSE)**: Streams real-time order status updates from backend to frontend without polling overhead.
- **Simulated GPS Delivery Map**: Visual map interface showing real-time courier movement towards the delivery address.
- **Admin Simulation Controls**: Quick fast-forward status buttons for instant demoing.

### 4. 🧪 Test-Driven Development (TDD)
- **Backend Test Suite**: Supertest + Vitest testing CRUD operations, validation failures (400), 404 handler, status transitions, and query filters.
- **Frontend Test Suite**: React Testing Library + Vitest testing component rendering, cart calculation, form validation errors, and order step indicators.

---

## 🏗️ Architecture Overview

```
                      ┌─────────────────────────────────┐
                      │    React + Vite Front-End       │
                      │    (Port 5173 / Vercel UI)      │
                      └────────────────┬────────────────┘
                                       │
                      REST API & SSE EventSource Stream
                                       │
                      ┌────────────────▼────────────────┐
                      │    Express Node.js Server       │
                      │    (Port 5000 / Node API)       │
                      └────────────────┬────────────────┘
                                       │
                      ┌────────────────▼────────────────┐
                      │    In-Memory Order Store        │
                      │    - Auto-Status Simulator      │
                      │    - Thread-Safe Repositories   │
                      └─────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/food-order-management.git
cd food-order-management

# Install root & workspace dependencies
npm run install:all
```

### 2. Run Application Locally
```bash
# Start both Backend (Port 5000) and Frontend (Port 5173) simultaneously
npm run dev
```
- Frontend UI: `http://localhost:5173`
- Backend REST API: `http://localhost:5000/api/menu`

---

## 🧪 Running the Test Suite (TDD)

```bash
# Run all tests (Backend API + Frontend Components)
npm test

# Run backend API tests only
npm run test:backend

# Run frontend component tests only
npm run test:frontend
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/menu` | Retrieves menu items (supports `?category=` & `?search=`) |
| `GET` | `/api/menu/:id` | Retrieves single menu item details |
| `POST` | `/api/orders` | Places a new order with payload validation |
| `GET` | `/api/orders` | Retrieves all placed orders (latest first) |
| `GET` | `/api/orders/:id` | Retrieves details for a specific order |
| `PATCH` | `/api/orders/:id/status` | Updates order status (`ORDER_RECEIVED` \| `PREPARING` \| `OUT_FOR_DELIVERY` \| `DELIVERED`) |
| `GET` | `/api/orders/:id/stream` | Server-Sent Events (SSE) stream for real-time status updates |

### Sample Payload: `POST /api/orders`
```json
{
  "items": [
    { "menuItemId": "m1", "quantity": 2 },
    { "menuItemId": "m8", "quantity": 1 }
  ],
  "deliveryDetails": {
    "customerName": "Jane Doe",
    "phoneNumber": "+15551234567",
    "address": "742 Evergreen Terrace, Springfield",
    "deliveryNotes": "Leave at front door",
    "paymentMethod": "card"
  }
}
```

---

## 🌍 Hosting & Deployment Guide

### Deploying Frontend to Vercel / Netlify
1. Build the Vite production bundle: `npm --prefix frontend build`.
2. Connect your GitHub repository to Vercel/Netlify with root directory set to `frontend`.
3. Set `VITE_API_BASE_URL` environment variable pointing to your deployed backend URL.

### Deploying Backend to Render / Railway
1. Build TypeScript: `npm --prefix backend build`.
2. Set Start Command: `npm --prefix backend start`.
3. Port defaults to `process.env.PORT` or `5000`.

---

## 📂 Codebase Structure

```
.
├── backend/
│   ├── src/
│   │   ├── data/menuData.ts           # Pre-seeded menu database
│   │   ├── routes/                    # REST & SSE API route handlers
│   │   ├── services/orderStore.ts     # In-memory store & status auto-simulator
│   │   ├── validation/orderValidation.ts # Input validation rules
│   │   ├── app.ts                     # Express app setup
│   │   └── server.ts                  # Server entry point
│   ├── tests/api.test.ts              # TDD Vitest API integration tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/                # Navbar, MenuCard, CartDrawer, CheckoutModal, OrderTracker, Map
│   │   ├── context/CartContext.tsx    # State management for cart & totals
│   │   ├── services/api.ts            # REST client & EventSource SSE listener
│   │   ├── App.tsx                    # Main layout container
│   │   └── main.tsx                   # React root entry point
│   ├── tests/                         # TDD Vitest component test specs
│   └── package.json
├── LOOM_WALKTHROUGH.md                 # 12-15 Min Loom Video Script & AI Usage Report
├── package.json                       # Root script orchestrator
└── README.md
```
