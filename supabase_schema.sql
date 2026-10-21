-- ==============================================================================
-- VAHAN.RENTALS - COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA & SEED DATA
-- Run this SQL in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  driving_license TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'partner', 'admin')),
  avatar_url TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on auth.users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. VEHICLES & FLEET TABLE (Bikes, Cars, Cabs, Experiences)
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  item_type TEXT DEFAULT 'Bike',
  reg_no TEXT,
  price NUMERIC NOT NULL,
  daily_rate TEXT,
  weekly_rate TEXT,
  monthly_rate TEXT,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Rented', 'Under Maintenance', 'Booked')),
  image TEXT NOT NULL,
  rating NUMERIC DEFAULT 4.9,
  reviews INTEGER DEFAULT 24,
  description TEXT,
  hosted_by TEXT DEFAULT 'vahan.rentals',
  host_phone TEXT DEFAULT '+91 7060512661',
  specs JSONB DEFAULT '{}'::jsonb,
  included JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on category, status, and price
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON public.vehicles (category);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles (status);
CREATE INDEX IF NOT EXISTS idx_vehicles_location ON public.vehicles (location);


-- 3. BOOKINGS & RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id TEXT UNIQUE NOT NULL,
  payment_txn_id TEXT,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE SET NULL,
  vehicle_title TEXT NOT NULL,
  vehicle_image TEXT,
  category TEXT,
  is_car BOOLEAN DEFAULT FALSE,
  is_experience BOOLEAN DEFAULT FALSE,
  user_email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  license_no TEXT,
  dl_file_url TEXT,
  aadhar_file_url TEXT,
  pickup_location TEXT NOT NULL,
  host_name TEXT DEFAULT 'vahan.rentals',
  host_phone TEXT DEFAULT '+91 7060512661',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  formatted_start_date TEXT,
  formatted_end_date TEXT,
  rental_days INTEGER DEFAULT 1,
  daily_rate NUMERIC NOT NULL,
  base_price NUMERIC NOT NULL,
  security_deposit NUMERIC DEFAULT 0,
  token_amount NUMERIC NOT NULL,
  total_amount_to_pay_now NUMERIC NOT NULL,
  remaining_amount_at_pickup NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT 'pickup',
  pay_gateway_tab TEXT DEFAULT 'upi',
  total_amount NUMERIC NOT NULL,
  booking_status TEXT DEFAULT 'Confirmed & Token Paid' CHECK (booking_status IN ('Confirmed & Token Paid', 'Active Trip', 'Completed', 'Cancelled', 'Pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on bookings
CREATE INDEX IF NOT EXISTS idx_bookings_user_email ON public.bookings (user_email);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON public.bookings (booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (booking_status);


-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  date TEXT DEFAULT 'Recent Verified Renter',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_vehicle_id ON public.reviews (vehicle_id);


-- 5. PARTNER HOSTS TABLE (Himalayan Fleet Host & Partners)
CREATE TABLE IF NOT EXISTS public.hosts (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  hub_location TEXT NOT NULL,
  bank_account TEXT,
  logo TEXT,
  status TEXT DEFAULT 'Verified Host',
  total_fleet INTEGER DEFAULT 4,
  monthly_earnings NUMERIC DEFAULT 103105,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hosts_email ON public.hosts (email);


-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR true);

-- Vehicles Policies
CREATE POLICY "Vehicles are viewable by everyone" 
  ON public.vehicles FOR SELECT USING (true);

CREATE POLICY "Anyone can insert new vehicle" 
  ON public.vehicles FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update vehicle" 
  ON public.vehicles FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete vehicle" 
  ON public.vehicles FOR DELETE USING (true);

-- Bookings Policies
CREATE POLICY "Anyone can view bookings" 
  ON public.bookings FOR SELECT USING (true);

CREATE POLICY "Anyone can create bookings" 
  ON public.bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update bookings" 
  ON public.bookings FOR UPDATE USING (true);

-- Reviews Policies
CREATE POLICY "Reviews are viewable by everyone" 
  ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Anyone can insert reviews" 
  ON public.reviews FOR INSERT WITH CHECK (true);

-- Hosts Policies
CREATE POLICY "Hosts are viewable by everyone" 
  ON public.hosts FOR SELECT USING (true);

CREATE POLICY "Anyone can insert hosts" 
  ON public.hosts FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update hosts" 
  ON public.hosts FOR UPDATE USING (true);


-- ==============================================================================
-- 7. INITIAL SEED DATA FOR VAHAN.RENTALS FLEET, HOSTS & EXPERIENCES
-- ==============================================================================

-- Seed Host Record
INSERT INTO public.hosts (id, email, name, phone, hub_location, bank_account, logo, status, total_fleet, monthly_earnings)
VALUES (
  'H-88210',
  'partner@vahan.rentals',
  'Himalayan Fleet Host',
  '+91 70605 12661',
  'Laxman Jhula Main Road, Tapovan Rishikesh',
  '50100234908821 (HDFC Bank)',
  '',
  'Verified Host',
  4,
  103105
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  hub_location = EXCLUDED.hub_location,
  bank_account = EXCLUDED.bank_account;

INSERT INTO public.vehicles (id, title, category, item_type, reg_no, price, daily_rate, weekly_rate, monthly_rate, location, status, image, rating, reviews, description, hosted_by, host_phone, specs, included, requirements)
VALUES
  (
    're-himalayan-450',
    'Royal Enfield Himalayan 450',
    'Bike',
    'Bike',
    'UK07DF8812',
    1500,
    '₹1,500/day',
    '₹9,000/week',
    '₹32,000/month',
    'Tapovan Hub, Rishikesh',
    'Available',
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
    4.9,
    48,
    'Explore the scenic mountain highways of Uttarakhand with peak reliability and power. Fully serviced vehicle with 24/7 roadside assistance.',
    'Himalayan Fleet Host',
    '+91 7060512661',
    '{"engine": "452 cc", "power": "40.02 PS", "mileage": "30 kmpl", "fuel": "Petrol (17 L)", "transmission": "6-Speed Manual", "seating": "2 Persons"}'::jsonb,
    '["2 ISI Helmets Included", "Unlimited Kilometers", "Basic Comprehensive Insurance", "24/7 Roadside Assistance"]'::jsonb,
    '["Original Driving License", "Govt ID (Aadhar / Passport)", "Security Deposit ₹1,000"]'::jsonb
  ),
  (
    're-classic-350',
    'Royal Enfield Classic 350',
    'Bike',
    'Bike',
    'UK07ER4910',
    1200,
    '₹1,200/day',
    '₹7,200/week',
    '₹26,000/month',
    'Laxman Jhula, Rishikesh',
    'Available',
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
    4.8,
    64,
    'The timeless icon of Uttarakhand mountain touring with effortless torque and classic thumping comfort.',
    'vahan.rentals',
    '+91 7060512661',
    '{"engine": "349 cc", "power": "20.2 BHP", "mileage": "36 kmpl", "fuel": "Petrol (13 L)", "transmission": "5-Speed Manual", "seating": "2 Persons"}'::jsonb,
    '["2 ISI Helmets Included", "Unlimited Kilometers", "Basic Insurance", "24/7 Roadside Support"]'::jsonb,
    '["Original Driving License", "Govt ID", "Security Deposit ₹1,000"]'::jsonb
  ),
  (
    'honda-activa-6g',
    'Honda Activa 6G DLX',
    'Scooty',
    'Bike',
    'UK07AZ1120',
    500,
    '₹500/day',
    '₹3,000/week',
    '₹11,000/month',
    'Tapovan Hub, Rishikesh',
    'Available',
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
    4.7,
    89,
    'Smooth, automatic, fuel-efficient scooter perfect for local Rishikesh cafes, ghats, and short sightseeing rides.',
    'vahan.rentals',
    '+91 7060512661',
    '{"engine": "109.5 cc", "power": "7.79 PS", "mileage": "48 kmpl", "fuel": "Petrol (5.3 L)", "transmission": "Automatic (CVT)", "seating": "2 Persons"}'::jsonb,
    '["2 ISI Helmets", "Unlimited KM", "24/7 Support"]'::jsonb,
    '["Original Driving License", "Govt ID", "Security Deposit ₹500"]'::jsonb
  ),
  (
    'thar-4x4-hardtop',
    'Mahindra Thar 4x4 Hard Top',
    'Car',
    'Car',
    'UK07BX4490',
    4500,
    '₹4,500/day',
    '₹27,000/week',
    '₹95,000/month',
    'Dehradun Airport & Rishikesh',
    'Available',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    4.9,
    42,
    'Unstoppable 4x4 capability with hardtop comfort for all Uttarakhand expeditions and rough mountain trails.',
    'Himalayan Fleet Host',
    '+91 7060512661',
    '{"engine": "2184 cc Diesel mHawk", "power": "130 BHP", "mileage": "14 kmpl", "fuel": "Diesel (57 L)", "transmission": "Manual 4x4 Low/High", "seating": "4 Persons"}'::jsonb,
    '["Unlimited Kilometers", "Zero-Dep Insurance", "24/7 Roadside Assistance", "Doorstep Airport Drop Option"]'::jsonb,
    '["Original Driving License", "Govt ID (Aadhar/Passport)", "Security Deposit ₹5,000"]'::jsonb
  ),
  (
    'innova-crysta',
    'Toyota Innova Crysta 2.4 VX',
    'Car',
    'Car',
    'UK07AZ9900',
    3800,
    '₹3,800/day',
    '₹22,800/week',
    '₹80,000/month',
    'Rishikesh Station & Dehradun',
    'Available',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    4.9,
    76,
    'The gold standard of luxury family travel in Uttarakhand. Spacious captain seats with dual AC.',
    'vahan.rentals',
    '+91 7060512661',
    '{"engine": "2393 cc Diesel", "power": "148 BHP", "mileage": "15 kmpl", "fuel": "Diesel (55 L)", "transmission": "5-Speed Manual", "seating": "7 Persons"}'::jsonb,
    '["Dual AC & Captain Seats", "Comprehensive Insurance", "24/7 Roadside Support"]'::jsonb,
    '["Original Driving License", "Govt ID", "Security Deposit ₹4,000"]'::jsonb
  ),
  (
    'white-water-rafting',
    'White Water Rafting',
    'ADVENTURE',
    'Experience',
    'N/A',
    1200,
    '₹1,200 / person',
    'Group Discount Available',
    'Custom Package',
    'Shivpuri, Rishikesh',
    'Available',
    'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=800&q=80',
    4.9,
    312,
    'Experience the exhilarating thrill of riding the wild, crystal-clear rapids of the holy Ganges in Rishikesh. Conquer Grade III and Grade IV rapids under certified river guides.',
    'vahan.rentals',
    '+91 7060512661',
    '{"duration": "3 - 4 Hours Total", "stretch": "16 KM (Shivpuri to NIM Beach)", "rapids": "Grade III / III+", "minAge": "12 Years & Above", "safety": "IRF Certified River Guide"}'::jsonb,
    '["Imported ISI / CE Life Jackets & Helmets", "Professional Certified River Guide", "Cliff Jumping & Body Surfing", "Safety Kayaker Escort"]'::jsonb,
    '["Booking Slip / SMS Confirmation"]'::jsonb
  ),
  (
    'char-dham-taxi-service',
    'Char Dham Taxi Service',
    'PILGRIMAGE / TOUR',
    'Experience',
    'N/A',
    35000,
    '₹35,000 / tour',
    '₹24,500',
    '₹35,000 Full Tour Package',
    'Uttarakhand',
    'Available',
    '/chardham-yatra-package.jpg',
    4.8,
    145,
    'Complete 10-12 Days Char Dham Yatra Taxi Package (Yamunotri, Gangotri, Kedarnath, Badrinath) with expert mountain drivers and comfortable AC Innova Crysta / Ertiga.',
    'vahan.rentals',
    '+91 7060512661',
    '{"duration": "10 to 12 Days Tour", "vehicleType": "Innova Crysta / Ertiga", "route": "Haridwar - Barkot - Kedarnath - Badrinath", "driver": "Expert Hilly Driver 10+ yrs exp"}'::jsonb,
    '["Dedicated AC Vehicle & Hilly Route Driver", "All State Toll Taxes, Parking & Green Cards", "Driver Allowance Included", "24/7 Dedicated Support"]'::jsonb,
    '["Booking Confirmation SMS"]'::jsonb
  ),
  (
    'bungee-jumping',
    'Bungee Jumping',
    'EXTREME SPORT',
    'Experience',
    'N/A',
    3500,
    '₹3,500 / jump',
    'Combo Package Available',
    'Special Slot Booking',
    'Mohanchatti, Rishikesh',
    'Available',
    '/Bungee.jpg',
    4.9,
    218,
    'Leap off India highest fixed bungee jumping platform at 83 meters set amidst the breathtaking green hills of Mohanchatti, Rishikesh.',
    'vahan.rentals',
    '+91 7060512661',
    '{"height": "83 Meters (India Highest)", "duration": "1.5 Hours Total Activity", "minWeight": "40 KG", "maxWeight": "110 KG", "minAge": "12 Years"}'::jsonb,
    '["Safety Harness, Ankle Straps & Briefing", "Official Dare to Jump Certificate", "Entry Pass to Jump Zone"]'::jsonb,
    '["Valid Booking Voucher"]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  status = EXCLUDED.status,
  image = EXCLUDED.image;

-- 8. SEED INITIAL HOST RECORD (Himalayan Fleet Host)
INSERT INTO public.hosts (id, email, name, phone, hub_location, bank_account, logo, status, total_fleet, monthly_earnings)
VALUES (
  'H-88210',
  'partner@vahan.rentals',
  'Himalayan Fleet Host',
  '+91 70605 12661',
  'Laxman Jhula Main Road, Tapovan Rishikesh',
  '50100234908821 (HDFC Bank)',
  '',
  'Verified Host',
  4,
  103105
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  hub_location = EXCLUDED.hub_location,
  bank_account = EXCLUDED.bank_account;

