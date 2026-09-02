const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const casesRouter = require('./routes/cases');
const aiRouter = require('./routes/ai');
const analyticsRouter = require('./routes/analytics');
const scheduleRouter = require('./routes/schedule');
const { isUsingMySQL } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/cases', casesRouter);
app.use('/api/ai', aiRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/schedule', scheduleRouter);

// Health & System Info API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'AI-Powered Smart Court Case Management & Judicial Analytics Platform',
    timestamp: new Date().toISOString(),
    database: isUsingMySQL() ? 'MySQL Connected' : 'High-Performance In-Memory Data Engine (Active)',
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚖️  Smart Court API Server running on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
