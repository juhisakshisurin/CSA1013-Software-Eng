import React, { useState, useEffect } from 'react';
import { Scale, LayoutDashboard, FileText, Sparkles, BookOpen, BarChart3, Calendar, Users, Database, RefreshCw, ShieldCheck, UserCheck, Lock } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CaseManagement from './components/CaseManagement';
import AiDocumentTools from './components/AiDocumentTools';
import PrecedentSearch from './components/PrecedentSearch';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ScheduleOptimizer from './components/ScheduleOptimizer';
import CitizenPortal from './components/CitizenPortal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subTab, setSubTab] = useState('');
  const [scheduleTargetId, setScheduleTargetId] = useState('');

  // Role State: 'admin' | 'registrar' | 'citizen'
  const [userRole, setUserRole] = useState('admin');

  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      // Fetch Health
      const hRes = await fetch('/api/health');
      const hData = await hRes.json();
      setSystemHealth(hData);

      // Fetch Cases
      const cRes = await fetch('/api/cases');
      const cData = await cRes.json();
      if (cData.success) setCases(cData.data);

      // Fetch Analytics
      const aRes = await fetch('/api/analytics/workload');
      const aData = await aRes.json();
      if (aData.success) setStats(aData.data);
    } catch (e) {
      console.error('API connection error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    if (newRole === 'citizen') {
      setActiveTab('citizen');
    } else if (newRole === 'registrar' && (activeTab === 'analytics' || activeTab === 'citizen')) {
      setActiveTab('cases');
    }
  };

  const handleNavigate = (tab, sub = '', targetId = '') => {
    if (userRole === 'citizen' && tab !== 'citizen') return;
    setActiveTab(tab);
    setSubTab(sub);
    if (targetId) setScheduleTargetId(targetId);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Professional White Header Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-0 sm:h-16 gap-3 sm:gap-0">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate('dashboard')}>
              <div className="w-10 h-10 bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-sm">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-base tracking-tight">SmartCourt AI</span>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 uppercase">
                    v1.0 Enterprise
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Judicial Analytics & Case Management Platform</p>
              </div>
            </div>

            {/* Right Controls: Role Selector & System Status Pill */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Role Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                <UserCheck className="w-3.5 h-3.5 text-blue-700 ml-1 hidden sm:block" />
                <span className="text-slate-500 font-medium text-[11px] hidden sm:block">Role:</span>
                <select
                  value={userRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="bg-white border border-slate-200 rounded text-xs font-bold text-slate-800 px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="admin">Chief Justice / Judicial Admin</option>
                  <option value="registrar">Court Registrar / Legal Clerk</option>
                  <option value="citizen">Public Litigant / Citizen</option>
                </select>
              </div>

              {/* System Status Pill */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-semibold text-slate-700">
                  {systemHealth ? systemHealth.database : 'Connecting System...'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tab Links (Role Protected) */}
          <nav className="flex space-x-1 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none border-t border-slate-100 pt-1">
            {userRole !== 'citizen' && (
              <>
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeTab === 'dashboard' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Executive Overview
                </button>

                <button
                  onClick={() => handleNavigate('cases')}
                  className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeTab === 'cases' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Case Registry
                </button>

                <button
                  onClick={() => handleNavigate('ai')}
                  className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeTab === 'ai' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  AI Document Suite
                </button>

                <button
                  onClick={() => handleNavigate('precedents')}
                  className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeTab === 'precedents' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Precedent Retrieval
                </button>

                {userRole === 'admin' && (
                  <button
                    onClick={() => handleNavigate('analytics')}
                    className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                      activeTab === 'analytics' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Workload Analytics
                  </button>
                )}

                <button
                  onClick={() => handleNavigate('schedule')}
                  className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeTab === 'schedule' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Optimizer
                </button>
              </>
            )}

            <button
              onClick={() => handleNavigate('citizen')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'citizen' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Citizen Tracking Portal
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-700" />
            <p className="text-xs font-semibold">Initializing Judicial Database & AI Models...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard stats={stats} cases={cases} onNavigate={handleNavigate} />
            )}
            {activeTab === 'cases' && (
              <CaseManagement cases={cases} onRefresh={fetchAllData} onSelectSchedule={(id) => handleNavigate('schedule', '', id)} />
            )}
            {activeTab === 'ai' && (
              <AiDocumentTools defaultTool={subTab || 'classifier'} />
            )}
            {activeTab === 'precedents' && (
              <PrecedentSearch />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsDashboard stats={stats} />
            )}
            {activeTab === 'schedule' && (
              <ScheduleOptimizer cases={cases} initialCaseId={scheduleTargetId} />
            )}
            {activeTab === 'citizen' && (
              <CitizenPortal />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>AI-Powered Smart Court Case Management & Judicial Analytics Platform</span>
          <span className="text-slate-400 font-mono">React • Express REST API • MySQL Database</span>
        </div>
      </footer>
    </div>
  );
}
