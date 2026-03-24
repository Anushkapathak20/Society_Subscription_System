# Society Subscription System

A robust and modern residential society management platform designed to streamline maintenance tracking, resident communication, and financial operations.

## Overview

The **Society Subscription System** simplifies the complexities of managing a residential society. It provides a centralized hub for administrators to manage flats and residents, while offering residents a seamless interface to track subscriptions, make payments, and stay updated with notifications.

## Key Features

- ** Secure Authentication**: Multi-layered auth with Google OAuth 2.0, JWT, and **Role-based Access Control (RBAC)**.
- ** Dedicated Dashboards**: Tailored experiences for both Admins and Residents.
- ** Payment Entry**: specialized interface for Admins to manually enter and track on-gound payments.
- ** Flat & Resident Management**: Comprehensive tools for adding, updating, and viewing society data.
- ** Instant Receipts**: PDF generation for all successful payments using `jsPDF`.
- ** Real-time Analytics**: Visualized financial data and subscription trends using `Chart.js`.
- ** Smart Notifications**: Push notifications powered by **Firebase Cloud Messaging (FCM)** for timely updates.
- ** Automated Maintenance**: Efficient tracking of monthly maintenance fees and historical records.

##  Technology Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State/Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Visuals**: [Lucide React](https://lucide.dev/), [Chart.js](https://www.chartjs.org/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5.2](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Security**: [Passport.js](https://www.passportjs.org/), [JWT](https://jwt.io/), [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Messaging**: [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

## Project Structure

```bash
society-subscription-system/
├── backend/            # Express Application (API & Business Logic)
│   ├── config/         # Database and Passport configurations
│   ├── controllers/    # API request handlers
│   ├── middleware/     # Auth and validation guards
│   ├── models/         # Database schemas and queries (pg)
│   └── routes/         # Endpoint definitions
└── frontend/           # Next.js Application (Client Interface)
    ├── app/            # App router pages and layouts
    ├── components/     # Reusable UI components
    └── utils/          # Frontend utility functions
```

---

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- Firebase Project (for notifications)
- Google Cloud Project (for OAuth)
- Razorpay Account (for payments)

### 1. Clone the Repository
```bash
git clone https://github.com/Anushkapathak20/Society_Subscription_System.git
cd Society_Subscription_System
```

### 2. Configure Backend
- Navigate to the `backend` directory: `cd backend`.
- Install dependencies: `npm install`.
- Create a `.env` file and populate the following:
  ```env
  PORT=5000
  DB_USER=your_user
  DB_HOST=localhost
  DB_NAME=society_db
  DB_PASSWORD=your_password
  DB_PORT=5432
  GOOGLE_CLIENT_ID=your_google_id
  GOOGLE_CLIENT_SECRET=your_google_secret
  FRONTEND_URL=http://localhost:3000
  JWT_SECRET=your_jwt_secret
  FIREBASE_PROJECT_ID=your_fcm_id
  FIREBASE_CLIENT_EMAIL=your_fcm_email
  FIREBASE_PRIVATE_KEY=your_fcm_key
  ```
- Start the server: `npm run dev`.

### 3. Configure Frontend
- Navigate to the `frontend` directory: `cd ../frontend`.
- Install dependencies: `npm install`.
- Create a `.env.local` file and populate the following:
  ```env
  GOOGLE_CLIENT_ID=your_google_id
  GOOGLE_CLIENT_SECRET=your_google_secret
  NEXTAUTH_SECRET=your_auth_secret
  NEXTAUTH_URL=http://localhost:3000
  NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
  NEXT_PUBLIC_FIREBASE_API_KEY=your_fcm_api_key
  NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_fcm_vapid_key
  # ... other Firebase Public keys
  ```
- Start the application: `npm run dev`.

---
