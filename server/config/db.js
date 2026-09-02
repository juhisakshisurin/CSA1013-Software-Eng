const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'court_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// In-Memory Data Store Fallback if MySQL server is not running locally
const memoryStore = {
  judges: [
    { id: 1, name: 'Hon. Chief Justice Eleanor Vance', title: 'Senior Appellate Judge', court_room: 'Courtroom 101-A', specialization: 'Constitutional', pending_cases: 14, disposed_cases: 185, max_capacity: 40 },
    { id: 2, name: 'Hon. Justice Marcus Sterling', title: 'District Senior Judge', court_room: 'Courtroom 204-B', specialization: 'Criminal', pending_cases: 28, disposed_cases: 240, max_capacity: 50 },
    { id: 3, name: 'Hon. Justice Priya Sharma', title: 'Circuit Court Judge', court_room: 'Courtroom 108-C', specialization: 'Corporate & Tax', pending_cases: 19, disposed_cases: 142, max_capacity: 45 },
    { id: 4, name: 'Hon. Justice Robert Thorne', title: 'District Magistrate', court_room: 'Courtroom 302-A', specialization: 'Civil & Family', pending_cases: 22, disposed_cases: 198, max_capacity: 45 }
  ],
  cases: [
    { id: 101, case_number: 'CR-2026-0842', title: 'State vs. Apex Logistics Corp.', category: 'Criminal', sub_category: 'Financial Fraud', status: 'Hearing Scheduled', priority: 'Urgent', filing_date: '2026-02-10', estimated_completion_date: '2026-10-15', judge_id: 2, judge_name: 'Hon. Justice Marcus Sterling', complainant: 'State Prosecution Dept', respondent: 'Apex Logistics Directors', summary: 'Allegations of systematic multi-million corporate tax embezzlement and fraudulent financial filings.', evidence_count: 14, witness_count: 6, urgency_score: 88 },
    { id: 102, case_number: 'CV-2026-0194', title: 'Horizon Tech Solutions vs. CyberDyn Systems', category: 'Corporate', sub_category: 'Intellectual Property Breach', status: 'Under Review', priority: 'High Priority', filing_date: '2026-03-01', estimated_completion_date: '2026-11-30', judge_id: 3, judge_name: 'Hon. Justice Priya Sharma', complainant: 'Horizon Tech Solutions Ltd.', respondent: 'CyberDyn Systems Inc.', summary: 'Breach of non-disclosure agreement and misappropriation of proprietary AI source code algorithms.', evidence_count: 8, witness_count: 4, urgency_score: 72 },
    { id: 103, case_number: 'CO-2025-0911', title: 'Citizens Alliance vs. Ministry of Environment', category: 'Constitutional', sub_category: 'Environmental Protection Act', status: 'Verdict Reserved', priority: 'Expedited', filing_date: '2025-11-15', estimated_completion_date: '2026-09-20', judge_id: 1, judge_name: 'Hon. Chief Justice Eleanor Vance', complainant: 'Citizens Environmental Alliance', respondent: 'Ministry of Environment & Forests', summary: 'Public interest litigation challenging coastal industrial zone expansion without environmental clearance.', evidence_count: 22, witness_count: 9, urgency_score: 95 },
    { id: 104, case_number: 'FM-2026-0451', title: 'Estate of Harrison vs. Trust Bank Corp', category: 'Family', sub_category: 'Inheritance & Trust Dispute', status: 'Filed', priority: 'Normal', filing_date: '2026-04-12', estimated_completion_date: '2026-12-05', judge_id: 4, judge_name: 'Hon. Justice Robert Thorne', complainant: 'Clara Harrison & Heirs', respondent: 'Trust Bank Trustees', summary: 'Dispute over execution of family trust deed and contested asset valuation of commercial real estate.', evidence_count: 5, witness_count: 2, urgency_score: 40 },
    { id: 105, case_number: 'TX-2026-0310', title: 'Vanguard Trading vs. Revenue Commissioner', category: 'Tax', sub_category: 'Corporate Excise Assessment', status: 'Hearing Scheduled', priority: 'Normal', filing_date: '2026-03-18', estimated_completion_date: '2026-11-10', judge_id: 3, judge_name: 'Hon. Justice Priya Sharma', complainant: 'Vanguard Global Trading', respondent: 'State Revenue Commissioner', summary: 'Appeal against penalty assessment on cross-border software licensing transfer pricing.', evidence_count: 9, witness_count: 3, urgency_score: 58 },
    { id: 106, case_number: 'CR-2026-1102', title: 'State vs. David Vance & Co.', category: 'Criminal', sub_category: 'Cyber Extortion & Ransomware', status: 'Under Review', priority: 'Urgent', filing_date: '2026-05-04', estimated_completion_date: '2026-12-18', judge_id: 2, judge_name: 'Hon. Justice Marcus Sterling', complainant: 'Cyber Crime Task Force', respondent: 'David Vance', summary: 'Illegal interception of municipal database systems and extortion attempt.', evidence_count: 18, witness_count: 5, urgency_score: 84 }
  ],
  hearings: [
    { id: 1, case_id: 101, case_number: 'CR-2026-0842', title: 'State vs. Apex Logistics Corp.', hearing_date: '2026-09-10T10:30:00', room_number: 'Courtroom 204-B', judge_name: 'Hon. Justice Marcus Sterling', status: 'Scheduled', hearing_type: 'Cross-examination of forensic accountants', notes: 'Defense requested additional time for expert witness submission.' },
    { id: 2, case_id: 103, case_number: 'CO-2025-0911', title: 'Citizens Alliance vs. Ministry of Environment', hearing_date: '2026-09-14T14:00:00', room_number: 'Courtroom 101-A', judge_name: 'Hon. Chief Justice Eleanor Vance', status: 'Scheduled', hearing_type: 'Final Arguments on Constitutional Validity', notes: 'Bench panel comprising 3 judges will review statutory compliance docs.' },
    { id: 3, case_id: 105, case_number: 'TX-2026-0310', title: 'Vanguard Trading vs. Revenue Commissioner', hearing_date: '2026-09-18T11:00:00', room_number: 'Courtroom 108-C', judge_name: 'Hon. Justice Priya Sharma', status: 'Scheduled', hearing_type: 'Evidentiary Hearing on Tax Deductions', notes: 'Revenue auditor to present certified calculation spreadsheets.' }
  ],
  precedents: [
    { id: 1, citation: '2021 AIR SC 4412', title: 'State of Maharashtra vs. TechCorp International', legal_domain: 'Corporate & Cyber Law', summary: 'Unlawful access to server infrastructure and intellectual property theft via corporate espionage.', verdict: 'Held guilty. Mandatory 5-year injunction and punitive damages awarded for proprietary algorithm theft.', key_principles: 'Corporate IP protection; digital forensics evidentiary standards; trade secret breach liabilities.', year: 2021, relevance_keywords: 'intellectual property, software, trade secrets, cyber crime, corporate breach' },
    { id: 2, citation: '2019 AIR SC 1180', title: 'Green Earth Foundation vs. Union Industrial Board', legal_domain: 'Constitutional Law', summary: 'Public Interest Litigation demanding immediate stay on industrial zone development missing EIA approval.', verdict: 'Injunction granted. Environmental Impact Assessment made mandatory before state clearance.', key_principles: 'Precautionary principle; Right to clean environment under Article 21; Statutory compliance.', year: 2019, relevance_keywords: 'environment, public interest, constitutional validity, EIA clearance, industrial zone' },
    { id: 3, citation: '2023 AIR SC 2891', title: 'Commissioner of Income Tax vs. Apex Holdings Ltd', legal_domain: 'Taxation Law', summary: 'Dispute over arm length transfer pricing for international software licensing royalties.', verdict: 'Assessment set aside. Revenue authority directed to recalculate tax using international benchmark.', key_principles: 'Transfer pricing methodology; OECD guidelines applicability; software royalty taxation rules.', year: 2023, relevance_keywords: 'taxation, transfer pricing, corporate excise, software royalty, revenue assessment' }
  ]
};

