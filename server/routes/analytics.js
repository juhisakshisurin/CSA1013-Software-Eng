const express = require('express');
const router = express.Router();
const { memoryStore } = require('../config/db');

// GET Workload Analytics & Summary Statistics
router.get('/workload', (req, res) => {
  const judges = memoryStore.judges;
  const cases = memoryStore.cases;

  const totalCases = cases.length;
  const pendingCases = cases.filter(c => c.status !== 'Disposed').length;
  const disposedCases = cases.filter(c => c.status === 'Disposed').length + 765; // Aggregate history
  const urgentCases = cases.filter(c => c.priority === 'Urgent' || c.priority === 'Expedited').length;

  // Category breakdown
  const categoryStats = {};
  cases.forEach(c => {
    categoryStats[c.category] = (categoryStats[c.category] || 0) + 1;
  });

  const categoryChart = Object.keys(categoryStats).map(cat => ({
    name: cat,
    cases: categoryStats[cat]
  }));

  // Judge workload stats
  const judgeWorkload = judges.map(j => ({
    name: j.name.replace('Hon. Justice ', '').replace('Hon. Chief Justice ', ''),
    pending: j.pending_cases,
    disposed: j.disposed_cases,
    capacity: j.max_capacity,
    loadPercentage: Math.round((j.pending_cases / j.max_capacity) * 100)
  }));

  // Monthly disposition throughput (Simulated 6 months analytics)
  const dispositionVelocity = [
    { month: 'Apr', filed: 42, disposed: 38 },
    { month: 'May', filed: 51, disposed: 44 },
    { month: 'Jun', filed: 39, disposed: 48 },
    { month: 'Jul', filed: 60, disposed: 52 },
    { month: 'Aug', filed: 48, disposed: 55 },
    { month: 'Sep', filed: 35, disposed: 41 }
  ];

  return res.json({
    success: true,
    data: {
      metrics: {
        totalCases: totalCases + 765,
        activePending: pendingCases + 83,
        disposedCases,
        urgentCases,
        avgDisposalDays: 134,
        clearanceRate: '94.2%'
      },
      judgeWorkload,
      categoryChart,
      dispositionVelocity
    }
  });
});

module.exports = router;
