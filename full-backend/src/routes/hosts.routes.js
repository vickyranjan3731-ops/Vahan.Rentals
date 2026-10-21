import express from 'express';
import { queryOne, executeStmt, queryRows } from '../config/db.js';

const router = express.Router();

/**
 * Format raw SQLite host row
 */
function formatHostRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    owner: row.name,
    phone: row.phone,
    hubLocation: row.hub_location,
    location: row.hub_location,
    bankAccount: row.bank_account,
    logo: row.logo || '',
    status: row.status || 'Verified Host',
    totalFleet: Number(row.total_fleet) || 0,
    vehiclesCount: Number(row.total_fleet) || 0,
    monthlyEarnings: Number(row.monthly_earnings) || 0,
    earnings: Number(row.monthly_earnings) || 0,
    payoutStatus: 'Settled',
    type: 'Bike & Scooty Host'
  };
}

/**
 * GET /api/hosts
 * List all partner hosts from Turso DB
 */
router.get('/', async (req, res, next) => {
  try {
    const rows = await queryRows('SELECT * FROM hosts ORDER BY created_at DESC');
    res.json({
      success: true,
      count: rows.length,
      data: rows.map(formatHostRow)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/hosts/:id
 * Retrieve host profile by ID or email
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const row = await queryOne('SELECT * FROM hosts WHERE id = ? OR email = ?', [id, id]);

    if (!row) {
      return res.status(404).json({
        success: false,
        error: `Host with ID '${id}' not found in database`
      });
    }

    res.json({
      success: true,
      data: formatHostRow(row)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/hosts
 * Register a new partner host in Turso DB
 */
router.post('/', async (req, res, next) => {
  try {
    const h = req.body;
    const id = h.id || `H-${Math.floor(8825 + Math.random() * 900)}`;
    const email = h.email || `${h.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@vahan.rentals`;
    const name = h.name || h.owner || 'New Partner Host';
    const phone = h.phone || '+91 70605 12661';
    const hub_location = h.hubLocation || h.hub_location || h.location || 'Tapovan Rishikesh';
    const bank_account = h.bankAccount || h.bank_account || '';
    const logo = h.logo || '';
    const status = h.status || 'Verified Host';
    const total_fleet = parseInt(h.totalFleet || h.total_fleet || h.vehiclesCount, 10) || 1;
    const monthly_earnings = parseFloat(h.monthlyEarnings || h.monthly_earnings || h.earnings) || 0;

    const sql = `
      INSERT INTO hosts (id, email, name, phone, hub_location, bank_account, logo, status, total_fleet, monthly_earnings)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await executeStmt(sql, [
      id, email, name, phone, hub_location, bank_account, logo, status, total_fleet, monthly_earnings
    ]);

    const created = await queryOne('SELECT * FROM hosts WHERE id = ?', [id]);

    res.status(201).json({
      success: true,
      message: 'Partner host registered successfully in Turso DB',
      data: formatHostRow(created)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/hosts/:id
 * Upsert/Update host profile in Turso DB
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const h = req.body;

    const email = h.email;
    const name = h.name;
    const phone = h.phone;
    const hub_location = h.hubLocation || h.hub_location || h.location || '';
    const bank_account = h.bankAccount || h.bank_account || '';
    const logo = h.logo || '';
    const status = h.status || 'Verified Host';
    const total_fleet = parseInt(h.totalFleet || h.total_fleet || h.vehiclesCount, 10) || 0;
    const monthly_earnings = parseFloat(h.monthlyEarnings || h.monthly_earnings || h.earnings) || 0;

    const upsertSql = `
      INSERT INTO hosts (id, email, name, phone, hub_location, bank_account, logo, status, total_fleet, monthly_earnings)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET
        email = COALESCE(excluded.email, hosts.email),
        name = COALESCE(excluded.name, hosts.name),
        phone = COALESCE(excluded.phone, hosts.phone),
        hub_location = COALESCE(excluded.hub_location, hosts.hub_location),
        bank_account = COALESCE(excluded.bank_account, hosts.bank_account),
        logo = COALESCE(excluded.logo, hosts.logo),
        status = COALESCE(excluded.status, hosts.status),
        total_fleet = excluded.total_fleet,
        monthly_earnings = excluded.monthly_earnings,
        updated_at = DATETIME('now');
    `;

    await executeStmt(upsertSql, [
      id, email, name, phone, hub_location, bank_account, logo, status, total_fleet, monthly_earnings
    ]);

    const updated = await queryOne('SELECT * FROM hosts WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Host profile updated successfully in Turso DB',
      data: formatHostRow(updated)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/hosts/:id/status
 * Approve or update host status (for Admin)
 */
router.put('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await executeStmt(
      "UPDATE hosts SET status = ?, updated_at = DATETIME('now') WHERE id = ?",
      [status || 'Verified Host', id]
    );

    const updated = await queryOne('SELECT * FROM hosts WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Partner status updated to ${status}`,
      data: formatHostRow(updated)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/hosts/auth
 * Partner host authentication endpoint
 */
router.post('/auth', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email/Phone required' });
    }

    const cleanInput = String(email).trim().toLowerCase();

    // Query host record in Turso DB
    const existingHost = await queryOne(
      'SELECT * FROM hosts WHERE LOWER(email) = ? OR phone = ? OR id = ?',
      [cleanInput, cleanInput, email.trim()]
    );

    if (existingHost) {
      return res.json({
        success: true,
        user: {
          id: existingHost.id,
          email: existingHost.email,
          name: existingHost.name,
          role: 'partner'
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Host account not found. Please verify your registered partner email/phone.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/hosts/:id
 * Remove a partner host from Turso DB
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await executeStmt('DELETE FROM hosts WHERE id = ? OR email = ?', [id, id]);
    res.json({
      success: true,
      message: `Partner host '${id}' removed successfully from Turso DB`
    });
  } catch (error) {
    next(error);
  }
});

export default router;
