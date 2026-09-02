# ⚖️ Smart Court Case Management & Judicial Analytics Platform

> **CSA1013 Software Engineering — ASSIGNMENT Implementation**  
> **Author / Student Email:** `ashisansakshi@gmail.com`  
> **Repository:** `CSA1013-Software-Eng`  
> **Folder:** `ASSIGNMENT`

---

## 🚀 ONE-CLICK EXECUTABLE LAUNCHERS (.EXE)

When you double click the executable file, a terminal window will open showing the local server IP address (`http://localhost:5000/`), which you can copy-paste into any web browser to open the full implementation:

| Executable / Launch Method | File Link | Description & Instructions |
| :--- | :--- | :--- |
| 💻 **Windows Executable (.exe)** | [**▶️ Run `Launch_Court_Platform.exe`**](Launch_Court_Platform.exe) | **Native Windows Executable.** Double-click to run. Displays `http://localhost:5000/` & `http://127.0.0.1:5000/` in terminal for copy-pasting into browser. |
| ⚡ **Alternative Executable (.exe)** | [**▶️ Run `run_implementation.exe`**](run_implementation.exe) | Standalone executable runner for launching the local server. |
| 🌐 **Interactive Web App Executable** | [**▶️ Open `Launch_Implementation.html`**](Launch_Implementation.html) | Direct single-file web app executable (Runs directly in browser without server). |
| ⚡ **Windows Batch Launcher (.bat)** | [**▶️ Run `Run_Implementation.bat`**](Run_Implementation.bat) | Automated script to launch fullstack Node.js + Express + React local servers. |

---

## 🖥️ What Happens When You Click `Launch_Court_Platform.exe`

1. A terminal console window opens displaying the following output:
```text
================================================================================
          ⚖️ SMART COURT CASE MANAGEMENT & JUDICIAL ANALYTICS PLATFORM          
                     Software Engineering Assignment Implementation             
================================================================================

  [✓] Local Web Server active and listening on port 5000!

  ========================================================================
  🚀 COPY AND PASTE THIS IP / URL INTO YOUR WEB BROWSER TO OPEN IMPLEMENTATION:

     👉 http://localhost:5000/
     👉 http://127.0.0.1:5000/
  ========================================================================

  ℹ️  The implementation browser window will also open automatically.
  ℹ️  Keep this console window running while using the application.
  ℹ️  Press Ctrl+C or close this window to exit the server.
================================================================================
```
2. Copy and paste `http://localhost:5000/` into Chrome, Edge, or Firefox.
3. The complete Smart Court Case Management & Judicial Analytics platform will open!

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
