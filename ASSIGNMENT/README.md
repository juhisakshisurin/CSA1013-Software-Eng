# ⚖️ Smart Court Case Management & Judicial Analytics Platform

> **CSA1013 Software Engineering — ASSIGNMENT Implementation**  
> **Author / Student Email:** `ashisansakshi@gmail.com`  
> **Repository:** `CSA1013-Software-Eng`  
> **Folder:** `ASSIGNMENT`

---

## 🚀 ONE-CLICK IMPLEMENTATION LAUNCHERS

You can open and execute this implementation instantly using any of the following launch options:

| Launch Method | Executable / File Link | Description & Features |
| :--- | :--- | :--- |
| 🌐 **Interactive Web App Executable** | [**▶️ CLICK HERE TO OPEN `Launch_Implementation.html`**](Launch_Implementation.html) | **Instant Single-File Interactive UI.** Runs directly in your browser without requiring Node.js or MySQL setup. Includes live Case Management, NLP Document Redaction, Hearing Conflict Scheduler, Analytics Charts, and Precedent Search. |
| ⚡ **Windows Batch Executable Script** | [**▶️ CLICK TO RUN `Run_Implementation.bat`**](Run_Implementation.bat) | **Automated Local Full-Stack Launcher.** Auto-installs npm dependencies, launches Node.js Express Backend & React Vite Frontend, and opens `http://localhost:5173`. |
| 📂 **React Frontend Application** | [**📁 Browse `frontend/` Source**](frontend/) | Modern React 18 + Vite dashboard with role-based navigation and analytics views. |
| ⚙️ **Express REST API Backend** | [**📁 Browse `backend/` Source**](backend/) | Node.js + Express REST API endpoints with JWT authentication and AI heuristics. |
| 🗄️ **MySQL Database Schema** | [**📄 Browse `database/schema.sql`**](database/schema.sql) | Relational SQL schema, tables, and seeded landmark legal precedents. |

---

## 📋 Features Implemented

1. **Digitized Court Case Management**: Complete lifecycle tracking (Creation, Judge Assignment, Priority Level, Status Updates).
2. **Automated Legal Document AI**: Keyword-weighted NLP-style classifier for classifying briefs into Criminal, Civil, Constitutional, Corporate, or Family Law.
3. **Automated Sensitive-Data (PII) Redaction**: Real-time masking of SSNs, Credit Card numbers, Phone numbers, and Email addresses on document upload.
4. **Timeline Disposition Predictor**: Heuristic ML estimation model calculating expected resolution days based on case type, priority, and judge caseload.
5. **Hearing Scheduler with Conflict Detection**: Automatic validation against judge schedules to prevent double-booking and suggest vacant slots.
6. **Judicial Workload Analytics**: Visual breakdown of judge caseload distribution, case priorities, and disposition status.
7. **Instant Precedent Retrieval**: Relevance-ranked search across landmark court precedents and case law.
8. **Role-Based Access Control**: Configurable security scopes for Admin, Judge, Clerk, and Citizen roles.

---

## 🏗️ Architecture Overview

```
                            +-------------------------------------------------------+
                            |                 User / Browser Client                 |
                            +---------------------------+---------------------------+
                                                        |
                                            HTTP / REST | JSON
                                                        v
                            +-------------------------------------------------------+
                            |              Express REST API Backend                 |
                            |                     (Port 5000)                       |
                            +-----------+---------------+---------------+-----------+
                                        |               |               |
                                        v               v               v
                                  +-----------+   +-----------+   +-----------+
                                  | Classifier|   | Redactor  |   | Predictor |
                                  | Module    |   | Module    |   | Module    |
                                  +-----------+   +-----------+   +-----------+
                                                        |
                                                        v
                                            +-----------------------+
                                            |  MySQL 8 Database     |
                                            |  (court_platform)     |
                                            +-----------------------+
```

---

## 💻 Manual Setup & Execution Guide

### 1. Database Setup
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm start
```
*Backend runs on `http://localhost:5000`*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🧪 Verification & Test Cases Matrix

| Test ID | Module | Input / Action | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Case Management | Submit "State vs. John Doe", Criminal, Urgent | Case assigned ID, AI predicts disposition timeline (e.g. 10-14 days). | **PASSED** |
| **TC-02** | Document AI | Upload text containing SSN & email | Document classified as "Criminal"; Email & SSN replaced with `[REDACTED]`. | **PASSED** |
| **TC-03** | Scheduler | Schedule hearing for booked judge on same date/time | System triggers double-booking warning and proposes next free slot. | **PASSED** |
| **TC-04** | Precedents | Search query "Privacy" | Returns *K.S. Puttaswamy v. Union of India* with high relevance score. | **PASSED** |
