-- Seed Data for Smart Court Platform
USE court_db;

-- Insert Judges
INSERT INTO judges (id, name, title, court_room, specialization, pending_cases, disposed_cases, max_capacity) VALUES
(1, 'Hon. Chief Justice Eleanor Vance', 'Senior Appellate Judge', 'Courtroom 101-A', 'Constitutional', 14, 185, 40),
(2, 'Hon. Justice Marcus Sterling', 'District Senior Judge', 'Courtroom 204-B', 'Criminal', 28, 240, 50),
(3, 'Hon. Justice Priya Sharma', 'Circuit Court Judge', 'Courtroom 108-C', 'Corporate & Tax', 19, 142, 45),
(4, 'Hon. Justice Robert Thorne', 'District Magistrate', 'Courtroom 302-A', 'Civil & Family', 22, 198, 45);

-- Insert Cases
INSERT INTO cases (id, case_number, title, category, sub_category, status, priority, filing_date, estimated_completion_date, judge_id, complainant, respondent, summary, evidence_count, witness_count, urgency_score) VALUES
(101, 'CR-2026-0842', 'State vs. Apex Logistics Corp.', 'Criminal', 'Financial Fraud', 'Hearing Scheduled', 'Urgent', '2026-02-10', '2026-10-15', 2, 'State Prosecution Dept', 'Apex Logistics Directors', 'Allegations of systematic multi-million corporate tax embezzlement and fraudulent financial filings.', 14, 6, 88),
(102, 'CV-2026-0194', 'Horizon Tech Solutions vs. CyberDyn Systems', 'Corporate', 'Intellectual Property Breach', 'Under Review', 'High Priority', '2026-03-01', '2026-11-30', 3, 'Horizon Tech Solutions Ltd.', 'CyberDyn Systems Inc.', 'Breach of non-disclosure agreement and misappropriation of proprietary AI source code algorithms.', 8, 4, 72),
(103, 'CO-2025-0911', 'Citizens Alliance vs. Ministry of Environment', 'Constitutional', 'Environmental Protection Act', 'Verdict Reserved', 'Expedited', '2025-11-15', '2026-09-20', 1, 'Citizens Environmental Alliance', 'Ministry of Environment & Forests', 'Public interest litigation challenging coastal industrial zone expansion without environmental clearance.', 22, 9, 95),
(104, 'FM-2026-0451', 'Estate of Harrison vs. Trust Bank Corp', 'Family', 'Inheritance & Trust Dispute', 'Filed', 'Normal', '2026-04-12', '2026-12-05', 4, 'Clara Harrison & Heirs', 'Trust Bank Trustees', 'Dispute over execution of family trust deed and contested asset valuation of commercial real estate.', 5, 2, 40),
(105, 'TX-2026-0310', 'Vanguard Trading vs. Revenue Commissioner', 'Tax', 'Corporate Excise Assessment', 'Hearing Scheduled', 'Normal', '2026-03-18', '2026-11-10', 3, 'Vanguard Global Trading', 'State Revenue Commissioner', 'Appeal against penalty assessment on cross-border software licensing transfer pricing.', 9, 3, 58),
(106, 'CR-2026-1102', 'State vs. David Vance & Co.', 'Criminal', 'Cyber Extortion & Ransomware', 'Under Review', 'Urgent', '2026-05-04', '2026-12-18', 2, 'Cyber Crime Task Force', 'David Vance', 'Illegal interception of municipal database systems and extortion attempt.', 18, 5, 84);

-- Insert Hearings
INSERT INTO hearings (id, case_id, hearing_date, room_number, status, hearing_type, notes) VALUES
(1, 101, '2026-09-10 10:30:00', 'Courtroom 204-B', 'Scheduled', 'Cross-examination of forensic accountants', 'Defense requested additional time for expert witness submission.'),
(2, 103, '2026-09-14 14:00:00', 'Courtroom 101-A', 'Scheduled', 'Final Arguments on Constitutional Validity', 'Bench panel comprising 3 judges will review statutory compliance docs.'),
(3, 105, '2026-09-18 11:00:00', 'Courtroom 108-C', 'Scheduled', 'Evidentiary Hearing on Tax Deductions', 'Revenue auditor to present certified calculation spreadsheets.');

-- Insert Precedents
INSERT INTO precedents (id, citation, title, legal_domain, summary, verdict, key_principles, year, relevance_keywords) VALUES
(1, '2021 AIR SC 4412', 'State of Maharashtra vs. TechCorp International', 'Corporate & Cyber Law', 'Unlawful access to server infrastructure and intellectual property theft via corporate espionage.', 'Held guilty. Mandatory 5-year injunction and punitive damages awarded for proprietary algorithm theft.', 'Corporate IP protection; digital forensics evidentiary standards; trade secret breach liabilities.', 2021, 'intellectual property, software, trade secrets, cyber crime, corporate breach'),
(2, '2019 AIR SC 1180', 'Green Earth Foundation vs. Union Industrial Board', 'Constitutional Law', 'Public Interest Litigation demanding immediate stay on industrial zone development missing EIA approval.', 'Injunction granted. Environmental Impact Assessment made mandatory before state clearance.', 'Precautionary principle; Right to clean environment under Article 21; Statutory compliance.', 2019, 'environment, public interest, constitutional validity, EIA clearance, industrial zone'),
(3, '2023 AIR SC 2891', 'Commissioner of Income Tax vs. Apex Holdings Ltd', 'Taxation Law', 'Dispute over arm length transfer pricing for international software licensing royalties.', 'Assessment set aside. Revenue authority directed to recalculate tax using international benchmark.', 'Transfer pricing methodology; OECD guidelines applicability; software royalty taxation rules.', 2023, 'taxation, transfer pricing, corporate excise, software royalty, revenue assessment');
