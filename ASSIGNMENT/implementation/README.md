# ⚖️ Smart Court Case Management & Judicial Analytics Platform

> **CSA1013 Software Engineering — Implementation**  
> **Author / Student Email:** `ashisansakshi@gmail.com`  
> **Repository:** `CSA1013-Software-Eng`  
> **Implementation Directory:** `ASSIGNMENT/implementation`  

---

## 🚀 ONE-CLICK EXECUTABLE LAUNCHERS (.EXE & .BAT)

When you click or double-click the executable files below, a terminal window will open showing the exact listening port (e.g. `http://localhost:5000/`), and Google Chrome browser will automatically launch and open the complete implementation without any setup or manual commands required!

| Executable / Launch Method | File Link | Description & Instructions |
| :--- | :--- | :--- |
| 💻 **Windows Web Server Executable (.exe)** | [**▶️ Run `Launch_Court_Platform.exe`**](Launch_Court_Platform.exe) | **Standalone Web Server Executable.** Binds to port 5000 (or first free port), displays port in terminal, and auto-opens Chrome browser. |
| ⚡ **Alternative Executable (.exe)** | [**▶️ Run `run_implementation.exe`**](run_implementation.exe) | Alternate compiled server executable runner. |
| 🌐 **Interactive Web App HTML** | [**▶️ Open `Launch_Implementation.html`**](Launch_Implementation.html) | Direct interactive web application running in Chrome browser. |
| ⚡ **Windows Batch Launcher (.bat)** | [**▶️ Run `Run_Implementation.bat`**](Run_Implementation.bat) | Automated script to launch standalone web server or Node.js backend + Vite frontend. |

---

## 🖥️ What Happens When You Click `Launch_Court_Platform.exe`

1. A terminal console window opens displaying the active port and listening status:
```text
================================================================================
          ⚖️ SMART COURT CASE MANAGEMENT & JUDICIAL ANALYTICS PLATFORM          
                     Software Engineering Assignment Implementation             
================================================================================

  [✓] Embedded Web Server active and listening on port 5000!

  ========================================================================
  🚀 COPY AND PASTE THIS IP / URL INTO YOUR WEB BROWSER TO OPEN IMPLEMENTATION:

     👉 http://localhost:5000/
     👉 http://127.0.0.1:5000/
  ========================================================================

  ℹ️  Opening implementation in Chrome browser automatically...
  ℹ️  Keep this console window running while using the application.
  ℹ️  Press Ctrl+C or close this window to exit the server.
================================================================================
```
2. Google Chrome browser automatically opens `http://localhost:5000/` displaying the application cleanly without any errors.

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

## 🏗️ Folder Structure

```
ASSIGNMENT/implementation/
├── Launch_Court_Platform.exe   # Standalone C Winsock Web Server Executable
├── run_implementation.exe      # Alternate Executable Launcher
├── Run_Implementation.bat      # Windows Batch Launcher Script
├── Launch_Implementation.html  # Interactive Standalone Single-File Web App
├── index.html                  # Entry Web Interface
├── server.c                    # C Source Code for Winsock Web Server
├── launcher.c                  # C Source Code for Launcher
├── Launcher.cs                 # C# Source Code for Launcher
├── README.md                   # Implementation Documentation
├── backend/                    # Node.js + Express Backend REST API
├── frontend/                   # React + Vite Frontend Web App
└── database/                   # MySQL Database Schema & Seed Data
```

---

## 💻 Manual Full-Stack Setup (Optional)

### 1. Database Setup
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend API Server
```bash
cd backend
npm install
npm start
```

### 3. Frontend Web Client
```bash
cd frontend
npm install
npm run dev
```
