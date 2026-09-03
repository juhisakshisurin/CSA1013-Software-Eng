const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT h.*, c.title AS case_title, c.case_number, u.name AS judge_name
       FROM hearings h
       JOIN cases c ON h.case_id = c.id
       JOIN users u ON h.judge_id = u.id
       ORDER BY h.hearing_date, h.hearing_time`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Smart scheduling: checks judge availability and auto-suggests the next free slot on conflict
router.post('/', authorize('admin', 'clerk'), async (req, res) => {
  try {
    const { case_id, judge_id, hearing_date, hearing_time, room, notes } = req.body;
    if (!case_id || !judge_id || !hearing_date || !hearing_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [conflicts] = await pool.query(
      `SELECT * FROM hearings WHERE judge_id = ? AND hearing_date = ? AND hearing_time = ? AND status = 'scheduled'`,
      [judge_id, hearing_date, hearing_time]
    );

    if (conflicts.length) {
      const [busySlots] = await pool.query(
        `SELECT hearing_time FROM hearings WHERE judge_id = ? AND hearing_date = ? AND status = 'scheduled'`,
        [judge_id, hearing_date]
      );
      const busy = new Set(busySlots.map(r => r.hearing_time.slice(0, 5)));
      const slots = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00'];
      const suggestion = slots.find(s => !busy.has(s));
      return res.status(409).json({
        error: 'Judge already has a hearing at this time',
        suggestedTime: suggestion || 'No slots free that day'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO hearings (case_id, judge_id, hearing_date, hearing_time, room, notes) VALUES (?, ?, ?, ?, ?, ?)`,
      [case_id, judge_id, hearing_date, hearing_time, room || 'Room 1', notes || '']
    );
    await pool.query("UPDATE cases SET status = 'scheduled' WHERE id = ?", [case_id]);

    res.status(201).json({ id: result.insertId, message: 'Hearing scheduled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authorize('admin', 'clerk', 'judge'), async (req, res) => {
  try {
    const { status, hearing_date, hearing_time, notes } = req.body;
    const fields = []; const values = [];
    if (status) { fields.push('status = ?'); values.push(status); }
    if (hearing_date) { fields.push('hearing_date = ?'); values.push(hearing_date); }
    if (hearing_time) { fields.push('hearing_time = ?'); values.push(hearing_time); }
    if (notes !== undefined) { fields.push('notes = ?'); values.push(notes); }
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });
    values.push(req.params.id);
    await pool.query(`UPDATE hearings SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'Hearing updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
