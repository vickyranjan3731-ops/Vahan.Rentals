// Shared Demo Fleet and Booking records for Partner Portal

export const initialPartnerFleet = [
  { id: 'PF-101', title: 'Royal Enfield Himalayan 450', category: 'Bike', regNo: 'UK07DF8812', price: 1500, location: 'Tapovan Hub', status: 'Available', totalTrips: 18, totalEarnings: 27000, image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600' },
  { id: 'PF-102', title: 'Mahindra Thar 4x4 Hard Top', category: 'Car', regNo: 'UK07BX4490', price: 4500, location: 'Dehradun Airport', status: 'Available', totalTrips: 9, totalEarnings: 40500, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600' },
  { id: 'PF-103', title: 'Honda Activa 6G DLX', category: 'Bike', regNo: 'UK07ER1290', price: 500, location: 'Tapovan Hub', status: 'Under Maintenance', totalTrips: 24, totalEarnings: 12000, image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=600' },
  { id: 'PF-104', title: 'Toyota Innova Crysta 2.4 VX', category: 'Car', regNo: 'UK07AZ9900', price: 3800, location: 'Rishikesh Station', status: 'Rented', totalTrips: 11, totalEarnings: 41800, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600' },
];

export const initialPartnerBookings = [
  {
    bookingId: 'VR-8821',
    vehicle: 'Royal Enfield Himalayan 450',
    regNo: 'UK07DF8812',
    renter: 'Amitabh Sen',
    phone: '9876543210',
    dlNumber: 'DL-0720230091827',
    riderIdPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    dateCreated: '2026-08-05',
    dates: '05 Aug 2026 - 07 Aug 2026',
    pickupTime: '05 Aug 2026, 10:00 AM',
    returnTime: '07 Aug 2026, 06:00 PM',
    bookingMethod: 'Web Booking',
    totalFare: 4500,
    partnerShare: 3825,
    status: 'Pending',
    pickup: 'Tapovan Rishikesh Hub',
    paymentStatus: '🟢 Online Paid (UPI / QR Code)',
    deposit: '₹2,000'
  },
  {
    bookingId: 'VR-8819',
    vehicle: 'Toyota Innova Crysta 2.4 VX',
    regNo: 'UK07AZ9900',
    renter: 'Neha Sharma',
    phone: '8765432109',
    dlNumber: 'DL-0720240058291',
    riderIdPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    dateCreated: '2026-08-05',
    dates: '05 Aug 2026 - 08 Aug 2026',
    pickupTime: '05 Aug 2026, 11:30 AM',
    returnTime: '08 Aug 2026, 08:00 PM',
    bookingMethod: 'Walk-in Entry',
    totalFare: 11400,
    partnerShare: 9690,
    status: 'Active Trip',
    pickup: 'Rishikesh Station Hub',
    paymentStatus: '💵 Cash Collected at Counter',
    deposit: '₹5,000'
  },
  {
    bookingId: 'VR-8815',
    vehicle: 'Mahindra Thar 4x4 Hard Top',
    regNo: 'UK07BX4490',
    renter: 'Rahul Kapoor',
    phone: '9988776655',
    dlNumber: 'DL-0720250083112',
    riderIdPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    dateCreated: '2026-08-05',
    dates: '05 Aug 2026 - 06 Aug 2026',
    pickupTime: '05 Aug 2026, 02:00 PM',
    returnTime: '06 Aug 2026, 06:00 PM',
    bookingMethod: 'Web Booking',
    totalFare: 4500,
    partnerShare: 3825,
    status: 'Pending',
    pickup: 'Dehradun Airport Desk',
    paymentStatus: '🟢 Online Paid (UPI)',
    deposit: '₹3,000'
  },
  {
    bookingId: 'VR-8790',
    vehicle: 'Honda Activa 6G DLX',
    regNo: 'UK07ER1290',
    renter: 'Rohit Verma',
    phone: '7654321098',
    dlNumber: 'DL-0720220019482',
    riderIdPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    dateCreated: '2026-08-04',
    dates: '04 Aug 2026 - 05 Aug 2026',
    pickupTime: '04 Aug 2026, 09:00 AM',
    returnTime: '05 Aug 2026, 07:00 PM',
    bookingMethod: 'Web Booking',
    totalFare: 1500,
    partnerShare: 1275,
    status: 'End Trip',
    pickup: 'Tapovan Hub',
    paymentStatus: '🟢 Online Paid (Card)',
    deposit: '₹1,000 (Refunded)'
  },
  {
    bookingId: 'VR-8785',
    vehicle: 'Mahindra Thar 4x4 Hard Top',
    regNo: 'UK07BX4490',
    renter: 'Vikram Singh',
    phone: '9123456789',
    dlNumber: 'DL-0720210047391',
    riderIdPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    dateCreated: '2026-08-04',
    dates: '04 Aug 2026 - 05 Aug 2026',
    pickupTime: '04 Aug 2026, 10:00 AM',
    returnTime: '05 Aug 2026, 06:00 PM',
    bookingMethod: 'Walk-in Entry',
    totalFare: 9000,
    partnerShare: 7650,
    status: 'End Trip',
    pickup: 'Dehradun Airport',
    paymentStatus: '💵 Cash Collected at Counter',
    deposit: '₹5,000 (Refunded)'
  }
];

export const getPartnerFleet = () => {
  const saved = localStorage.getItem('vahan_partner_fleet');
  return saved ? JSON.parse(saved) : initialPartnerFleet;
};

export const savePartnerFleet = (fleet) => {
  localStorage.setItem('vahan_partner_fleet', JSON.stringify(fleet));
};

export const getPartnerBookings = () => {
  const saved = localStorage.getItem('vahan_partner_bookings');
  return saved ? JSON.parse(saved) : initialPartnerBookings;
};

export const savePartnerBookings = (bookings) => {
  localStorage.setItem('vahan_partner_bookings', JSON.stringify(bookings));
};
