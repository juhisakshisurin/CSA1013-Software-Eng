# AI-Powered Smart Court Case Management & Judicial Analytics Platform

An enterprise-grade, end-to-end legal technology platform built with **React (Frontend)**, **Node.js & Express (Backend REST API)**, and **MySQL (Database)**.

Designed for judicial administration, legal document classification, PII redaction, precedent retrieval, hearing schedule optimization, and public citizen tracking.

---

## 🚀 How to Run in VS Code

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- (Optional) [MySQL Server](https://www.mysql.com/) / phpMyAdmin / XAMPP if you wish to connect to a local MySQL instance. *Note: If MySQL is not running, the backend automatically uses an built-in high-performance data store so it works out of the box!*

---

### Quick Start (One-Click / Terminal)

#### Option 1: Using VS Code Integrated Terminal
1. Open the project folder in **VS Code**:
   `File -> Open Folder -> smart-court-platform`

2. Open two terminals in VS Code (`Ctrl + ~` or `Terminal -> New Terminal`):

3. **Terminal 1: Start Backend API**
   ```bash
   cd server
   npm install
   npm start
   ```
   *Backend server will run at: `http://localhost:5000`*

4. **Terminal 2: Start React Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *React application will open at: `http://localhost:3000`*

---

#### Option 2: Windows 1-Click Launcher
Double-click `run-project.bat` in the project root to automatically install dependencies and launch both servers simultaneously!

---

### 🗄️ Optional: Setting up MySQL Database

1. Open your MySQL client (MySQL Workbench / phpMyAdmin / Command Line).
2. (Optional) Run the database setup script automatically:
   ```bash
   cd server
   npm run db:setup
   ```
   *This imports `server/db/schema.sql` and `server/db/seed.sql` into MySQL.*

3. To customize MySQL host/user/password, edit `server/.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=court_db
   DB_PORT=3306
   ```

---

## 🌟 Key Features & Core Objectives

1. **Executive Overview Dashboard**: High-level KPI metrics, active backlog, clearance rates, and fast-track case queue.
2. **Digitized Court Case Registry**: Full CRUD management with filterable categories (Criminal, Civil, Constitutional, Corporate, Family, Tax) and priority levels.
3. **AI Legal Document Classifier**: Automatically categorizes affidavits/petitions and extracts statutory provisions.
4. **Automated Sensitive Data Redactor (PII)**: Scrubs phone numbers, emails, government IDs (SSN/Aadhaar/Passport), bank numbers, and witness names for public release compliance.
5. **Precedent Retrieval Engine**: Instant search across Supreme Court & High Court landmark rulings with similarity match scores.
6. **Case Resolution Predictor**: ML estimation model for trial completion timelines and bottleneck risk assessment.
7. **Judicial Workload & Audit Analytics**: Visual Recharts graphics + printable **Official Judicial Audit Report**.
8. **Hearing Schedule Optimizer**: Conflict-free courtroom and judge calendar scheduling engine.
9. **Role-Based Litigant Citizen Portal**: Public access tracking interface for citizens to check case progress using their case number.

---

## 📁 Project Structure

```
smart-court-platform/
├── client/                     # React Frontend (Vite + Tailwind CSS + Recharts)
│   ├── src/
│   │   ├── components/         # React Components (Dashboard, CaseManagement, AiTools, etc.)
│   │   ├── App.jsx             # Main App & Navigation
│   │   ├── main.jsx            # React Entry Point
│   │   └── index.css           # Global White Legal Theme Styling
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js & Express REST API Backend
│   ├── config/
│   │   └── db.js               # MySQL Pool Connection & Fallback Data Engine
│   ├── db/
│   │   ├── schema.sql          # MySQL Database DDL
│   │   ├── seed.sql            # Sample Legal Seed Data
│   │   └── init.js             # Automated DB Import Script
│   ├── routes/
│   │   ├── cases.js            # Case Registry & CRUD API
│   │   ├── ai.js               # AI Classifier, Redactor & Precedent Search API
│   │   ├── analytics.js        # Workload & Throughput Metrics API
│   │   └── schedule.js         # Hearing Schedule Optimizer API
│   ├── server.js               # Express Server Entry Point
│   └── package.json
│
├── run-project.bat             # Windows 1-Click Startup Script
└── README.md                   # Setup Documentation
```
