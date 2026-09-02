import React from 'react';
import { Scale, Gavel, AlertTriangle, CheckCircle2, Clock, Users, ArrowUpRight, TrendingUp, Calendar, ShieldCheck } from 'lucide-react';

export default function Dashboard({ stats, cases, onNavigate }) {
  const metrics = stats?.metrics || {
    totalCases: 829,
    activePending: 89,
    disposedCases: 740,
    urgentCases: 4,
    avgDisposalDays: 134,
    clearanceRate: '94.2%'
  };

  const urgentList = cases ? cases.filter(c => c.priority === 'Urgent' || c.priority === 'Expedited').slice(0, 4) : [];

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Judicial Administration Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Judicial Overview & Executive Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time case backlogs, AI priority scoring, hearing schedules, and court capacity tracking.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('cases', 'new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-sm transition-colors"
          >
            <Scale className="w-4 h-4" />
            Digitize New Case
          </button>
          <button
            onClick={() => onNavigate('ai', 'classifier')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium text-sm rounded-lg transition-colors"
          >
            <Gavel className="w-4 h-4 text-blue-600" />
            AI Document Classifier
          </button>
        </div>
      </div>

      {/* KPI Cards (Clean White Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Registered Cases</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{metrics.totalCases}</h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>94.2% Annual Disposition clearance</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Pending Backlog</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{metrics.activePending}</h3>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">
            Avg trial duration: <span className="font-semibold text-slate-800">{metrics.avgDisposalDays} days</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Disposed / Resolved</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{metrics.disposedCases}</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-emerald-700 font-medium">
            +41 cases resolved this month
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Urgent / Priority Matters</p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">{metrics.urgentCases}</h3>
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-rose-600 font-medium">
            Requires immediate hearing date allocation
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Matters Table (Span 2) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                High Urgency & Fast-Track Case Queue
              </h2>
              <p className="text-xs text-slate-500">Cases flagged by AI evaluation matrix for priority scheduling.</p>
            </div>
            <button
              onClick={() => onNavigate('cases')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              View All Cases
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {urgentList.map((item) => (
              <div key={item.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {item.case_number}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.priority}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{item.category}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-slate-500">Judge: <span className="text-slate-700 font-medium">{item.judge_name || 'Assigned Bench'}</span></p>
                </div>
                <div className="flex items-center gap-3 text-right self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-700">AI Urgency Score</div>
                    <div className="text-sm font-bold text-rose-600">{item.urgency_score}/100</div>
                  </div>
                  <button
                    onClick={() => onNavigate('schedule', item.id)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md shadow-sm transition-colors"
                  >
                    Schedule Date
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Judicial Tools & Fast Shortcuts */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Gavel className="w-4 h-4 text-blue-700" />
              AI Judicial Assistant Tools
            </h3>
            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('ai', 'classifier')}
                className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Legal Document Classifier</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Automated document category & statute extraction</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
              </button>

              <button
                onClick={() => onNavigate('ai', 'redactor')}
                className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Sensitive Data Redactor</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Automate PII, ID & financial data masking</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
              </button>

              <button
                onClick={() => onNavigate('precedents')}
                className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Precedent Search Engine</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Retrieve relevant landmark judgments instantly</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
              </button>
            </div>
          </div>

          {/* Citizen Portal Banner */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-blue-400 uppercase tracking-wider">
              <Users className="w-4 h-4" />
              Public Access & Citizen Portal
            </div>
            <h3 className="text-base font-bold">Transparent Litigant Case Tracking</h3>
            <p className="text-xs text-slate-300">Empower litigants to check case progress, judge assignments, and hearing schedules online.</p>
            <button
              onClick={() => onNavigate('citizen')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Open Public Citizen Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
