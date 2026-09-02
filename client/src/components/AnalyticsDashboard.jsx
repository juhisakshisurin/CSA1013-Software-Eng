import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, PieChart as PieIcon, Download, CheckCircle2, Clock, Printer, X, ShieldCheck, Scale, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

export default function AnalyticsDashboard({ stats }) {
  const [showReportModal, setShowReportModal] = useState(false);

  const judgeWorkload = stats?.judgeWorkload || [
    { name: 'Eleanor Vance', pending: 14, disposed: 185, capacity: 40 },
    { name: 'Marcus Sterling', pending: 28, disposed: 240, capacity: 50 },
    { name: 'Priya Sharma', pending: 19, disposed: 142, capacity: 45 },
    { name: 'Robert Thorne', pending: 22, disposed: 198, capacity: 45 }
  ];

  const categoryChart = stats?.categoryChart || [
    { name: 'Criminal', cases: 2 },
    { name: 'Corporate', cases: 1 },
    { name: 'Constitutional', cases: 1 },
    { name: 'Family', cases: 1 },
    { name: 'Tax', cases: 1 }
  ];

  const dispositionVelocity = stats?.dispositionVelocity || [
    { month: 'Apr', filed: 42, disposed: 38 },
    { month: 'May', filed: 51, disposed: 44 },
    { month: 'Jun', filed: 39, disposed: 48 },
    { month: 'Jul', filed: 60, disposed: 52 },
    { month: 'Aug', filed: 48, disposed: 55 },
    { month: 'Sep', filed: 35, disposed: 41 }
  ];

  const COLORS = ['#1e40af', '#059669', '#d97706', '#9333ea', '#dc2626', '#475569'];

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Judicial Performance & Data Analytics</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Judicial Workload & Throughput Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">Court backlog trends, judge caseload capacity, clearance rates, and monthly disposition velocity.</p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs rounded-lg shadow-sm transition-colors"
        >
          <FileText className="w-4 h-4" />
          Generate Judicial Audit Report
        </button>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Judge Caseload vs Capacity */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Judicial Workload & Capacity by Judge</h3>
              <p className="text-[11px] text-slate-500">Active pending caseload vs maximum bench allocation capacity</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={judgeWorkload} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="pending" name="Active Pending" fill="#1e40af" radius={[4, 4, 0, 0]} />
                <Bar dataKey="capacity" name="Max Capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Disposition Velocity (Monthly Filed vs Disposed) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">6-Month Court Disposition Velocity</h3>
              <p className="text-[11px] text-slate-500">Monthly filings vs case resolution throughput rate</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dispositionVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="filed" name="New Filings" stroke="#d97706" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="disposed" name="Disposed Cases" stroke="#059669" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Case Category Distribution */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Case Category Distribution</h3>
        <p className="text-xs text-slate-500 mb-4">Proportion of active proceedings across legal domains</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryChart} dataKey="cases" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {categoryChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {categoryChart.map((cat, idx) => (
              <div key={cat.name} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="font-semibold text-slate-800">{cat.name} Law</span>
                </div>
                <span className="font-bold text-slate-900">{cat.cases} Active Cases</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Judicial Audit Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto print:max-w-none print:shadow-none print:border-none print:p-0">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4 print:hidden">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>Judicial Performance & Backlog Audit Report</span>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Report Content */}
            <div className="space-y-5">
              {/* Official Seal Banner */}
              <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                    <Scale className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">HIGH COURT JUDICIAL ADMINISTRATION</h2>
                    <p className="text-xs text-slate-500 font-medium">Department of Judicial Analytics & Case Flow Management</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="text-slate-400 block">Report Ref</span>
                  <span className="font-mono font-bold text-slate-900">JAR-2026-Q3</span>
                  <span className="text-slate-500 block text-[11px]">Date: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* KPI Summary Matrix */}
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Total Cases</span>
                  <span className="text-xl font-bold text-slate-900">829</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Active Backlog</span>
                  <span className="text-xl font-bold text-amber-700">89</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Disposal Clearance</span>
                  <span className="text-xl font-bold text-emerald-700">94.2%</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Avg Trial Days</span>
                  <span className="text-xl font-bold text-blue-700">134 Days</span>
                </div>
              </div>

              {/* Judge Workload Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Judicial Bench Performance Matrix</h4>
                <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2.5 border-b">Presiding Judge</th>
                      <th className="p-2.5 border-b text-center">Pending Cases</th>
                      <th className="p-2.5 border-b text-center">Disposed Cases</th>
                      <th className="p-2.5 border-b text-center">Max Capacity</th>
                      <th className="p-2.5 border-b text-center">Load Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {judgeWorkload.map(j => (
                      <tr key={j.name}>
                        <td className="p-2.5 font-semibold">{j.name}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-blue-700">{j.pending}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-emerald-700">{j.disposed}</td>
                        <td className="p-2.5 text-center font-mono text-slate-500">{j.capacity}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold">
                            Optimal ({Math.round((j.pending / j.capacity) * 100)}%)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* AI Strategic Recommendations */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg space-y-2 text-xs">
                <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  AI Judicial Recommendations & Optimization Directives
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>Expedite 4 high-urgency criminal matters to avoid trial delay penalties.</li>
                  <li>Reallocate corporate IP cases to Circuit Judge Priya Sharma to balance bench workload.</li>
                  <li>Automate notice issuance using the Smart Schedule Optimizer to reduce adjournment frequency by 22%.</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 print:hidden">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
              <button
                onClick={handlePrintReport}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print / Export Official PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
