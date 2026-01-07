
import React, { useState } from 'react';
import { analyzeContent } from '../services/geminiService';

const SmartHub: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<any[] | null>(null);
  
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File is too large. Max 10MB.");
        return;
      }
      setFile(selectedFile);
      setError(null);
      setSummaryResult(null);
      setQuizResult(null);
    }
  };

  const generateSummary = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSummaryResult(null); // Clear previous results to enforce separation
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const analysis = await analyzeContent(base64, file.type);
        setSummaryResult(analysis.summary);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || "Failed to generate summary.");
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setQuizResult(null); // Clear previous results to enforce separation
    setQuizScore(null);
    setUserAnswers([]);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const analysis = await analyzeContent(base64, file.type);
        setQuizResult(analysis.quiz);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || "Failed to generate quiz.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black mb-2 tracking-tight">Smart Hub</h1>
        <p className="text-slate-400">Transform data into structured intelligence. Upload a document to start a cycle.</p>
      </header>

      <div className="glass p-8 rounded-[40px] text-center relative overflow-hidden shadow-2xl">
        {loading && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-bold text-indigo-400 animate-pulse">Processing Material...</p>
          </div>
        )}

        <input type="file" id="smart-upload" className="hidden" onChange={handleFileUpload} accept="image/*,application/pdf" />
        <label htmlFor="smart-upload" className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-white/10 rounded-[30px] cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/20 transition-all mb-6 group">
          <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">{file ? '📂' : '☁️'}</span>
          <span className="text-lg font-bold">{file ? file.name : 'Drop material here'}</span>
          <span className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-bold">PDF or Images</span>
        </label>
        
        {error && <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl text-sm">{error}</div>}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={generateSummary}
            disabled={!file || loading}
            className="bg-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-500 disabled:bg-slate-700 transition-all shadow-xl shadow-indigo-500/20 flex-1"
          >
            Run Summarizer
          </button>
          <button 
            onClick={generateQuiz}
            disabled={!file || loading}
            className="bg-slate-800 border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-slate-700 disabled:bg-slate-900 transition-all flex-1"
          >
            Launch Quiz Master
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Summarizer Section - Standalone */}
        <section className={`glass p-8 rounded-[40px] border border-white/5 transition-all duration-700 ${summaryResult ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-indigo-400">⚡</span> Summarizer
            </h3>
            {summaryResult && <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase px-2 py-1 rounded">Ready</span>}
          </div>
          {summaryResult ? (
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">{summaryResult}</p>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-slate-500 italic">
              Use the tool above to generate insights.
            </div>
          )}
        </section>

        {/* Quiz Master Section - Standalone */}
        <section className={`glass p-8 rounded-[40px] border border-white/5 transition-all duration-700 ${quizResult ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-indigo-400">🎯</span> Quiz Master
            </h3>
            {quizResult && <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase px-2 py-1 rounded">Challenge Active</span>}
          </div>
          {quizResult ? (
            <div className="space-y-8">
              {quizResult.map((q, idx) => (
                <div key={idx} className="space-y-4">
                  <p className="font-bold text-slate-200 text-lg">{idx + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 gap-3">
                    {q.options.map((opt: string, optIdx: number) => (
                      <button
                        key={optIdx}
                        onClick={() => {
                          const newAns = [...userAnswers];
                          newAns[idx] = optIdx;
                          setUserAnswers(newAns);
                        }}
                        className={`p-4 rounded-2xl text-left border transition-all ${userAnswers[idx] === optIdx ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-800/50 border-white/5 hover:border-white/20'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${userAnswers[idx] === optIdx ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="font-medium">{opt}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="pt-6">
                <button 
                  onClick={() => {
                    let score = 0;
                    quizResult.forEach((q, i) => { if (userAnswers[i] === q.answer) score++; });
                    setQuizScore(score);
                  }}
                  disabled={userAnswers.length < quizResult.length}
                  className="w-full bg-indigo-600 py-5 rounded-2xl font-black text-lg hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-2xl shadow-indigo-500/20"
                >
                  Submit Evaluation
                </button>

                {quizScore !== null && (
                  <div className={`mt-8 p-8 rounded-3xl text-center animate-in zoom-in duration-500 ${quizScore === quizResult.length ? 'bg-emerald-500/20 border border-emerald-500/50 shadow-2xl' : 'bg-indigo-500/20 border border-indigo-500/50'}`}>
                    <div className="text-xs uppercase tracking-widest font-black opacity-70 mb-2">Final Evaluation</div>
                    <div className="text-6xl font-black mb-3">{quizScore} <span className="text-2xl opacity-50">/ {quizResult.length}</span></div>
                    <p className="font-medium">
                      {quizScore === quizResult.length ? "Mastery confirmed." : "Review core insights and re-test."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-slate-500 italic">
              Use the tool above to start a knowledge check.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SmartHub;
