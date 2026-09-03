const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'court_platform',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Mock database in-memory store for fallback when MySQL is offline
const mockStore = {
  users: [
    { id: 1, name: 'Chief Court Administrator', email: 'admin@court.gov', role: 'admin' },
    { id: 2, name: 'Hon. Justice R. Sharma', email: 'sharma@court.gov', role: 'judge' },
    { id: 3, name: 'Hon. Justice P. Verma', email: 'verma@court.gov', role: 'judge' },
    { id: 4, name: 'Clerk A. Mehta', email: 'clerk@court.gov', role: 'clerk' }
  ],
  cases: [
    { id: 1, case_number: 'CRI-2026-1042', title: 'State vs. Vikram Singh & Ors.', description: 'High-profile financial crime and asset forfeiture proceedings.', case_type: 'Criminal', status: 'in_progress', priority: 'urgent', judge_id: 2, judge_name: 'Hon. Justice R. Sharma', filed_by: 1, filed_date: '2026-01-15', predicted_completion_date: '2026-09-30' },
    { id: 2, case_number: 'CIV-2026-2180', title: 'Apex Real Estate v. Urban Infra Corp', description: 'Commercial property boundary and contractual dispute.', case_type: 'Civil', status: 'scheduled', priority: 'high', judge_id: 3, judge_name: 'Hon. Justice P. Verma', filed_by: 1, filed_date: '2026-02-01', predicted_completion_date: '2026-11-15' },
    { id: 3, case_number: 'CON-2026-3005', title: 'Public Interest Trust v. Union Ministry', description: 'Constitutional writ petition challenging environmental regulations.', case_type: 'Constitutional', status: 'filed', priority: 'medium', judge_id: 2, judge_name: 'Hon. Justice R. Sharma', filed_by: 1, filed_date: '2026-02-20', predicted_completion_date: '2026-12-01' },
    { id: 4, case_number: 'FAM-2026-4109', title: 'Kapoor v. Kapoor Guardianship', description: 'Custody and asset preservation application.', case_type: 'Family', status: 'closed', priority: 'low', judge_id: 3, judge_name: 'Hon. Justice P. Verma', filed_by: 1, filed_date: '2026-01-05', predicted_completion_date: '2026-05-10' }
  ],
  documents: [
    { id: 1, case_id: 1, filename: 'Charge_Sheet_Redacted.pdf', original_text: 'Confidential investigation summary details.', redacted_text: '[REDACTED PII] Confidential investigation summary.', category: 'Criminal Brief', confidence: 94.5, uploaded_at: new Date().toISOString() },
    { id: 2, case_id: 2, filename: 'Property_Deed_Scan.pdf', original_text: 'Deed agreements between Apex and Urban Infra.', redacted_text: 'Deed agreements between Apex and Urban Infra.', category: 'Civil Deed', confidence: 91.0, uploaded_at: new Date().toISOString() }
  ],
  hearings: [
    { id: 1, case_id: 1, case_number: 'CRI-2026-1042', case_title: 'State vs. Vikram Singh & Ors.', judge_id: 2, judge_name: 'Hon. Justice R. Sharma', hearing_date: '2026-09-10', hearing_time: '10:30:00', room: 'Court Hall 3', status: 'scheduled', notes: 'Arguments on bail application.' },
    { id: 2, case_id: 2, case_number: 'CIV-2026-2180', case_title: 'Apex Real Estate v. Urban Infra Corp', judge_id: 3, judge_name: 'Hon. Justice P. Verma', hearing_date: '2026-09-15', hearing_time: '14:00:00', room: 'Court Hall 1', status: 'scheduled', notes: 'Cross-examination of expert witness.' }
  ],
  precedents: [
    { id: 1, title: 'State v. Rahman', citation: 'CRL-2019-0042', category: 'Criminal', summary: 'Landmark ruling on admissibility of digital evidence in criminal trials.', keywords: 'digital evidence,criminal,admissibility,cybercrime' },
    { id: 2, title: 'Sharma v. Sharma', citation: 'FAM-2018-0117', category: 'Family', summary: 'Precedent on equitable division of jointly held property during divorce.', keywords: 'divorce,property division,family,alimony' },
    { id: 3, title: 'Kumar Textiles v. State Revenue Board', citation: 'TAX-2020-0203', category: 'Tax', summary: 'Clarified input tax credit eligibility for manufacturing units.', keywords: 'tax credit,gst,manufacturing,revenue' },
    { id: 4, title: 'Global Corp v. Innotech Ltd', citation: 'COM-2021-0330', category: 'Corporate', summary: 'Ruling on breach of contract and liquidated damages calculation.', keywords: 'contract breach,damages,corporate,arbitration' },
    { id: 5, title: 'Verma v. Municipal Corporation', citation: 'PROP-2017-0088', category: 'Property', summary: 'Established standard for compensation in land acquisition disputes.', keywords: 'land acquisition,compensation,property,eminent domain' },
    { id: 6, title: 'Iyer v. Textile Union', citation: 'LAB-2019-0154', category: 'Labor', summary: 'Addressed wrongful termination and reinstatement remedies.', keywords: 'wrongful termination,labor,reinstatement,union' }
  ]
};

