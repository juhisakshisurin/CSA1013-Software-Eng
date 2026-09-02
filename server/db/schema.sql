-- Smart Court Case Management & Judicial Analytics Platform Schema
-- Database: court_db

CREATE DATABASE IF NOT EXISTS court_db;
USE court_db;

-- Table: judges
CREATE TABLE IF NOT EXISTS judges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    court_room VARCHAR(50) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    pending_cases INT DEFAULT 0,
    disposed_cases INT DEFAULT 0,
    max_capacity INT DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: cases
CREATE TABLE IF NOT EXISTS cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Criminal, Civil, Constitutional, Corporate, Family, Tax
    sub_category VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'Filed', -- Filed, Under Review, Hearing Scheduled, Verdict Reserved, Disposed
    priority VARCHAR(20) NOT NULL DEFAULT 'Normal', -- Normal, Urgent, High Priority, Expedited
    filing_date DATE NOT NULL,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    judge_id INT,
    complainant VARCHAR(150) NOT NULL,
    respondent VARCHAR(150) NOT NULL,
    summary TEXT,
    evidence_count INT DEFAULT 1,
    witness_count INT DEFAULT 1,
    urgency_score INT DEFAULT 50, -- 1-100 score computed by AI
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (judge_id) REFERENCES judges(id) ON DELETE SET NULL
);

-- Table: hearings
CREATE TABLE IF NOT EXISTS hearings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL,
    hearing_date DATETIME NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Scheduled', -- Scheduled, In Progress, Adjourned, Completed
    hearing_type VARCHAR(100) DEFAULT 'Preliminary Hearing',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Table: documents
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    file_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Affidavit, Petition, Evidence, Charge Sheet, Written Submission
    original_text TEXT,
    redacted_text TEXT,
    confidence_score DECIMAL(5,2),
    redaction_count INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Table: precedents
CREATE TABLE IF NOT EXISTS precedents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    citation VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    legal_domain VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    verdict TEXT NOT NULL,
    key_principles TEXT NOT NULL,
    year INT NOT NULL,
    relevance_keywords TEXT
);
