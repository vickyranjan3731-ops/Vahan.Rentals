-- ==============================================================================
-- VAHAN.RENTALS - COMPLETE TURSO DB (LIBSQL / SQLITE) SCHEMA
-- ==============================================================================

-- 1. USERS & PROFILES TABLE (Linked with Firebase Authentication UID)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  driving_license TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'partner', 'admin')),
  avatar_url TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  created_at TEXT DEFAULT (DATETIME('now')),
  updated_at TEXT DEFAULT (DATETIME('now'))
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);


-- 2. VEHICLES & FLEET TABLE (Bikes, Scooties, Cars, Cabs, Experiences)
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  item_type TEXT DEFAULT 'Bike',
  reg_no TEXT,
  price REAL NOT NULL,
  daily_rate TEXT,
  weekly_rate TEXT,
  monthly_rate TEXT,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Rented', 'Under Maintenance', 'Booked')),
  image TEXT NOT NULL,
  rating REAL DEFAULT 4.9,
  reviews INTEGER DEFAULT 24,
  description TEXT,
  hosted_by TEXT DEFAULT 'vahan.rentals',
  host_phone TEXT DEFAULT '+91 7060512661',
  specs TEXT DEFAULT '{}',
  included TEXT DEFAULT '[]',
  requirements TEXT DEFAULT '[]',
  faqs TEXT DEFAULT '[]',
  created_at TEXT DEFAULT (DATETIME('now')),
  updated_at TEXT DEFAULT (DATETIME('now'))
);

CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles (category);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles (status);
CREATE INDEX IF NOT EXISTS idx_vehicles_location ON vehicles (location);


-- 3. BOOKINGS & RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  booking_id TEXT UNIQUE NOT NULL,
  payment_txn_id TEXT,
  vehicle_id TEXT REFERENCES vehicles(id) ON DELETE SET NULL,
  vehicle_title TEXT NOT NULL,
  vehicle_image TEXT,
  category TEXT,
  is_car INTEGER DEFAULT 0,
  is_experience INTEGER DEFAULT 0,
  user_email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  license_no TEXT,
  dl_file_url TEXT,
  aadhar_file_url TEXT,
  pickup_location TEXT NOT NULL,
  host_name TEXT DEFAULT 'vahan.rentals',
  host_phone TEXT DEFAULT '+91 7060512661',
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  formatted_start_date TEXT,
  formatted_end_date TEXT,
  rental_days INTEGER DEFAULT 1,
  daily_rate REAL NOT NULL,
  base_price REAL NOT NULL,
  security_deposit REAL DEFAULT 0,
  token_amount REAL NOT NULL,
  total_amount_to_pay_now REAL NOT NULL,
  remaining_amount_at_pickup REAL DEFAULT 0,
  payment_method TEXT DEFAULT 'pickup',
  pay_gateway_tab TEXT DEFAULT 'upi',
  total_amount REAL NOT NULL,
  booking_status TEXT DEFAULT 'Confirmed & Token Paid' CHECK (booking_status IN ('Confirmed & Token Paid', 'Active Trip', 'Completed', 'Cancelled', 'Pending')),
  created_at TEXT DEFAULT (DATETIME('now')),
  updated_at TEXT DEFAULT (DATETIME('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_email ON bookings (user_email);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON bookings (booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (booking_status);


-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT REFERENCES vehicles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  date TEXT DEFAULT 'Recent Verified Renter',
  created_at TEXT DEFAULT (DATETIME('now'))
);

CREATE INDEX IF NOT EXISTS idx_reviews_vehicle_id ON reviews (vehicle_id);


-- 5. PARTNER HOSTS TABLE
CREATE TABLE IF NOT EXISTS hosts (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  hub_location TEXT NOT NULL,
  bank_account TEXT,
  logo TEXT,
  status TEXT DEFAULT 'Verified Host',
  total_fleet INTEGER DEFAULT 4,
  monthly_earnings REAL DEFAULT 103105,
  created_at TEXT DEFAULT (DATETIME('now')),
  updated_at TEXT DEFAULT (DATETIME('now'))
);

CREATE INDEX IF NOT EXISTS idx_hosts_email ON hosts (email);


-- 6. INQUIRIES & CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Resolved')),
  created_at TEXT DEFAULT (DATETIME('now'))
);

CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries (email);


-- 7. ADMINS TABLE (For Admin Portal Authentication)
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Master Admin',
  phone TEXT,
  created_at TEXT DEFAULT (DATETIME('now')),
  updated_at TEXT DEFAULT (DATETIME('now'))
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins (email);