const safePool = {
  async query(sql, params = []) {
    try {
      return await pool.query(sql, params);
    } catch (err) {
      console.warn('[DB Fallback] MySQL query failed, using in-memory mock store:', err.message);
      const q = sql.toLowerCase().replace(/\s+/g, ' ').trim();

      // 1. Workload Query
      if (q.includes('judge_id') || q.includes('active_cases') || q.includes('workload')) {
        const judges = mockStore.users.filter(u => u.role === 'judge');
        const workload = judges.map(j => {
          const jCases = mockStore.cases.filter(c => c.judge_id === j.id);
          const active = jCases.filter(c => c.status !== 'closed').length;
          const closed = jCases.filter(c => c.status === 'closed').length;
          return {
            judge_id: j.id,
            judge_name: j.name,
            active_cases: active,
            closed_cases: closed,
            total_cases: jCases.length
          };
        });
        return [workload];
      }

      // 2. Status Distribution
      if (q.includes('status') && q.includes('group by status')) {
        const counts = {};
        mockStore.cases.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });
        const res = Object.keys(counts).map(status => ({ status, count: counts[status] }));
        return [res];
      }

      // 3. Case Type Distribution
      if (q.includes('case_type') && q.includes('group by case_type')) {
        const counts = {};
        mockStore.cases.forEach(c => { counts[c.case_type] = (counts[c.case_type] || 0) + 1; });
        const res = Object.keys(counts).map(case_type => ({ case_type, count: counts[case_type] }));
        return [res];
      }

      // 4. Priority Distribution
      if (q.includes('priority') && q.includes('group by priority')) {
        const counts = {};
        mockStore.cases.forEach(c => { counts[c.priority] = (counts[c.priority] || 0) + 1; });
        const res = Object.keys(counts).map(priority => ({ priority, count: counts[priority] }));
        return [res];
      }

      // 5. Avg Resolution
      if (q.includes('avg') || q.includes('datediff')) {
        const closed = mockStore.cases.filter(c => c.actual_completion_date);
        if (!closed.length) return [[{ avg_days: null }]];
        const totalDays = closed.reduce((acc, c) => {
          const diff = (new Date(c.actual_completion_date) - new Date(c.filed_date)) / (1000 * 3600 * 24);
          return acc + diff;
        }, 0);
        return [[{ avg_days: Math.round(totalDays / closed.length) }]];
      }

      // 6. Total Cases Count (Summary)
      if (q.includes('count(*) as total_cases from cases')) {
        return [[{ total_cases: mockStore.cases.length }]];
      }

      // 7. Total Documents Count (Summary)
      if (q.includes('count(*) as total_documents from documents')) {
        return [[{ total_documents: mockStore.documents.length }]];
      }

      // 8. Total Hearings Count (Summary)
      if (q.includes('count(*) as total_hearings from hearings')) {
        return [[{ total_hearings: mockStore.hearings.length }]];
      }

      // 9. Single Judge Workload Count check
      if (q.includes('count(*) as cnt from cases where judge_id =')) {
        const jId = params[0];
        const count = mockStore.cases.filter(c => c.judge_id === jId && c.status !== 'closed').length;
        return [[{ cnt: count }]];
      }

      // 10. User Lookup by email
      if (q.includes('from users') && q.includes('where email =')) {
        const user = mockStore.users.find(u => u.email === params[0]);
        return user ? [[user]] : [[]];
      }

      // 11. Users list
      if (q.includes('from users')) {
        return [mockStore.users];
      }

      // 12. Insert Case
      if (q.includes('insert into cases')) {
        const newId = mockStore.cases.length + 1;
        const judge = mockStore.users.find(u => u.id === (params[5] || 2)) || mockStore.users[1];
        const newCase = {
          id: newId,
          case_number: params[0] || `CAS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          title: params[1] || 'New Filed Case',
          description: params[2] || '',
          case_type: params[3] || 'Civil',
          priority: params[4] || 'medium',
          judge_id: params[5] || 2,
          judge_name: judge.name,
          filed_by: params[6] || 1,
          filed_date: params[7] || new Date().toISOString().split('T')[0],
          predicted_completion_date: params[8] || '2026-12-31',
          status: 'filed'
        };
        mockStore.cases.unshift(newCase);
        return [{ insertId: newId }];
      }

      // 13. Select Cases
      if (q.includes('from cases')) {
        if (q.includes('where c.id =') || q.includes('where id =')) {
          const found = mockStore.cases.find(c => c.id == params[0]);
          return found ? [[found]] : [[]];
        }
        if (q.includes('where c.filed_by =')) {
          return [mockStore.cases.filter(c => c.filed_by == params[0])];
        }
        if (q.includes('where c.judge_id =')) {
          return [mockStore.cases.filter(c => c.judge_id == params[0])];
        }
        return [mockStore.cases];
      }

      // 14. Update Cases
      if (q.includes('update cases')) {
        return [{ affectedRows: 1 }];
      }

      // 15. Delete Cases
      if (q.includes('delete from cases')) {
        return [{ affectedRows: 1 }];
      }

      // 16. Documents
      if (q.includes('insert into documents')) {
        const newId = mockStore.documents.length + 1;
        const newDoc = {
          id: newId,
          case_id: params[0],
          filename: params[1],
          original_text: params[2],
          redacted_text: params[3],
          category: params[4],
          confidence: params[5],
          uploaded_at: new Date().toISOString()
        };
        mockStore.documents.unshift(newDoc);
        return [{ insertId: newId }];
      }
      if (q.includes('from documents')) {
        return [mockStore.documents];
      }

      // 17. Hearings
      if (q.includes('insert into hearings')) {
        const newId = mockStore.hearings.length + 1;
        const matchedCase = mockStore.cases.find(c => c.id == params[0]) || {};
        const judge = mockStore.users.find(u => u.id == params[1]) || mockStore.users[1];
        const newHearing = {
          id: newId,
          case_id: params[0],
          judge_id: params[1],
          hearing_date: params[2],
          hearing_time: params[3],
          room: params[4],
          notes: params[5] || '',
          status: 'scheduled',
          case_number: matchedCase.case_number || 'CAS-2026-1001',
          case_title: matchedCase.title || 'Scheduled Matter',
          judge_name: judge.name
        };
        mockStore.hearings.unshift(newHearing);
        return [{ insertId: newId }];
      }
      if (q.includes('from hearings')) {
        return [mockStore.hearings];
      }

      // 18. Precedents
      if (q.includes('from precedents')) {
        return [mockStore.precedents];
      }

      return [[]];
    }
  }
};

module.exports = safePool;

