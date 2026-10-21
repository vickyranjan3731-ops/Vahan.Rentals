import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { queryRows, queryOne, executeStmt } from '../config/db.js';

const router = express.Router();

/**
 * GET /api/reviews/:vehicleId
 * Get reviews for a vehicle
 */
router.get('/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const rows = await queryRows(
      'SELECT * FROM reviews WHERE vehicle_id = ? ORDER BY created_at DESC',
      [vehicleId]
    );

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
 * POST /api/reviews
 * Add review for a vehicle
 */
router.post('/', async (req, res, next) => {
  try {
    const { vehicleId, vehicle_id, userName, user_name, userAvatar, user_avatar, rating, comment } = req.body;
    const targetVehicleId = vehicleId || vehicle_id;

    if (!targetVehicleId || !comment || !rating) {
      return res.status(400).json({ success: false, error: 'Vehicle ID, rating, and comment are required' });
    }

    const id = uuidv4();
    const name = userName || user_name || 'Verified Rider';
    const avatar = userAvatar || user_avatar || '';
    const rateNum = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));

    await executeStmt(
      'INSERT INTO reviews (id, vehicle_id, user_name, user_avatar, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
      [id, targetVehicleId, name, avatar, rateNum, comment]
    );

    // Recalculate average rating & review count for vehicle
    const stats = await queryOne(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE vehicle_id = ?',
      [targetVehicleId]
    );

    if (stats && stats.total_reviews > 0) {
      await executeStmt(
        'UPDATE vehicles SET rating = ?, reviews = ? WHERE id = ?',
        [parseFloat(stats.avg_rating.toFixed(1)), stats.total_reviews, targetVehicleId]
      );
    }

    const created = await queryOne('SELECT * FROM reviews WHERE id = ?', [id]);

    res.status(201).json({
      success: true,
      data: created
    });
  } catch (error) {
    next(error);
  }
});

export default router;