let pool = null;
let isUsingMySQL = false;

async function initDB() {
  try {
    // Try connecting to MySQL
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    await connection.end();

    pool = mysql.createPool(dbConfig);
    
    // Quick test query
    await pool.query('SELECT 1');
    isUsingMySQL = true;
    console.log(`[Database] Connected successfully to MySQL (${dbConfig.host}:${dbConfig.port}/${dbConfig.database})`);
    
    // Create tables if not exist
    await createTables();
  } catch (err) {
    isUsingMySQL = false;
    console.log('[Database] MySQL server not reached or credentials missing. Operating with high-performance In-Memory database store.');
  }
}

async function createTables() {
  if (!isUsingMySQL) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS judges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        title VARCHAR(100) NOT NULL,
        court_room VARCHAR(50) NOT NULL,
        specialization VARCHAR(100) NOT NULL,
        pending_cases INT DEFAULT 0,
        disposed_cases INT DEFAULT 0,
        max_capacity INT DEFAULT 50
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        case_number VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        sub_category VARCHAR(100),
        status VARCHAR(50) NOT NULL DEFAULT 'Filed',
        priority VARCHAR(20) NOT NULL DEFAULT 'Normal',
        filing_date DATE NOT NULL,
        estimated_completion_date DATE,
        judge_id INT,
        complainant VARCHAR(150) NOT NULL,
        respondent VARCHAR(150) NOT NULL,
        summary TEXT,
        evidence_count INT DEFAULT 1,
        witness_count INT DEFAULT 1,
        urgency_score INT DEFAULT 50
      );
    `);
  } catch (e) {
    console.error('[Database] Table setup error:', e.message);
  }
}

initDB();

module.exports = {
  pool: () => pool,
  isUsingMySQL: () => isUsingMySQL,
  memoryStore
};
