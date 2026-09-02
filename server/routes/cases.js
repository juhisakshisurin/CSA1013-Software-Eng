const express = require('express');
const router = express.Router();
const { pool, isUsingMySQL, memoryStore } = require('../config/db');

// GET all cases (with optional category and search filters)
router.get('/', async (req, res) => {
  const { category, search, priority } = req.query;

  if (isUsingMySQL()) {
    try {
      let query = `
        SELECT c.*, j.name as judge_name 
        FROM cases c 
        LEFT JOIN judges j ON c.judge_id = j.id
        WHERE 1=1
      `;
      const params = [];

      if (category && category !== 'All') {
        query += ` AND c.category = ?`;
        params.push(category);
      }
      if (priority && priority !== 'All') {
        query += ` AND c.priority = ?`;
        params.push(priority);
      }
      if (search) {
        query += ` AND (c.case_number LIKE ? OR c.title LIKE ? OR c.complainant LIKE ? OR c.respondent LIKE ?)`;
        const term = `%${search}%`;
        params.push(term, term, term, term);
      }
      query += ` ORDER BY c.id DESC`;

      const [rows] = await pool().query(query, params);
      return res.json({ success: true, count: rows.length, data: rows, source: 'mysql' });
    } catch (err) {
      console.error('MySQL query error, using memory fallback:', err.message);
    }
  }

  // Memory fallback
  let filtered = [...memoryStore.cases];
  if (category && category !== 'All') {
    filtered = filtered.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }
  if (priority && priority !== 'All') {
    filtered = filtered.filter(c => c.priority.toLowerCase() === priority.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(c =>
      c.case_number.toLowerCase().includes(s) ||
      c.title.toLowerCase().includes(s) ||
      c.complainant.toLowerCase().includes(s) ||
      c.respondent.toLowerCase().includes(s)
    );
  }

  return res.json({ success: true, count: filtered.length, data: filtered, source: 'memory' });
});

// GET case by ID or Case Number (for Citizen Portal)
router.get('/:idOrNum', async (req, res) => {
  const param = req.params.idOrNum;
  let caseItem = null;

  if (isUsingMySQL()) {
    try {
      const [rows] = await pool().query(
        `SELECT c.*, j.name as judge_name, j.court_room 
         FROM cases c 
         LEFT JOIN judges j ON c.judge_id = j.id 
         WHERE c.id = ? OR c.case_number = ?`,
        [param, param]
      );
      if (rows.length > 0) caseItem = rows[0];
    } catch (e) {
      console.error(e.message);
    }
  }

  if (!caseItem) {
    caseItem = memoryStore.cases.find(
      c => c.id.toString() === param || c.case_number.toLowerCase() === param.toLowerCase()
    );
  }

  if (!caseItem) {
    return res.status(404).json({ success: false, message: 'Court Case record not found.' });
  }

  // Find associated hearings
  const hearings = memoryStore.hearings.filter(h => h.case_id === caseItem.id);

  return res.json({
    success: true,
    data: {
      ...caseItem,
      hearings
    }
  });
});

// POST Create new Court Case
router.post('/', async (req, res) => {
  const {
    title, category, sub_category, priority, filing_date,
    judge_id, complainant, respondent, summary,
    evidence_count, witness_count
  } = req.body;

  if (!title || !category || !complainant || !respondent) {
    return res.status(400).json({ success: false, message: 'Title, category, complainant, and respondent are required.' });
  }

  const categoryPrefix = category.substring(0, 2).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  const case_number = `${categoryPrefix}-${year}-${randomNum}`;

  // AI urgency calculation based on witnesses, evidence, priority
  let urgency = 50;
  if (priority === 'Urgent' || priority === 'Expedited') urgency += 30;
  if (category === 'Criminal' || category === 'Constitutional') urgency += 15;
  urgency += Math.min(20, (parseInt(witness_count || 1) + parseInt(evidence_count || 1)) * 2);
  urgency = Math.min(99, Math.max(10, urgency));

  // AI timeline estimation (days)
  const baseDays = category === 'Criminal' ? 180 : category === 'Constitutional' ? 240 : 120;
  const estimatedDays = baseDays + (parseInt(witness_count || 1) * 15) - (urgency > 80 ? 30 : 0);
  const estDate = new Date();
  estDate.setDate(estDate.getDate() + estimatedDays);
  const estimated_completion_date = estDate.toISOString().split('T')[0];

  // Assign judge if not selected
  const assignedJudgeId = judge_id || (Math.floor(Math.random() * 4) + 1);
  const judgeObj = memoryStore.judges.find(j => j.id == assignedJudgeId);
  const judge_name = judgeObj ? judgeObj.name : 'Hon. Chief Justice Eleanor Vance';

  const newCase = {
    id: Date.now(),
    case_number,
    title,
    category,
    sub_category: sub_category || 'General Proceeding',
    status: 'Filed',
    priority: priority || 'Normal',
    filing_date: filing_date || new Date().toISOString().split('T')[0],
    estimated_completion_date,
    judge_id: parseInt(assignedJudgeId),
    judge_name,
    complainant,
    respondent,
    summary: summary || 'Standard legal filing requiring judicial review.',
    evidence_count: parseInt(evidence_count || 1),
    witness_count: parseInt(witness_count || 1),
    urgency_score: urgency
  };

  if (isUsingMySQL()) {
    try {
      await pool().query(
        `INSERT INTO cases (case_number, title, category, sub_category, status, priority, filing_date, estimated_completion_date, judge_id, complainant, respondent, summary, evidence_count, witness_count, urgency_score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newCase.case_number, newCase.title, newCase.category, newCase.sub_category,
          newCase.status, newCase.priority, newCase.filing_date, newCase.estimated_completion_date,
          newCase.judge_id, newCase.complainant, newCase.respondent, newCase.summary,
          newCase.evidence_count, newCase.witness_count, newCase.urgency_score
        ]
      );
    } catch (e) {
      console.error('MySQL Insert Error:', e.message);
    }
  }

  memoryStore.cases.unshift(newCase);

  return res.status(201).json({
    success: true,
    message: 'Court Case successfully registered and digitized.',
    data: newCase
  });
});

// PUT update Case status or priority
router.put('/:id', async (req, res) => {
  const caseId = req.params.id;
  const { status, priority, judge_id } = req.body;

  const caseIndex = memoryStore.cases.findIndex(c => c.id.toString() === caseId);
  if (caseIndex === -1) {
    return res.status(404).json({ success: false, message: 'Case not found' });
  }

  if (status) memoryStore.cases[caseIndex].status = status;
  if (priority) memoryStore.cases[caseIndex].priority = priority;
  if (judge_id) {
    memoryStore.cases[caseIndex].judge_id = parseInt(judge_id);
    const j = memoryStore.judges.find(j => j.id == judge_id);
    if (j) memoryStore.cases[caseIndex].judge_name = j.name;
  }

  return res.json({
    success: true,
    message: 'Case status updated successfully.',
    data: memoryStore.cases[caseIndex]
  });
});

module.exports = router;
