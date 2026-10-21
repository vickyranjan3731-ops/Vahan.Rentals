import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeStmt, queryRows, queryOne } from '../config/db.js';

const router = express.Router();

/**
 * Format raw SQLite inquiry row
 */
function formatInquiryRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    subject: row.subject || 'General Inquiry',
    interest: row.subject || 'Rental Inquiry',
    message: row.message,
    note: row.message,
    status: row.status || 'New',
    date: row.created_at || new Date().toLocaleString(),
    created_at: row.created_at
  };
}

/**
 * POST /api/contact
 * Submit contact inquiry / message
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }

    const id = `CB-${Math.floor(800 + Math.random() * 900)}`;
    await executeStmt(
      'INSERT INTO inquiries (id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email, phone || '', subject || 'General Inquiry', message]
    );

    const created = await queryOne('SELECT * FROM inquiries WHERE id = ?', [id]);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      data: formatInquiryRow(created)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/contact
 * List contact inquiries (for admin)
 */
router.get('/', async (req, res, next) => {
  try {
    const rows = await queryRows('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.json({
      success: true,
      count: rows.length,
      data: rows.map(formatInquiryRow)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/contact/:id/status
 * Update callback status (for admin)
 */
router.put('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await executeStmt(
      'UPDATE inquiries SET status = ? WHERE id = ?',
      [status || 'Contacted', id]
    );

    const updated = await queryOne('SELECT * FROM inquiries WHERE id = ?', [id]);

    res.json({
      success: true,
      data: formatInquiryRow(updated)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
