import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, Gavel, AlertCircle, RefreshCw } from 'lucide-react';

export default function ScheduleOptimizer({ cases, initialCaseId }) {
  const [selectedCaseId, setSelectedCaseId] = useState(initialCaseId || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [hearingType, setHearingType] = useState('Preliminary Hearing');
  const [hearingsList, setHearingsList] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHearings = async () => {
    try {
      const res = await fetch('/api/schedule');
      const data = await res.json();
      if (data.success) setHearingsList(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchHearings();
  }, []);

  const handleOptimizeSchedule = async (e) => {
    e.preventDefault();
    if (!selectedCaseId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/schedule/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: selectedCaseId,
          preferredDate: preferredDate || null,
          hearingType
        })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        fetchHearings();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs mb-1">
          <Calendar className="w-4 h-4" />
          <span>Smart Court Calendar System</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Hearing Schedule & Courtroom Optimizer</h1>
        <p className="text-xs text-slate-500 mt-0.5">Automated conflict-free scheduling engine that maps judge calendar, case urgency score, and courtroom availability.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheduler Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Gavel className="w-4 h-4 text-blue-700" />
            Schedule Hearing Date
          </h3>

          <form onSubmit={handleOptimizeSchedule} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Select Pending Court Case *</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500/20"
                required
              >
                <option value="">-- Choose Case from Registry --</option>
                {cases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.case_number} - {c.title.substring(0, 35)} ({c.priority})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Preferred Hearing Date (Optional)</label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
              <p className="text-[10px] text-slate-400 mt-1">If empty, AI will calculate optimal date based on urgency score.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Hearing Type</label>
              <select
                value={hearingType}
                onChange={(e) => setHearingType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Preliminary Hearing">Preliminary Hearing</option>
                <option value="Cross-examination of Witnesses">Cross-examination of Witnesses</option>
                <option value="Evidentiary Hearing">Evidentiary Hearing</option>
                <option value="Final Arguments">Final Arguments</option>
                <option value="Verdict Announcement">Verdict Announcement</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedCaseId}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
              {loading ? 'Optimizing Schedule...' : 'Run Conflict-Free Optimizer'}
            </button>
          </form>

          {result && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Hearing Allocated Successfully
              </div>
              <div className="text-slate-700 space-y-1">
                <div><span className="text-slate-500">Scheduled Date:</span> <span className="font-bold text-slate-900">{result.hearing_date}</span></div>
                <div><span className="text-slate-500">Courtroom:</span> <span className="font-semibold text-slate-900">{result.room_number}</span></div>
                <div><span className="text-slate-500">Presiding Judge:</span> <span className="font-semibold text-slate-900">{result.judge_name}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Live Scheduled Hearings Master Calendar List (Span 2) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Courtroom Schedule & Active Calendar</h3>
          
          <div className="divide-y divide-slate-100">
            {hearingsList.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No active hearing dates scheduled.
              </div>
            ) : (
              hearingsList.map((h) => (
                <div key={h.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {h.case_number}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">{h.room_number}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900">{h.title}</h4>
                    <p className="text-xs text-slate-500">Judge: <span className="text-slate-700 font-medium">{h.judge_name}</span> • Type: <span className="text-slate-700">{h.hearing_type}</span></p>
                  </div>

                  <div className="text-right self-end sm:self-center">
                    <div className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded border border-slate-200 inline-block">
                      {h.hearing_date}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium mt-1">Confirmed</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
