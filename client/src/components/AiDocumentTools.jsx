import React, { useState } from 'react';
import { Sparkles, FileText, Lock, CheckCircle2, ShieldAlert, Copy, RefreshCw, Layers } from 'lucide-react';

export default function AiDocumentTools({ defaultTool = 'classifier' }) {
  const [activeTab, setActiveTab] = useState(defaultTool);

  // Document Classifier State
  const [classifyText, setClassifyText] = useState(
    `PETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA.
The Petitioner herein, Citizens Environmental Alliance, brings this Public Interest Litigation challenging the illegal industrial zone clearance issued by the Respondent Ministry without conducting mandatory Environmental Impact Assessment (EIA) required under statutory guidelines. The arbitrary action violates fundamental rights under Article 21 and the Precautionary Principle.`
  );
  const [classificationResult, setClassificationResult] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);

  // Data Redactor State
  const [redactText, setRedactText] = useState(
    `CONFIDENTIAL AFFIDAVIT OF WITNESS:
I, Witness Mr. Johnathan Sterling, residing at 742 Evergreen Terrace, contact phone +1 (555) 234-5678, email john.sterling@apexcorp.com, SSN 452-88-1092, hereby state under oath that Apex Logistics Directors transferred $4,500,000 to offshore bank account 4892-1029-3841-9920 on March 14, 2026.`
  );
  const [redactResult, setRedactResult] = useState(null);
  const [isRedacting, setIsRedacting] = useState(false);

  const handleClassify = async () => {
    if (!classifyText.trim()) return;
    setIsClassifying(true);
    try {
      const res = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: classifyText })
      });
      const data = await res.json();
      if (data.success) {
        setClassificationResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleRedact = async () => {
    if (!redactText.trim()) return;
    setIsRedacting(true);
    try {
      const res = await fetch('/api/ai/redact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: redactText })
      });
      const data = await res.json();
      if (data.success) {
        setRedactResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRedacting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs mb-1">
          <Sparkles className="w-4 h-4" />
          <span>AI Natural Language Processing Engine</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Intelligent Legal Document AI Suite</h1>
        <p className="text-xs text-slate-500 mt-1">Automate legal document categorization, statute extraction, and confidential PII data redaction.</p>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mt-5">
          <button
            onClick={() => setActiveTab('classifier')}
            className={`py-2.5 px-4 font-semibold text-xs border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'classifier'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            AI Document Classifier
          </button>
          <button
            onClick={() => setActiveTab('redactor')}
            className={`py-2.5 px-4 font-semibold text-xs border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'redactor'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            Automated Sensitive Data Redactor (PII)
          </button>
        </div>
      </div>

      {/* Tab 1: AI Document Classifier */}
      {activeTab === 'classifier' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Legal Document Text / Petition Filing</span>
              <span className="text-[11px] text-slate-400 font-normal">Paste or edit affidavit text</span>
            </h3>
            <textarea
              rows="9"
              value={classifyText}
              onChange={(e) => setClassifyText(e.target.value)}
              placeholder="Paste complaint, affidavit, or legal petition text here..."
              className="w-full p-3 border border-slate-200 rounded-lg text-xs leading-relaxed font-mono bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              onClick={handleClassify}
              disabled={isClassifying}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              {isClassifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isClassifying ? 'Analyzing Legal Structure...' : 'Analyze & Categorize Document'}
            </button>
          </div>

          {/* Classification Output */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">AI Categorization & Metadata Extraction</h3>

            {classificationResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500">Predicted Category</span>
                    <span className="px-2.5 py-0.5 bg-blue-700 text-white text-xs font-bold rounded">
                      {classificationResult.confidence} Match
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{classificationResult.category} Law</h2>
                  <p className="text-xs text-slate-600">{classificationResult.summary}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Extracted Statutes & Legal Provisions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {classificationResult.extractedStatutes.map((st, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-medium rounded">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Recommended Case Priority:</span>
                  <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {classificationResult.suggestedPriority}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-lg text-slate-400">
                <FileText className="w-8 h-8 mb-2 stroke-1" />
                <p className="text-xs font-medium">Click "Analyze & Categorize Document" to extract legal domains, statutory provisions, and priority matrix.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Sensitive Data PII Redactor */}
      {activeTab === 'redactor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Unredacted Source Text */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Original Unredacted Document</span>
              <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Contains PII & Sensitive Info
              </span>
            </h3>
            <textarea
              rows="9"
              value={redactText}
              onChange={(e) => setRedactText(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg text-xs leading-relaxed font-mono bg-slate-50 focus:bg-white focus:outline-none"
            />
            <button
              onClick={handleRedact}
              disabled={isRedacting}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              {isRedacting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4 text-emerald-400" />}
              {isRedacting ? 'Scrubbing PII Tokens...' : 'Automate PII & Sensitive Data Redaction'}
            </button>
          </div>

          {/* Redacted Output */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Privacy-Safe Public Legal Release</h3>
              {redactResult && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {redactResult.totalRedactions} PII Elements Masked
                </span>
              )}
            </div>

            {redactResult ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-900 text-emerald-300 rounded-lg font-mono text-xs leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap border border-slate-800">
                  {redactResult.redactedText}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Compliant with judicial data privacy regulations and litigant protection directives.</span>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-lg text-slate-400">
                <Lock className="w-8 h-8 mb-2 stroke-1" />
                <p className="text-xs font-medium">Click "Automate PII & Sensitive Data Redaction" to strip phone numbers, govt IDs, bank info, and witness names.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
