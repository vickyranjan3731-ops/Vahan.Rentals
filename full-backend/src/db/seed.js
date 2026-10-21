import db, { executeStmt } from '../config/db.js';

async function seedDatabase() {
  console.log('🌱 Seeding initial data into Turso DB...');

  // 1. Seed Master Admin Account
  const adminSql = `
    INSERT INTO admins (id, email, password, name, role, phone)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT (email) DO UPDATE SET
      password = excluded.password,
      name = excluded.name,
      role = excluded.role,
      phone = excluded.phone;
  `;

  await executeStmt(adminSql, [
    'admin-1',
    'admin@vahan.rentals',
    'admin123',
    'Vahan Master Admin',
    'Master Admin',
    '+91 70605 12661'
  ]);
  console.log('  ✅ Seeded Master Admin record (admin@vahan.rentals / admin123)');

  // 2. Seed Partner Hosts
  const hosts = [
    {
      id: 'H-88210',
      email: 'partner@vahan.rentals',
      name: 'Himalayan Fleet Host',
      phone: '+91 70605 12661',
      hub_location: 'Tapovan Rishikesh',
      bank_account: '50100234908821 (HDFC Bank)',
      logo: '',
      status: 'Verified Host',
      total_fleet: 4,
      monthly_earnings: 121300
    },
    {
      id: 'H-88220',
      email: 'garhwal.cabs@gmail.com',
      name: 'Garhwal Motors & Cab Service',
      phone: '+91 98970 12345',
      hub_location: 'Dehradun Airport',
      bank_account: '30491029482910 (SBI)',
      logo: '',
      status: 'Verified Host',
      total_fleet: 3,
      monthly_earnings: 84500
    },
    {
      id: 'H-88230',
      email: 'ganga.rentals@gmail.com',
      name: 'Ganga Valley Rentals',
      phone: '+91 94120 55667',
      hub_location: 'Laxman Jhula',
      bank_account: '91823901928301 (ICICI Bank)',
      logo: '',
      status: 'Verified Host',
      total_fleet: 2,
      monthly_earnings: 28000
    },
    {
      id: 'H-88240',
      email: 'deepak.express@gmail.com',
      name: 'Rishikesh Express Fleet',
      phone: '+91 98370 99881',
      hub_location: 'Rishikesh Station',
      bank_account: '81726354819203 (Punjab National Bank)',
      logo: '',
      status: 'Verified Host',
      total_fleet: 1,
      monthly_earnings: 12000
    }
  ];

  const hostSql = `
    INSERT INTO hosts (id, email, name, phone, hub_location, bank_account, logo, status, total_fleet, monthly_earnings)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (email) DO UPDATE SET
      name = excluded.name,
      phone = excluded.phone,
      hub_location = excluded.hub_location,
      bank_account = excluded.bank_account,
      total_fleet = excluded.total_fleet,
      monthly_earnings = excluded.monthly_earnings;
  `;

  for (const h of hosts) {
    await executeStmt(hostSql, [
      h.id, h.email, h.name, h.phone, h.hub_location, h.bank_account, h.logo, h.status, h.total_fleet, h.monthly_earnings
    ]);
  }
  console.log(`  ✅ Seeded ${hosts.length} Partner Host records`);

  // 3. Seed Vehicles & Fleet
  const vehicles = [
    {
      id: 're-himalayan-450',
      title: 'Royal Enfield Himalayan 450',
      category: 'Bike',
      item_type: 'Bike',
      reg_no: 'UK07DF8812',
      price: 1500,
      daily_rate: '₹1,500/day',
      weekly_rate: '₹9,000/week',
      monthly_rate: '₹32,000/month',
      location: 'Tapovan Hub, Rishikesh',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
      rating: 4.9,
      reviews: 48,
      description: 'Explore the scenic mountain highways of Uttarakhand with peak reliability and power. Fully serviced vehicle with 24/7 roadside assistance.',
      hosted_by: 'Himalayan Fleet Host',
      host_phone: '+91 7060512661',
      specs: JSON.stringify({ engine: '452 cc', power: '40.02 PS', mileage: '30 kmpl', fuel: 'Petrol (17 L)', transmission: '6-Speed Manual', seating: '2 Persons' }),
      included: JSON.stringify(['2 ISI Helmets Included', 'Unlimited Kilometers', 'Basic Comprehensive Insurance', '24/7 Roadside Assistance']),
      requirements: JSON.stringify(['Original Driving License', 'Govt ID (Aadhar / Passport)', 'Security Deposit ₹1,000']),
      faqs: JSON.stringify([])
    },
    {
      id: 're-classic-350',
      title: 'Royal Enfield Classic 350',
      category: 'Bike',
      item_type: 'Bike',
      reg_no: 'UK07ER4910',
      price: 1200,
      daily_rate: '₹1,200/day',
      weekly_rate: '₹7,200/week',
      monthly_rate: '₹26,000/month',
      location: 'Laxman Jhula, Rishikesh',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
      rating: 4.8,
      reviews: 64,
      description: 'The timeless icon of Uttarakhand mountain touring with effortless torque and classic thumping comfort.',
      hosted_by: 'vahan.rentals',
      host_phone: '+91 7060512661',
      specs: JSON.stringify({ engine: '349 cc', power: '20.2 BHP', mileage: '36 kmpl', fuel: 'Petrol (13 L)', transmission: '5-Speed Manual', seating: '2 Persons' }),
      included: JSON.stringify(['2 ISI Helmets Included', 'Unlimited Kilometers', 'Basic Insurance', '24/7 Roadside Support']),
      requirements: JSON.stringify(['Original Driving License', 'Govt ID', 'Security Deposit ₹1,000']),
      faqs: JSON.stringify([])
    },
    {
      id: 'honda-activa-6g',
      title: 'Honda Activa 6G DLX',
      category: 'Scooty',
      item_type: 'Bike',
      reg_no: 'UK07AZ1120',
      price: 500,
      daily_rate: '₹500/day',
      weekly_rate: '₹3,000/week',
      monthly_rate: '₹11,000/month',
      location: 'Tapovan Hub, Rishikesh',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
      rating: 4.7,
      reviews: 89,
      description: 'Smooth, automatic, fuel-efficient scooter perfect for local Rishikesh cafes, ghats, and short sightseeing rides.',
      hosted_by: 'vahan.rentals',
      host_phone: '+91 7060512661',
      specs: JSON.stringify({ engine: '109.5 cc', power: '7.79 PS', mileage: '48 kmpl', fuel: 'Petrol (5.3 L)', transmission: 'Automatic (CVT)', seating: '2 Persons' }),
      included: JSON.stringify(['2 ISI Helmets', 'Unlimited KM', '24/7 Support']),
      requirements: JSON.stringify(['Original Driving License', 'Govt ID', 'Security Deposit ₹500']),
      faqs: JSON.stringify([])
    },
    {
      id: 'thar-4x4-hardtop',
      title: 'Mahindra Thar 4x4 Hard Top',
      category: 'Car',
      item_type: 'Car',
      reg_no: 'UK07BX4490',
      price: 4500,
      daily_rate: '₹4,500/day',
      weekly_rate: '₹27,000/week',
      monthly_rate: '₹95,000/month',
      location: 'Dehradun Airport & Rishikesh',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      rating: 4.9,
      reviews: 42,
      description: 'Unstoppable 4x4 capability with hardtop comfort for all Uttarakhand expeditions and rough mountain trails.',
      hosted_by: 'Himalayan Fleet Host',
      host_phone: '+91 7060512661',
      specs: JSON.stringify({ engine: '2184 cc Diesel mHawk', power: '130 BHP', mileage: '14 kmpl', fuel: 'Diesel (57 L)', transmission: 'Manual 4x4 Low/High', seating: '4 Persons' }),
      included: JSON.stringify(['Unlimited Kilometers', 'Zero-Dep Insurance', '24/7 Roadside Assistance', 'Doorstep Airport Drop Option']),
      requirements: JSON.stringify(['Original Driving License', 'Govt ID (Aadhar/Passport)', 'Security Deposit ₹5,000']),
      faqs: JSON.stringify([])
    },
    {
      id: 'innova-crysta',
      title: 'Toyota Innova Crysta 2.4 VX',
      category: 'Car',
      item_type: 'Car',
      reg_no: 'UK07AZ9900',
      price: 3800,
      daily_rate: '₹3,800/day',
      weekly_rate: '₹22,800/week',
      monthly_rate: '₹80,000/month',
      location: 'Rishikesh Station & Dehradun',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
      rating: 4.9,
      reviews: 76,
      description: 'The gold standard of luxury family travel in Uttarakhand. Spacious captain seats with dual AC.',
      hosted_by: 'vahan.rentals',
      host_phone: '+91 7060512661',
      specs: JSON.stringify({ engine: '2393 cc Diesel', power: '148 BHP', mileage: '15 kmpl', fuel: 'Diesel (55 L)', transmission: '5-Speed Manual', seating: '7 Persons' }),
      included: JSON.stringify(['Dual AC & Captain Seats', 'Comprehensive Insurance', '24/7 Roadside Support']),
      requirements: JSON.stringify(['Original Driving License', 'Govt ID', 'Security Deposit ₹4,000']),
      faqs: JSON.stringify([])
    },
    {
      id: 'white-water-rafting',
      title: 'White Water Rafting',
      category: 'ADVENTURE',
      item_type: 'Experience',
      reg_no: 'N/A',
      price: 1200,
      daily_rate: '₹1,200 / person',
      weekly_rate: 'Group Discount Available',
      monthly_rate: 'Custom Package',
      location: 'Shivpuri, Rishikesh',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviews: 312,
      description: 'Experience the exhilarating thrill of riding the wild, crystal-clear rapids of the holy Ganges in Rishikesh. Conquer Grade III and Grade IV rapids under certified river guides.',
      hosted_by: 'vahan.rentals',
      host_phone: '+91 7060512661',
      specs: JSON.stringify({ duration: '3 - 4 Hours Total', stretch: '16 KM (Shivpuri to NIM Beach)', rapids: 'Grade III / III+', minAge: '12 Years & Above', safety: 'IRF Certified River Guide' }),
      included: JSON.stringify(['Imported ISI / CE Life Jackets & Helmets', 'Professional Certified River Guide', 'Cliff Jumping & Body Surfing', 'Safety Kayaker Escort']),
      requirements: JSON.stringify(['Booking Slip / SMS Confirmation']),
      faqs: JSON.stringify([])
    },
    {
      id: 'char-dham-taxi-service',
      title: 'Char Dham Taxi Service',
      category: 'PILGRIMAGE / TOUR',
      item_type: 'Experience',
      reg_no: 'N/A',
      price: 35000,
      daily_rate: '₹35,000 / tour',
      weekly_rate: '₹24,500',
      monthly_rate: '₹35,000 Full Tour Package',
      location: 'Uttarakhand',
      status: 'Available',
      image: '/chardham-yatra-package.jpg',
      rating: 4.8,
      reviews: 145,
      description: 'Complete 10-12 Days Char Dham Yatra Taxi Package (Yamunotri, Gangotri, Kedarnath, Badrinath) with expert mountain drivers and comfortable AC Innova Crysta / Ertiga.',
      hosted_by: 'vahan.rentals',
      host_phone: '+91 7060512661',
      specs: JSON.stringify({ duration: '10 to 12 Days Tour', vehicleType: 'Innova Crysta / Ertiga', route: 'Haridwar - Barkot - Kedarnath - Badrinath', driver: 'Expert Hilly Driver 10+ yrs exp' }),
      included: JSON.stringify(['Dedicated AC Vehicle & Hilly Route Driver', 'All State Toll Taxes, Parking & Green Cards', 'Driver Allowance Included', '24/7 Dedicated Support']),
      requirements: JSON.stringify(['Booking Confirmation SMS']),
      faqs: JSON.stringify([])
    },
    {
      id: 'bungee-jumping',
      title: 'Bungee Jumping',
      category: 'EXTREME SPORT',
      item_type: 'Experience',
      reg_no: 'N/A',
      price: 3500,
      daily_rate: '₹3,500 / jump',
      weekly_rate: 'Combo Package Available',
      monthly_rate: 'Special Slot Booking',
      location: 'Mohanchatti, Rishikesh',
      status: 'Available',
      image: '/Bungee.jpg',
      rating: 4.9,
      reviews: 218,
      description: 'Leap off India highest fixed bungee jumping platform at 83 meters set amidst the breathtaking green hills of Mohanchatti, Rishikesh.',
      hosted_by: 'vahan.rentals',
      host_phone: '+91 7060512661',
      specs: JSON.stringify({ height: '83 Meters (India Highest)', duration: '1.5 Hours Total Activity', minWeight: '40 KG', maxWeight: '110 KG', minAge: '12 Years' }),
      included: JSON.stringify(['Safety Harness, Ankle Straps & Briefing', 'Official Dare to Jump Certificate', 'Entry Pass to Jump Zone']),
      requirements: JSON.stringify(['Valid Booking Voucher']),
      faqs: JSON.stringify([])
    }
  ];

  const vehicleSql = `
    INSERT INTO vehicles (
      id, title, category, item_type, reg_no, price, daily_rate, weekly_rate, monthly_rate,
      location, status, image, rating, reviews, description, hosted_by, host_phone,
      specs, included, requirements, faqs
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (id) DO UPDATE SET
      title = excluded.title,
      price = excluded.price,
      daily_rate = excluded.daily_rate,
      location = excluded.location,
      status = excluded.status,
      image = excluded.image,
      rating = excluded.rating,
      reviews = excluded.reviews,
      description = excluded.description,
      specs = excluded.specs,
      included = excluded.included,
      requirements = excluded.requirements;
  `;

  for (const v of vehicles) {
    await executeStmt(vehicleSql, [
      v.id, v.title, v.category, v.item_type, v.reg_no, v.price, v.daily_rate, v.weekly_rate, v.monthly_rate,
      v.location, v.status, v.image, v.rating, v.reviews, v.description, v.hosted_by, v.host_phone,
      v.specs, v.included, v.requirements, v.faqs
    ]);
  }
  console.log(`  ✅ Seeded ${vehicles.length} Fleet Vehicles and Experiences`);

  console.log('✨ Seed data successfully inserted into Turso DB!');
}

seedDatabase()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
