import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { queryRows, queryOne, executeStmt } from '../config/db.js';

const router = express.Router();

/**
 * Format raw SQLite booking row
 */
function formatBookingRow(row) {
  if (!row) return null;
  return {
    ...row,
    is_car: Boolean(row.is_car),
    is_experience: Boolean(row.is_experience),
    rental_days: Number(row.rental_days),
    daily_rate: Number(row.daily_rate),
    base_price: Number(row.base_price),
    security_deposit: Number(row.security_deposit),
    token_amount: Number(row.token_amount),
    total_amount_to_pay_now: Number(row.total_amount_to_pay_now),
    remaining_amount_at_pickup: Number(row.remaining_amount_at_pickup),
    total_amount: Number(row.total_amount)
  };
}

/**
 * GET /api/bookings
 * Fetch all bookings, optionally filtered by user_email or status
 */
router.get('/', async (req, res, next) => {
  try {
    const { email, status } = req.query;
    let sql = 'SELECT * FROM bookings WHERE 1=1';
    const params = [];

    if (email) {
      sql += ' AND user_email = ?';
      params.push(email);
    }

    if (status) {
      sql += ' AND booking_status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const rows = await queryRows(sql, params);
    res.json({
      success: true,
      count: rows.length,
      data: rows.map(formatBookingRow)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookings/:id
 * Fetch single booking by ID or booking_id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const row = await queryOne(
      'SELECT * FROM bookings WHERE id = ? OR booking_id = ?',
      [id, id]
    );

    if (!row) {
      return res.status(404).json({ success: false, error: 'Booking reservation not found' });
    }

    res.json({
      success: true,
      data: formatBookingRow(row)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bookings
 * Create a confirmed reservation / booking in Turso DB
 */
router.post('/', async (req, res, next) => {
  try {
    const b = req.body;
    const id = b.id || uuidv4();
    const booking_id = b.bookingId || b.booking_id || `VR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const payment_txn_id = b.paymentTxnId || b.payment_txn_id || `TXN-${Date.now()}`;
    const vehicle_id = b.vehicleId || b.vehicle_id || null;
    const vehicle_title = b.vehicleTitle || b.vehicle_title || 'Vehicle Rental';
    const vehicle_image = b.vehicleImage || b.vehicle_image || null;
    const category = b.category || null;
    const is_car = b.isCar || b.is_car ? 1 : 0;
    const is_experience = b.isExperience || b.is_experience ? 1 : 0;
    const user_email = b.email || b.user_email || 'guest@vahan.rentals';
    const full_name = b.fullName || b.full_name || 'Rider Guest';
    const phone = b.phone || '+91 70605 12661';
    const license_no = b.licenseNo || b.license_no || null;
    const dl_file_url = b.dlFileUrl || b.dl_file_url || null;
    const aadhar_file_url = b.aadharFileUrl || b.aadhar_file_url || null;
    const pickup_location = b.pickupLocation || b.pickup_location || 'Tapovan Hub, Rishikesh';
    const host_name = b.hostName || b.host_name || 'vahan.rentals';
    const host_phone = b.hostPhone || b.host_phone || '+91 7060512661';
    
    const start_date = b.startDate || b.start_date || new Date().toISOString().split('T')[0];
    const end_date = b.endDate || b.end_date || new Date().toISOString().split('T')[0];
    const formatted_start_date = b.formattedStartDate || b.formatted_start_date || String(start_date);
    const formatted_end_date = b.formattedEndDate || b.formatted_end_date || String(end_date);
    
    const rental_days = parseInt(b.rentalDays || b.rental_days, 10) || 1;
    const daily_rate = parseFloat(b.dailyRate || b.daily_rate) || 0;
    const base_price = parseFloat(b.basePrice || b.base_price) || (daily_rate * rental_days);
    const security_deposit = parseFloat(b.securityDeposit || b.security_deposit) || 0;
    const token_amount = parseFloat(b.tokenAmount || b.token_amount) || 0;
    const total_amount_to_pay_now = parseFloat(b.totalAmountToPayNow || b.total_amount_to_pay_now) || token_amount;
    const remaining_amount_at_pickup = parseFloat(b.remainingAmountAtPickup || b.remaining_amount_at_pickup) || 0;
    const payment_method = b.paymentMethod || b.payment_method || 'pickup';
    const pay_gateway_tab = b.payGatewayTab || b.pay_gateway_tab || 'upi';
    const total_amount = parseFloat(b.totalAmount || b.total_amount) || (base_price + security_deposit);
    const booking_status = b.status || b.booking_status || 'Confirmed & Token Paid';

    const insertSql = `
      INSERT INTO bookings (
        id, booking_id, payment_txn_id, vehicle_id, vehicle_title, vehicle_image, category,
        is_car, is_experience, user_email, full_name, phone, license_no, dl_file_url,
        aadhar_file_url, pickup_location, host_name, host_phone, start_date, end_date,
        formatted_start_date, formatted_end_date, rental_days, daily_rate, base_price,
        security_deposit, token_amount, total_amount_to_pay_now, remaining_amount_at_pickup,
        payment_method, pay_gateway_tab, total_amount, booking_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await executeStmt(insertSql, [
      id, booking_id, payment_txn_id, vehicle_id, vehicle_title, vehicle_image, category,
      is_car, is_experience, user_email, full_name, phone, license_no, dl_file_url,
      aadhar_file_url, pickup_location, host_name, host_phone, start_date, end_date,
      formatted_start_date, formatted_end_date, rental_days, daily_rate, base_price,
      security_deposit, token_amount, total_amount_to_pay_now, remaining_amount_at_pickup,
      payment_method, pay_gateway_tab, total_amount, booking_status
    ]);

    const created = await queryOne('SELECT * FROM bookings WHERE id = ?', [id]);

    res.status(201).json({
      success: true,
      message: 'Booking successfully confirmed and recorded in Turso DB',
      data: formatBookingRow(created)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/bookings/:id/status
 * Update booking status
 */
router.put('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const booking = await queryOne('SELECT id FROM bookings WHERE id = ? OR booking_id = ?', [id, id]);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    await executeStmt(
      "UPDATE bookings SET booking_status = ?, updated_at = DATETIME('now') WHERE id = ?",
      [status, booking.id]
    );

    const updated = await queryOne('SELECT * FROM bookings WHERE id = ?', [booking.id]);

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: formatBookingRow(updated)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
