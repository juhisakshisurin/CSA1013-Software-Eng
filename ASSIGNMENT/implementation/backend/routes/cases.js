const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { predictCompletionDate } = require('../utils/predictor');

const router = express.Router();
router.use(authenticate);

// List cases (role-aware: citizens see only their own filed cases)
router.get('/', async (req, res) => {
  try {
    let query = `SELECT c.*, u.name AS judge_name FROM cases c
                 LEFT JOIN users u ON c.judge_id = u.id`;
    const params = [];
    if (req.user.role === 'citizen') {
      query += ' WHERE c.filed_by = ?';
      params.push(req.user.id);
    } else if (req.user.role === 'judge') {
      query += ' WHERE c.judge_id = ?';
      params.push(req.user.id);
    }
    query += ' ORDER BY c.created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, u.name AS judge_name FROM cases c
       LEFT JOIN users u ON c.judge_id = u.id WHERE c.id = ?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Case not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create case (clerk/admin only) — auto-generates case number and predicted timeline
router.post('/', authorize('admin', 'clerk'), async (req, res) => {
  try {
    const { title, description, case_type, priority, judge_id, filed_date, filed_by } = req.body;
    if (!title || !case_type || !filed_date) return res.status(400).json({ error: 'Missing required fields' });

    const caseNumber = `${case_type.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let judgeActiveCaseCount = 0;
    if (judge_id) {
      const [wc] = await pool.query(
        "SELECT COUNT(*) AS cnt FROM cases WHERE judge_id = ? AND status != 'closed'", [judge_id]
      );
      judgeActiveCaseCount = wc[0].cnt;
    }

    const { predictedDate } = predictCompletionDate({
      caseType: case_type,
      priority: priority || 'medium',
      filedDate: filed_date,
      judgeActiveCaseCount
    });

    const [result] = await pool.query(
      `INSERT INTO cases (case_number, title, description, case_type, priority, judge_id, filed_by, filed_date, predicted_completion_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [caseNumber, title, description || '', case_type, priority || 'medium', judge_id || null, filed_by || req.user.id, filed_date, predictedDate]
    );

    await pool.query('INSERT INTO case_status_history (case_id, status) VALUES (?, ?)', [result.insertId, 'filed']);

    res.status(201).json({ id: result.insertId, case_number: caseNumber, predicted_completion_date: predictedDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authorize('admin', 'clerk', 'judge'), async (req, res) => {
  try {
    const { status, priority, judge_id, actual_completion_date } = req.body;
    const fields = [];
    const values = [];
    if (status) { fields.push('status = ?'); values.push(status); }
    if (priority) { fields.push('priority = ?'); values.push(priority); }
    if (judge_id) { fields.push('judge_id = ?'); values.push(judge_id); }
    if (actual_completion_date) { fields.push('actual_completion_date = ?'); values.push(actual_completion_date); }
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });

    values.push(req.params.id);
    await pool.query(`UPDATE cases SET ${fields.join(', ')} WHERE id = ?`, values);

    if (status) {
      await pool.query('INSERT INTO case_status_history (case_id, status) VALUES (?, ?)', [req.params.id, status]);
    }
    res.json({ message: 'Case updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM cases WHERE id = ?', [req.params.id]);
    res.json({ message: 'Case deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
