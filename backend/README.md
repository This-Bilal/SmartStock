# SmartStock

> **Manage Your Stock. Grow Your Business.**

SmartStock is a full-stack inventory and sales management platform designed for small businesses. It helps business owners manage products, track inventory, record sales, manage employees, view reports, and manage subscriptions from one platform.

---

## Features

* Secure authentication with JWT and HTTP-only cookies
* Owner and employee management
* Role-based access for Owners, Managers, and Cashiers
* Product and inventory management
* Inventory movement and history tracking
* Sales management and sale lookup
* Sales and profit reports
* Subscription management
* Paystack payment integration
* Paystack webhook payment verification
* Subscription-based feature restrictions
* Responsive design for mobile, tablet, and desktop

---

## Subscription Plans

SmartStock uses a simple plan-based subscription model.

| Plan      | Products  | Employees | Sale details and inventory |
| --------- | --------- | --------- | -------------------------- |
| **Free**  | 20        | 2         | No                         |
| **Basic** | 100       | 4         | Yes                        |
| **Pro**   | Unlimited | Unlimited | Yes                        |

### Pricing

* **Free** — ₦0
* **Basic** — ₦1,500 / 30 days
* **Pro** — ₦2,000 / 30 days

Paid subscriptions are processed through Paystack.

---

## User Roles

### Owner

Full access to business management, employees, inventory, sales, reports, and subscriptions.

### Manager

Access to operational business features based on assigned permissions.

### Cashier

Primarily responsible for recording and managing sales.

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* React Icons

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

### Payments

* Paystack

---

## Architecture

SmartStock uses a service-based full-stack architecture.

Frontend
React + Vite + Tailwind
        |
        v
API Services
        |
        v
Express REST API
        |
        v
Controllers / Services
        |
        v
MongoDB
```

The frontend keeps API endpoints centralized in its API configuration and uses separate service files for API communication and data transformation.

---

## Authentication and Security

SmartStock uses:

* JWT authentication
* HTTP-only cookies
* Role-based authorization
* Backend subscription checks
* Password hashing
* Business data isolation
* Paystack webhook signature verification

Premium features are protected on the backend and cannot be unlocked simply by bypassing frontend restrictions.

---

## Inventory Management

SmartStock allows businesses to:

* Add products
* Add stock
* Remove stock
* Update stock
* Track inventory movements
* Monitor low-stock products
* Identify out-of-stock products

Inventory history records information such as the product, movement type, quantity, previous and current stock, employee, reason, sale number, date, and time.

---

## Sales Management

SmartStock allows employees to record sales and automatically connect sales with inventory movements.

Each sale receives a unique sale number.

Sale
 |
 v
Inventory Updated
 |
 v
Stock Movement Recorded
```

---

## Payments and Subscriptions

SmartStock integrates with Paystack for subscription payments.

Payment flow:

Select Plan
    |
    v
Initialize Payment
    |
    v
Paystack
    |
    v
Payment Verification / Webhook
    |
    v
Subscription Updated
```

Paystack webhooks are verified using an HMAC SHA-512 signature before payment events are processed.

---

## Reports

SmartStock provides business reports including:

* Daily sales
* Weekly sales
* Monthly sales
* Profit analysis
* Inventory activity

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd smartstock
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file containing your database, JWT, Paystack, and application configuration. Copy the email settings from `.env.example` and configure Brevo transactional email:

| Variable | Default / purpose |
| -------- | ----------------- |
| `BREVO_API_KEY` | Brevo API key used with its transactional email REST API |
| `EMAIL_FROM` | Sender address verified in Brevo; required in production |
| `EMAIL_FROM_NAME` | Display name for the sender; defaults to `SmartStock` |
| `FRONTEND_URL` | Public frontend base URL used to create password-reset links; set to `http://localhost:5173` locally and your Vercel frontend URL in Render |
| `EMAIL_VERIFICATION_URL` | Frontend verification page; defaults to the deployed SmartStock verification page. Set this to `http://localhost:5173/verify-email` for local testing or to your own deployed frontend URL. |

In Brevo, create an API key and verify the sender address or domain before using it. Set `BREVO_API_KEY` and the verified `EMAIL_FROM` address in the backend environment (including Render for deployment); never commit the key. Email delivery is disabled with a development-mode notice when the API key is absent in development. Owner registration and employee creation send a verification link that expires after 24 hours; unverified accounts cannot log in. Opening a valid verification link verifies the address and signs the account in. Users can request a replacement link from the login page. Never commit real credentials.

When deploying a custom frontend, set `EMAIL_VERIFICATION_URL` to its public URL ending in `/verify-email`.

Password reset requests use `POST /api/loginStatus/forgot-password` with an email and `accountType` (`owner` or `employee`); password resets use `POST /api/loginStatus/reset-password` with the emailed token and a new password. Reset tokens are stored as SHA-256 hashes and expire after 20 minutes. Configure `FRONTEND_URL` in the backend environment (including Render) so reset links open the correct Vercel frontend. Passwords must be 8–72 characters and fit bcrypt's 72-byte input limit. Password changes do not revoke JWT cookies already issued to signed-in users.

### 4. Start the backend

```bash
npm run dev
```

### 5. Install frontend dependencies

```bash
cd frontend
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

---

## Responsive Design

SmartStock is built with responsive layouts that adapt to:

* Mobile
* Tablet
* Laptop
* Desktop

Tailwind CSS responsive utilities are used for adaptive containers, typography, spacing, tables, cards, forms, and navigation.

---

## Future Improvements

Potential future features include:

* Multi-branch management
* Customer management
* Supplier management
* Advanced analytics
* Notifications
* Inventory forecasting
* AI-powered business insights/ sales prediction
* Barcode scanner
* QR code generation
* payment gateway integration

---

## Project Status

**SmartStock MVP — Complete**

The MVP includes the core systems required for inventory, sales, employee, reporting, subscription, and payment management.

---

## License

This project is currently proprietary/private.

---

# SmartStock

> **Manage your inventory. Track your sales. Grow your business.**
