# Vahan.Rentals - Full Backend Service 🚀

Production-grade, modular Node.js & Express backend for **Vahan.Rentals** powered by **Turso DB (LibSQL)** for serverless SQLite database and **Firebase Authentication & Admin SDK** for user management and OTPs.

---

## 📑 Table of Contents
1. [Architecture & Features](#architecture--features)
2. [Step-by-Step Turso DB Setup Guide](#step-by-step-turso-db-setup-guide)
3. [Step-by-Step Firebase Setup Guide](#step-by-step-firebase-setup-guide)
4. [Database Schema & Tables](#database-schema--tables)
5. [Installation & Local Setup](#installation--local-setup)
6. [API Endpoints Reference](#api-endpoints-reference)

---

## 🏗 Architecture & Features

- **Database**: [Turso DB](https://turso.tech) (LibSQL) - ultra-fast serverless SQLite with edge replication.
- **Authentication & OTP**: Firebase Authentication (Email/Password, Phone OTP, Google Sign-In) validated securely on the backend with `firebase-admin`.
- **Fleet Management**: CRUD operations for Bikes, Scooties, Luxury Cars, and Adventure Experiences across Rishikesh, Dehradun, and Uttarakhand.
- **Reservations & Bookings**: Complete booking lifecycle with pricing calculation, security deposit, token payment, and payment gateway status tracking.
- **Host & Partner Portal**: Himalayan fleet host profiles, earnings dashboard, and ride registration.
- **Reviews & Inquiries**: Customer ratings, verified review aggregation, and contact form handling.

---

## 🛠 Step-by-Step Turso DB Setup Guide

### Method 1: Using the Turso CLI (Recommended)

1. **Install Turso CLI**:
   - On macOS / Linux:
     ```bash
     brew install tursodatabase/tap/turso
     # or
     curl -sSfL https://get.tur.so/install.sh | bash
     ```
   - On Windows (PowerShell):
     ```powershell
     irm https://get.tur.so/install.ps1 | iex
     ```

2. **Authenticate with Turso**:
   ```bash
   turso auth signup
   # or if you already have an account:
   turso auth login
   ```

3. **Create your Vahan database**:
   ```bash
   turso db create vahan-rentals
   ```

4. **Retrieve Database Connection URL**:
   ```bash
   turso db show --url vahan-rentals
   # Output example: libsql://vahan-rentals-yourname.turso.io
   ```

5. **Generate an Auth Token**:
   ```bash
   turso db tokens create vahan-rentals
   # Output: A long JWT token string
   ```

6. **Add to `.env`**:
   ```env
   TURSO_DATABASE_URL=libsql://vahan-rentals-yourname.turso.io
   TURSO_AUTH_TOKEN=your_generated_jwt_token_here
   ```

### Method 2: Using the Turso Web Dashboard

1. Visit [https://turso.tech](https://turso.tech) and sign in.
2. Click **Create Database**, name it `vahan-rentals`, and choose your nearest region (e.g. `BOM` - Mumbai or `SIN` - Singapore).
3. Copy the **Database URL** and click **Generate Token** to copy the **Auth Token**.
4. Paste both into your backend `.env` file.

> **💡 Offline Local Development Note**: If you run without Turso credentials, the backend automatically falls back to a local SQLite database (`file:local_vahan.db`), allowing full offline local testing immediately!

---

## 🔥 Step-by-Step Firebase Setup Guide

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `vahan-rentals` (or your preferred name).
3. Follow the prompts (Google Analytics is optional) and click **Create Project**.

### 2. Enable Authentication Providers
1. In the left navigation menu, go to **Build** -> **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab:
   - **Email/Password**: Enable `Email/Password` and `Email link (passwordless sign-in)` if desired.
   - **Phone**: Enable Phone authentication to support SMS OTP verification.
   - **Google**: (Optional) Enable Google Sign-In for 1-click login.

### 3. Generate Backend Service Account Key (Firebase Admin SDK)
1. Go to **Project Settings** (gear icon next to Project Overview) -> **Service accounts** tab.
2. Ensure **Node.js** is selected.
3. Click **Generate new private key**, then click **Generate key**.
4. A `.json` file will download to your computer.
5. Rename this file to `serviceAccountKey.json` and place it inside the `full-backend/` directory.
   *(The backend is already configured to read `./serviceAccountKey.json` automatically!)*

### 4. Get Frontend Client Config
1. In **Project Settings** -> **General** tab, scroll down to **Your apps**.
2. Click the Web icon `</>` to register a web app.
3. Copy the `firebaseConfig` object and add it to your frontend `.env` or `src/config/firebase.js`.

---

## 🗄 Database Schema & Tables

The database uses 6 normalized tables with foreign keys and performance indexes:

### 1. `profiles`
| Column | Type | Description |
|---|---|---|
| `id` | `TEXT PRIMARY KEY` | Firebase UID |
| `email` | `TEXT UNIQUE NOT NULL` | User email address |
| `full_name` | `TEXT` | Full display name |
| `phone` | `TEXT` | Contact phone number |
| `driving_license` | `TEXT` | DL number / verification ID |
| `role` | `TEXT` | `user`, `partner`, or `admin` |
| `avatar_url` | `TEXT` | Profile avatar URL |
| `kyc_status` | `TEXT` | `pending`, `verified`, or `rejected` |
| `created_at` / `updated_at` | `TEXT` | Timestamps |

### 2. `vehicles`
| Column | Type | Description |
|---|---|---|
| `id` | `TEXT PRIMARY KEY` | Unique slug/ID (e.g. `re-himalayan-450`) |
| `title` | `TEXT NOT NULL` | Vehicle/Experience title |
| `category` | `TEXT NOT NULL` | `Bike`, `Scooty`, `Car`, `Experience` |
| `item_type` | `TEXT` | `Bike`, `Car`, or `Experience` |
| `reg_no` | `TEXT` | Registration plate number |
| `price` | `REAL NOT NULL` | Daily base price in INR |
| `daily_rate` / `weekly_rate` / `monthly_rate` | `TEXT` | Display rate strings |
| `location` | `TEXT NOT NULL` | Pickup hub location |
| `status` | `TEXT` | `Available`, `Rented`, `Under Maintenance`, `Booked` |
| `image` | `TEXT NOT NULL` | Vehicle image URL |
| `rating` / `reviews` | `REAL` / `INT` | Aggregated rating & review count |
| `description` | `TEXT` | Detailed vehicle description |
| `hosted_by` / `host_phone` | `TEXT` | Host partner details |
| `specs` / `included` / `requirements` / `faqs` | `TEXT (JSON)` | Structured vehicle metadata |
| `created_at` / `updated_at` | `TEXT` | Timestamps |

### 3. `bookings`
| Column | Type | Description |
|---|---|---|
| `id` | `TEXT PRIMARY KEY` | UUID |
| `booking_id` | `TEXT UNIQUE` | Friendly booking ID (e.g. `VR-2026-88120`) |
| `payment_txn_id` | `TEXT` | Gateway transaction reference |
| `vehicle_id` | `TEXT REFERENCES vehicles(id)` | Reserved vehicle ID |
| `vehicle_title` / `vehicle_image` | `TEXT` | Snapshot vehicle details |
| `user_email` / `full_name` / `phone` | `TEXT` | Customer contact information |
| `license_no` / `dl_file_url` / `aadhar_file_url` | `TEXT` | Customer identity documents |
| `pickup_location` | `TEXT` | Pickup point |
| `start_date` / `end_date` | `TEXT` | Reservation date range |
| `rental_days` / `daily_rate` / `base_price` | `NUMERIC` | Price breakdown calculations |
| `security_deposit` / `token_amount` | `NUMERIC` | Deposit and upfront advance |
| `total_amount_to_pay_now` / `remaining_amount_at_pickup` | `NUMERIC` | Split payment tracking |
| `payment_method` / `pay_gateway_tab` | `TEXT` | `pickup`, `upi`, `card`, `netbanking` |
| `total_amount` | `REAL` | Total trip amount |
| `booking_status` | `TEXT` | `Confirmed & Token Paid`, `Active Trip`, `Completed`, `Cancelled` |

### 4. `hosts`
Partner fleet hosts (e.g. Himalayan Fleet Host, Tapovan). Stores contact, hub location, bank account details, and monthly earnings.

### 5. `reviews`
Verified vehicle ratings (1-5 stars) and comments.

### 6. `inquiries`
Customer support contact requests and custom itinerary inquiries.

---

## ⚡ Installation & Local Setup

### 1. Install Dependencies
```bash
cd full-backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file inside `full-backend/`:
```bash
cp .env.example .env
```
Add your Turso database credentials and Firebase configuration.

### 3. Initialize Database Schema & Seed Data
Run the automated migration and seeding scripts:
```bash
# Run migration to create all tables & indexes
npm run db:migrate

# Populate initial Uttarakhand fleet and host records
npm run db:seed

# Or run both in one step:
npm run db:setup
```

### 4. Start the Backend Server
```bash
# Development mode with hot reload:
npm run dev

# Production mode:
npm start
```
The server will start on `http://localhost:5001`.

---

## 📡 API Endpoints Reference

### Fleet & Vehicles (`/api/vehicles`)
- `GET /api/vehicles` - List all vehicles (query params: `category`, `status`, `location`, `search`).
- `GET /api/vehicles/:id` - Get single vehicle details.
- `POST /api/vehicles` - Add/register new vehicle to fleet.
- `PUT /api/vehicles/:id` - Update vehicle details or status.
- `DELETE /api/vehicles/:id` - Remove vehicle from fleet.

### Reservations & Bookings (`/api/bookings`)
- `GET /api/bookings` - List all bookings (query params: `email`, `status`).
- `GET /api/bookings/:id` - Get reservation details by ID or booking_id.
- `POST /api/bookings` - Create new confirmed booking.
- `PUT /api/bookings/:id/status` - Update booking status (`Confirmed & Token Paid`, `Active Trip`, `Completed`, `Cancelled`).

### Hosts & Partners (`/api/hosts`)
- `GET /api/hosts/:id` - Get partner host profile and fleet earnings.
- `PUT /api/hosts/:id` - Update host details and bank accounts.
- `POST /api/hosts/auth` - Authenticate partner host.

### Authentication & Profiles (`/api/auth`)
- `POST /api/auth/sync-profile` - Synchronize Firebase user to Turso DB profiles.
- `GET /api/auth/profile/:id` - Get user profile from Turso DB.
- `PUT /api/auth/profile/:id` - Update user profile / KYC.
- `POST /api/auth/verify-token` - Verify Firebase ID token.

### Reviews (`/api/reviews`)
- `GET /api/reviews/:vehicleId` - Get all reviews for a vehicle.
- `POST /api/reviews` - Submit review and rating.

### Contact (`/api/contact`)
- `POST /api/contact` - Submit contact message.
- `GET /api/contact` - List customer inquiries.
