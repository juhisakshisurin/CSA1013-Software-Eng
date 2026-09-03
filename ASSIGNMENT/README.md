# ⚖️ Smart Court Case Management & Judicial Analytics Platform

> **CSA1013 Software Engineering — ASSIGNMENT & Implementation**  
> **Author / Student Email:** `ashisansakshi@gmail.com`  
> **Repository:** `CSA1013-Software-Eng`  
> **Folder:** `ASSIGNMENT`  
> **Implementation Directory:** [`ASSIGNMENT/IMPLEMENTATION`](IMPLEMENTATION/)  

---

## 📂 Implementation Directory (`ASSIGNMENT/IMPLEMENTATION/`)

All software implementation files, backend, frontend, database schemas, and executable launchers are contained **exclusively inside the [`IMPLEMENTATION/`](IMPLEMENTATION/) directory**.

### 🚀 ONE-CLICK EXECUTABLE LAUNCHERS (.EXE & .BAT)

Click on any launcher in [`ASSIGNMENT/IMPLEMENTATION/`](IMPLEMENTATION/) to launch the app. Double-clicking will open a terminal window showing the listening port (`http://localhost:5000/`) and automatically open Google Chrome browser to view the application:

| Executable / Launch Method | File Link | Description & Instructions |
| :--- | :--- | :--- |
| 💻 **Windows Web Server Executable (.exe)** | [**▶️ Run `Launch_Court_Platform.exe`**](IMPLEMENTATION/Launch_Court_Platform.exe) | **Standalone Web Server Executable.** Displays active port in terminal and opens Chrome browser automatically. |
| ⚡ **Alternative Executable (.exe)** | [**▶️ Run `run_implementation.exe`**](IMPLEMENTATION/run_implementation.exe) | Standalone executable runner for launching the local server. |
| 🌐 **Interactive Web App Executable** | [**▶️ Open `Launch_Implementation.html`**](IMPLEMENTATION/Launch_Implementation.html) | Direct interactive single-file web app running in Chrome browser. |
| ⚡ **Windows Batch Launcher (.bat)** | [**▶️ Run `Run_Implementation.bat`**](IMPLEMENTATION/Run_Implementation.bat) | Automated script to launch standalone web server or Node.js + Express + React servers. |
| 📂 **Implementation Folder** | [**📁 Open `IMPLEMENTATION/` Directory**](IMPLEMENTATION/) | Subdirectory containing all codebase files, backend, frontend & launchers. |

---

## 🖥️ What Happens When You Click `Launch_Court_Platform.exe`

1. A terminal console window opens displaying the listening port status:
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
2. Google Chrome automatically launches to `http://localhost:5000/` without any manual commands or setup required!

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
