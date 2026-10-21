import express from 'express';
import { queryRows, queryOne, executeStmt } from '../config/db.js';

const router = express.Router();

/**
 * Format raw SQLite vehicle row to ensure JSON fields are parsed as objects/arrays
 */
function formatVehicleRow(row) {
  if (!row) return null;
  return {
    ...row,
    price: Number(row.price),
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    specs: typeof row.specs === 'string' ? JSON.parse(row.specs || '{}') : row.specs,
    included: typeof row.included === 'string' ? JSON.parse(row.included || '[]') : row.included,
    requirements: typeof row.requirements === 'string' ? JSON.parse(row.requirements || '[]') : row.requirements,
    faqs: typeof row.faqs === 'string' ? JSON.parse(row.faqs || '[]') : row.faqs
  };
}

/**
 * GET /api/vehicles
 * List all fleet vehicles with optional category, search, and status filters
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, status, search, location } = req.query;
    let sql = 'SELECT * FROM vehicles WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (location) {
      sql += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ? OR category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY created_at DESC';

    const rows = await queryRows(sql, params);
    const data = rows.map(formatVehicleRow);

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/vehicles/:id
 * Retrieve a single vehicle by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const row = await queryOne('SELECT * FROM vehicles WHERE id = ?', [id]);

    if (!row) {
      return res.status(404).json({
        success: false,
        error: `Vehicle with ID '${id}' not found`
      });
    }

    res.json({
      success: true,
      data: formatVehicleRow(row)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/vehicles
 * Register a new vehicle in fleet
 */
router.post('/', async (req, res, next) => {
  try {
    const v = req.body;
    const id = v.id || `vahan-${Date.now()}`;
    const title = v.title || 'Untitled Vehicle';
    const category = v.category || 'Bike';
    const item_type = v.item_type || v.itemType || 'Bike';
    const reg_no = v.reg_no || v.regNo || null;
    const price = typeof v.price === 'number' ? v.price : parseFloat(String(v.price).replace(/[^0-9.]/g, '')) || 1200;
    const daily_rate = v.daily_rate || v.dailyRate || `₹${price}/day`;
    const weekly_rate = v.weekly_rate || v.weeklyRate || null;
    const monthly_rate = v.monthly_rate || v.monthlyRate || null;
    const location = v.location || 'Tapovan Hub, Rishikesh';
    const status = v.status || 'Available';
    const image = v.image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800';
    const rating = parseFloat(v.rating) || 4.9;
    const reviews = parseInt(v.reviews, 10) || 12;
    const description = v.description || '';
    const hosted_by = v.hosted_by || v.hostedBy || 'Himalayan Fleet Host';
    const host_phone = v.host_phone || v.hostPhone || '+91 7060512661';
    
    const specs = JSON.stringify(v.specs || {});
    const included = JSON.stringify(v.included || []);
    const requirements = JSON.stringify(v.requirements || []);
    const faqs = JSON.stringify(v.faqs || []);

    const sql = `
      INSERT INTO vehicles (
        id, title, category, item_type, reg_no, price, daily_rate, weekly_rate, monthly_rate,
        location, status, image, rating, reviews, description, hosted_by, host_phone,
        specs, included, requirements, faqs
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await executeStmt(sql, [
      id, title, category, item_type, reg_no, price, daily_rate, weekly_rate, monthly_rate,
      location, status, image, rating, reviews, description, hosted_by, host_phone,
      specs, included, requirements, faqs
    ]);

    const created = await queryOne('SELECT * FROM vehicles WHERE id = ?', [id]);

    res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully in Turso DB',
      data: formatVehicleRow(created)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/vehicles/:id
 * Update an existing vehicle
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existing = await queryOne('SELECT * FROM vehicles WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    const fields = [];
    const values = [];

    const allowedKeys = [
      'title', 'category', 'item_type', 'reg_no', 'price', 'daily_rate', 
      'weekly_rate', 'monthly_rate', 'location', 'status', 'image', 
      'rating', 'reviews', 'description', 'hosted_by', 'host_phone'
    ];

    allowedKeys.forEach(key => {
      const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
      if (updates[key] !== undefined || updates[camelKey] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key] !== undefined ? updates[key] : updates[camelKey]);
      }
    });

    if (updates.specs !== undefined) {
      fields.push('specs = ?');
      values.push(typeof updates.specs === 'string' ? updates.specs : JSON.stringify(updates.specs));
    }
    if (updates.included !== undefined) {
      fields.push('included = ?');
      values.push(typeof updates.included === 'string' ? updates.included : JSON.stringify(updates.included));
    }
    if (updates.requirements !== undefined) {
      fields.push('requirements = ?');
      values.push(typeof updates.requirements === 'string' ? updates.requirements : JSON.stringify(updates.requirements));
    }

    if (fields.length === 0) {
      return res.json({ success: true, data: formatVehicleRow(existing), message: 'No fields to update' });
    }

    fields.push("updated_at = DATETIME('now')");
    values.push(id);

    const updateSql = `UPDATE vehicles SET ${fields.join(', ')} WHERE id = ?`;
    await executeStmt(updateSql, values);

    const updated = await queryOne('SELECT * FROM vehicles WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: formatVehicleRow(updated)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/vehicles/:id
 * Remove a vehicle from fleet
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await queryOne('SELECT id FROM vehicles WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    await executeStmt('DELETE FROM vehicles WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Vehicle ${id} deleted successfully`
    });
  } catch (error) {
    next(error);
  }
});

export default router;
