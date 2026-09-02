import React, { useState } from 'react';
import { Search, ShieldCheck, Scale, Calendar, CheckCircle2, Clock, FileText, User, ArrowRight } from 'lucide-react';

export default function CitizenPortal() {
  const [caseQuery, setCaseQuery] = useState('CR-2026-0842');
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!caseQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/cases/${encodeURIComponent(caseQuery.trim())}`);
      const data = await res.json();
      if (data.success) {
        setCaseData(data.data);
      } else {
        setCaseData(null);
      }
    } catch (err) {
      console.error(err);
      setCaseData(null);
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Filed', 'Under Review', 'Hearing Scheduled', 'Verdict Reserved', 'Disposed'];

  const getStepIndex = (status) => {
    const idx = steps.indexOf(status);
    return idx === -1 ? 1 : idx;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-blue-700 font-semibold text-xs bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          <ShieldCheck className="w-4 h-4" />
          <span>Public Access Judicial Portal</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Litigant & Public Case Tracking Portal</h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Enter your official Court Case Number (e.g., CR-2026-0842 or 101) to view real-time judicial progress, hearing schedules, and presiding judge assignments.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="pt-2 max-w-md mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Enter Case Number (e.g. CR-2026-0842)"
              value={caseQuery}
              onChange={(e) => setCaseQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
          >
            {loading ? 'Searching...' : 'Track Status'}
          </button>
        </form>
      </div>

      {/* Case Tracking Output */}
      {searched && (
        <div>
          {caseData ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                    {caseData.case_number}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">{caseData.title}</h2>
                  <p className="text-xs text-slate-500">Legal Domain: <span className="font-semibold text-slate-700">{caseData.category}</span></p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Current Status</span>
                  <span className="inline-block mt-0.5 px-3 py-1 bg-blue-700 text-white font-bold text-xs rounded-full">
                    {caseData.status}
                  </span>
                </div>
              </div>

              {/* Status Timeline Progress Bar */}
              <div className="py-2">
                <h4 className="text-xs font-bold text-slate-700 mb-4 uppercase tracking-wider">Judicial Timeline Progress</h4>
                <div className="grid grid-cols-5 gap-2 relative">
                  {steps.map((step, idx) => {
                    const currentIdx = getStepIndex(caseData.status);
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={step} className="text-center space-y-2">
                        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent ? 'bg-blue-700 text-white ring-4 ring-blue-100' :
                          isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[11px] block font-medium ${
                          isCurrent ? 'text-blue-700 font-bold' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Presiding Judge & Room</span>
                  <span className="font-bold text-slate-900 block">{caseData.judge_name || 'Assigned Magistrate'}</span>
                  <span className="text-slate-500 font-medium">{caseData.court_room || 'Courtroom 204-B'}</span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Date of Filing</span>
                  <span className="font-bold text-slate-900">{caseData.filing_date}</span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Est. Resolution Date</span>
                  <span className="font-bold text-blue-700">{caseData.estimated_completion_date}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Public Case Overview</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {caseData.summary}
                </p>
              </div>

              {/* Hearings Schedule List */}
              {caseData.hearings && caseData.hearings.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Scheduled Courtroom Appearances</h4>
                  <div className="space-y-2">
                    {caseData.hearings.map(h => (
                      <div key={h.id} className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-900 block">{h.hearing_type}</span>
                          <span className="text-slate-500">{h.room_number} • {h.notes}</span>
                        </div>
                        <span className="font-mono font-bold text-blue-700 bg-white px-2.5 py-1 rounded border border-blue-200">
                          {h.hearing_date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2">
              <p className="text-sm font-bold text-slate-800">No Court Case Found for "{caseQuery}"</p>
              <p className="text-xs text-slate-500">Please double check your case number or try searching for sample case "CR-2026-0842".</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
