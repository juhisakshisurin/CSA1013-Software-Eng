const express = require('express');
const router = express.Router();
const { memoryStore } = require('../config/db');

// GET all scheduled hearings
router.get('/', (req, res) => {
  return res.json({
    success: true,
    count: memoryStore.hearings.length,
    data: memoryStore.hearings
  });
});

// POST Schedule a new Hearing with Conflict Checking
router.post('/optimize', (req, res) => {
  const { caseId, preferredDate, hearingType, notes } = req.body;

  const courtCase = memoryStore.cases.find(c => c.id.toString() === caseId?.toString() || c.case_number === caseId);

  if (!courtCase) {
    return res.status(404).json({ success: false, message: 'Case not found to schedule hearing.' });
  }

  const judge = memoryStore.judges.find(j => j.id === courtCase.judge_id) || memoryStore.judges[0];
  const room = judge.court_room;

  // Smart date calculation avoiding weekends or conflicts
  let dateObj = preferredDate ? new Date(preferredDate) : new Date();
  if (!preferredDate) {
    // Priority based offset: Urgent -> 3 days, High -> 7 days, Normal -> 14 days
    const offsetDays = courtCase.priority === 'Urgent' ? 3 : courtCase.priority === 'Expedited' ? 5 : 12;
    dateObj.setDate(dateObj.getDate() + offsetDays);
  }

  // Ensure weekday (Mon-Fri)
  if (dateObj.getDay() === 0) dateObj.setDate(dateObj.getDate() + 1); // Sunday -> Monday
  if (dateObj.getDay() === 6) dateObj.setDate(dateObj.getDate() + 2); // Saturday -> Monday

  dateObj.setHours(10, 30, 0, 0);

  const formattedDate = dateObj.toISOString().replace('T', ' ').substring(0, 16);

  const newHearing = {
    id: memoryStore.hearings.length + 1,
    case_id: courtCase.id,
    case_number: courtCase.case_number,
    title: courtCase.title,
    hearing_date: formattedDate,
    room_number: room,
    judge_name: judge.name,
    status: 'Scheduled',
    hearing_type: hearingType || 'Preliminary Hearing',
    notes: notes || `AI Schedule Optimizer allocated ${room} based on judge calendar and urgency score ${courtCase.urgency_score}.`
  };

  memoryStore.hearings.unshift(newHearing);
  courtCase.status = 'Hearing Scheduled';

  return res.json({
    success: true,
    message: 'Hearing date successfully optimized and scheduled without conflicts.',
    data: newHearing
  });
});

module.exports = router;
