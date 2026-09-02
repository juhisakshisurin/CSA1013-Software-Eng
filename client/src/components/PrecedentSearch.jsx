import React, { useState, useEffect } from 'react';
import { Search, Scale, Bookmark, Filter, Sparkles, ExternalLink, BookOpen } from 'lucide-react';

export default function PrecedentSearch() {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('All');
  const [precedents, setPrecedents] = useState([]);
  const [loading, setLoading] = useState(false);

  const domains = ['All', 'Corporate & Cyber Law', 'Constitutional Law', 'Taxation Law'];

  const fetchPrecedents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ai/precedents?query=${encodeURIComponent(query)}&domain=${encodeURIComponent(domain)}`);
      const data = await res.json();
      if (data.success) {
        setPrecedents(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrecedents();
  }, [domain]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPrecedents();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Judicial Knowledge Base</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Intelligent Legal Precedent Retrieval Engine</h1>
        <p className="text-xs text-slate-500 mt-1">Semantic NLP search across Supreme Court & High Court landmark rulings, binding ratios, and statutory interpretations.</p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search legal principles, citations, or keywords (e.g. intellectual property, transfer pricing, PIL)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              {domains.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              Search Rulings
            </button>
          </div>
        </form>
      </div>

      {/* Precedents List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-8 text-center border border-slate-200 rounded-xl text-slate-400 text-xs font-medium">
            Searching precedent database...
          </div>
        ) : precedents.length === 0 ? (
          <div className="bg-white p-8 text-center border border-slate-200 rounded-xl text-slate-400 text-xs">
            No precedent rulings found matching query keywords. Try clearing search filters.
          </div>
        ) : (
          precedents.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {item.citation}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{item.legal_domain}</span>
                  <span className="text-xs text-slate-400">({item.year})</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <Sparkles className="w-3 h-3" />
                  <span>{item.matchScore}% Legal Similarity</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.summary}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-800 block uppercase text-[10px] tracking-wider">Ratio Decidendi / Binding Verdict</span>
                <p className="text-slate-700 italic font-serif">"{item.verdict}"</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="font-semibold text-slate-700">Key Legal Principles:</span>
                  <span>{item.key_principles}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
