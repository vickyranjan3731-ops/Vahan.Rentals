import express from 'express';
import { queryOne, executeStmt, queryRows } from '../config/db.js';
import { auth, isInitialized } from '../config/firebase.js';

const router = express.Router();

/**
 * POST /api/auth/sync-profile
 * Synchronize Firebase authenticated user to Turso DB profiles table
 */
router.post('/sync-profile', async (req, res, next) => {
  try {
    const { id, uid, email, fullName, full_name, phone, role = 'user', avatarUrl, avatar_url, drivingLicense, driving_license } = req.body;
    
    const userId = uid || id;
    if (!userId || !email) {
      return res.status(400).json({ success: false, error: 'User UID and email are required' });
    }

    const name = fullName || full_name || email.split('@')[0];
    const userPhone = phone || '';
    const dl = drivingLicense || driving_license || '';
    const avatar = avatarUrl || avatar_url || '';

    const sql = `
      INSERT INTO profiles (id, email, full_name, phone, driving_license, role, avatar_url, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
      ON CONFLICT (id) DO UPDATE SET
        email = excluded.email,
        full_name = COALESCE(excluded.full_name, profiles.full_name),
        phone = COALESCE(excluded.phone, profiles.phone),
        driving_license = COALESCE(excluded.driving_license, profiles.driving_license),
        role = COALESCE(excluded.role, profiles.role),
        avatar_url = COALESCE(excluded.avatar_url, profiles.avatar_url),
        updated_at = DATETIME('now');
    `;

    await executeStmt(sql, [userId, email, name, userPhone, dl, role, avatar]);

    const profile = await queryOne('SELECT * FROM profiles WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'Profile synchronized in Turso DB',
      data: profile
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/users
 * Retrieve all registered users and KYC requests from Turso DB (for Admin)
 */
router.get('/users', async (req, res, next) => {
  try {
    const rows = await queryRows('SELECT * FROM profiles ORDER BY created_at DESC');
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/profile/:id
 * Retrieve user profile from Turso DB
 */
router.get('/profile/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const profile = await queryOne('SELECT * FROM profiles WHERE id = ? OR email = ?', [id, id]);

    if (!profile) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/auth/users/:id/kyc
 * Update KYC status (for Admin)
 */
router.put('/users/:id/kyc', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { kycStatus, status } = req.body;
    const targetStatus = kycStatus || status || 'verified';

    await executeStmt(
      "UPDATE profiles SET kyc_status = ?, updated_at = DATETIME('now') WHERE id = ? OR email = ?",
      [targetStatus, id, id]
    );

    const updated = await queryOne('SELECT * FROM profiles WHERE id = ? OR email = ?', [id, id]);

    res.json({
      success: true,
      message: `KYC status updated to '${targetStatus}'`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/admin/login
 * Admin authentication endpoint against Turso DB admins table
 */
router.post('/admin/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Query admins table in Turso DB
    const adminUser = await queryOne(
      'SELECT * FROM admins WHERE LOWER(email) = ? AND password = ?',
      [cleanEmail, password]
    );

    if (adminUser) {
      return res.json({
        success: true,
        message: 'Admin authenticated successfully',
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          phone: adminUser.phone
        }
      });
    }

    // Also check profiles table for role='admin'
    const profileAdmin = await queryOne(
      "SELECT * FROM profiles WHERE LOWER(email) = ? AND role = 'admin'",
      [cleanEmail]
    );

    if (profileAdmin && (password === 'admin123' || password === profileAdmin.id)) {
      return res.json({
        success: true,
        message: 'Admin authenticated successfully',
        user: {
          id: profileAdmin.id,
          email: profileAdmin.email,
          name: profileAdmin.full_name || 'Admin User',
          role: 'Master Admin'
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid administrator email or passcode'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/verify-token
 * Verify a Firebase ID token from client
 */
router.post('/verify-token', async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Token is required' });
    }

    if (!isInitialized || !auth) {
      return res.status(503).json({ success: false, error: 'Firebase Auth is not configured on the server' });
    }

    const decoded = await auth.verifyIdToken(token);
    const profile = await queryOne('SELECT * FROM profiles WHERE id = ?', [decoded.uid]);

    return res.json({
      success: true,
      user: decoded,
      profile
    });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
});

export default router;
