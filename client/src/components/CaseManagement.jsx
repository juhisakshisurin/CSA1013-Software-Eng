import React, { useState } from 'react';
import { Search, Plus, Filter, Calendar, User, Scale, AlertCircle, FileText, CheckCircle2, Clock, X, ChevronRight } from 'lucide-react';

export default function CaseManagement({ cases, onRefresh, onSelectSchedule }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // New Case Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Criminal',
    sub_category: '',
    priority: 'Normal',
    complainant: '',
    respondent: '',
    summary: '',
    witness_count: '2',
    evidence_count: '3'
  });

  const categories = ['All', 'Criminal', 'Corporate', 'Constitutional', 'Civil', 'Family', 'Tax'];
  const priorities = ['All', 'Normal', 'High Priority', 'Urgent', 'Expedited'];

  const filteredCases = cases.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesPrio = selectedPriority === 'All' || item.priority === selectedPriority;
    const s = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      item.case_number.toLowerCase().includes(s) ||
      item.title.toLowerCase().includes(s) ||
      item.complainant.toLowerCase().includes(s) ||
      item.respondent.toLowerCase().includes(s)
    );
    return matchesCat && matchesPrio && matchesSearch;
  });

  const handleCreateCase = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowNewModal(false);
        setFormData({
          title: '',
          category: 'Criminal',
          sub_category: '',
          priority: 'Normal',
          complainant: '',
          respondent: '',
          summary: '',
          witness_count: '2',
          evidence_count: '3'
        });
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (caseId, newStatus) => {
    try {
      const res = await fetch(`/api/cases/${caseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        if (selectedCase) setSelectedCase({ ...selectedCase, status: newStatus });
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Digitized Case Management Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">Browse, search, digitize filings, and update court proceedings status.</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Digitize New Case
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by case number, title, complainant or respondent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:bg-white"
          >
            {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:bg-white"
          >
            {priorities.map(p => <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</option>)}
          </select>
        </div>
      </div>

      {/* Case Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Case Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Litigants</th>
                <th className="py-3.5 px-4">Judge Assigned</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Urgency</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500 text-xs">
                    No court cases matched your search filters.
                  </td>
                </tr>
              ) : (
                filteredCases.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block mb-1 border border-blue-100">
                        {item.case_number}
                      </div>
                      <div className="font-semibold text-slate-900 line-clamp-1 max-w-xs">{item.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Filed: {item.filing_date}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div><span className="text-slate-400">P:</span> <span className="font-medium text-slate-800">{item.complainant}</span></div>
                      <div><span className="text-slate-400">R:</span> <span className="font-medium text-slate-800">{item.respondent}</span></div>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-medium text-slate-800">
                      {item.judge_name || 'Assigned Bench'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Disposed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.status === 'Hearing Scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        item.status === 'Verdict Reserved' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-xs">
                      <span className={`px-2 py-0.5 rounded ${
                        item.urgency_score > 85 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.urgency_score}/100
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCase(item)}
                        className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-md transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Details Drawer / Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 border border-slate-200 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedCase.case_number}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedCase.title}</h2>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block">Category</span>
                <span className="font-semibold text-slate-800">{selectedCase.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Filing Date</span>
                <span className="font-semibold text-slate-800">{selectedCase.filing_date}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Est. Resolution</span>
                <span className="font-semibold text-blue-700">{selectedCase.estimated_completion_date}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Priority</span>
                <span className="font-semibold text-rose-600">{selectedCase.priority}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Litigant Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 font-semibold block">Petitioner / Complainant</span>
                  <span className="font-semibold text-slate-900">{selectedCase.complainant}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 font-semibold block">Respondent / Defense</span>
                  <span className="font-semibold text-slate-900">{selectedCase.respondent}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Case Summary & Brief</h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed">
                {selectedCase.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Update Status:</span>
                <select
                  value={selectedCase.status}
                  onChange={(e) => handleStatusUpdate(selectedCase.id, e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-800"
                >
                  <option value="Filed">Filed</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Hearing Scheduled">Hearing Scheduled</option>
                  <option value="Verdict Reserved">Verdict Reserved</option>
                  <option value="Disposed">Disposed</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCase(null);
                    onSelectSchedule(selectedCase.id);
                  }}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Optimize Hearing Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Digitize Case Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 border border-slate-200 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-700" />
                Digitize & Register New Court Case
              </h2>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Case Title / Proceeding Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State vs. Apex Logistics Corp."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Legal Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Priority Level *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                  >
                    {priorities.filter(p => p !== 'All').map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Complainant / Petitioner *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name / Dept"
                    value={formData.complainant}
                    onChange={(e) => setFormData({ ...formData, complainant: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Respondent / Accused *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name / Entity"
                    value={formData.respondent}
                    onChange={(e) => setFormData({ ...formData, respondent: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Witnesses Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.witness_count}
                    onChange={(e) => setFormData({ ...formData, witness_count: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Evidentiary Exhibits</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.evidence_count}
                    onChange={(e) => setFormData({ ...formData, evidence_count: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Case Brief & Allegation Summary</label>
                <textarea
                  rows="3"
                  placeholder="Summarize the legal claims, dispute background, and requested relief..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Digitize & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
