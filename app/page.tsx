"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Play, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Globe, 
  FileText, 
  Smile, 
  SlidersHorizontal,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("");
  const [limit, setLimit] = useState(5);
  const [runId, setRunId] = useState<string | null>(null);

  const { data: result, isLoading } = useQuery({
    queryKey: ["results", runId],
    queryFn: async () => {
      const res = await fetch(`/api/results/${runId}`);
      return res.json();
    },
    enabled: !!runId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") {
        return false;
      }
      return 2000;
    },
  });

  const handleRun = async () => {
    if (!input.trim()) {
      alert("Please enter a search query");
      return;
    }

    const res = await fetch("/api/run-agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, limit }),
    });

    const data = await res.json();
    setRunId(data.runId);
  };

  const state = result?.state;
  const progress = result?.progress;

  const ProgressBar = ({ value, label }: { value: number; label: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-semibold tracking-wide uppercase text-slate-600">
        <span>{label}</span>
        <span className="text-violet-600 font-bold">{value || 0}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200/60 shadow-inner">
        <div
          className="bg-gradient-to-r from-violet-600 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{ width: `${value || 0}%` }}
        />
      </div>
    </div>
  );

  const getSentimentBadge = (sentiment: string) => {
    const val = sentiment?.toLowerCase();
    if (val === "positive") return "bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-emerald-500/10";
    if (val === "negative") return "bg-rose-50 text-rose-700 border-rose-200/80 shadow-rose-500/10";
    return "bg-amber-50 text-amber-700 border-amber-200/80 shadow-amber-500/10";
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 text-slate-800 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100/70 border border-violet-200 text-violet-700 text-xs font-semibold tracking-wide uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Autonomous Agent Suite
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800">
              AI Price Scout
            </h1>
            <p className="text-slate-500 text-sm max-w-xl">
              Search, extract, and analyze product pricing dynamically with real-time multi-agent workflows.
            </p>
          </div>
          {runId && (
            <div className="flex items-center gap-2 self-start md:self-auto bg-white border border-slate-200/80 px-4 py-2 rounded-xl shadow-xs text-xs font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Run ID: <span className="text-slate-800 font-semibold">{runId}</span>
            </div>
          )}
        </div>

        {/* SEARCH BOX */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 flex flex-col sm:flex-row gap-3 transition-all">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white text-slate-900 placeholder-slate-400 font-medium transition-all"
              placeholder="Search for a product (e.g., iPhone 15 Pro, Sony WH-1000XM5)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRun()}
            />
          </div>

          <button
            onClick={handleRun}
            disabled={isLoading}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold px-7 py-3.5 rounded-xl transition shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Run Scout Agent</span>
              </>
            )}
          </button>
        </div>

        {/* MAIN DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* SIDEBAR / LEFT STATUS PANEL */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* PROGRESS CARD */}
            {progress && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                    <h2 className="text-base font-bold text-slate-900">Execution Progress</h2>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">Live</span>
                </div>

                <div className="space-y-4">
                  <ProgressBar value={progress.moderation} label="Moderation Filter" />
                  <ProgressBar value={progress.webpageScrape} label="Web Scraping Engine" />
                  <ProgressBar value={progress.sentimentAnalyzer} label="Sentiment Analyzer" />
                </div>
              </div>
            )}

            {/* MODERATION CARD */}
            {state?.approval && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    Moderation Guardrail
                  </h2>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  {state.approval.approved ? (
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200/60 shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm">Content Approved</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-700 font-semibold bg-rose-50 px-3.5 py-2 rounded-xl border border-rose-200/60 shadow-xs">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span className="text-sm">Content Rejected</span>
                    </div>
                  )}
                </div>

                {state.approval.feedback && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 leading-relaxed font-medium">
                    {state.approval.feedback}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* MAIN CONTENT / RIGHT RESULTS PANEL */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* SEARCH RESULTS */}
            {state?.results?.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <Globe className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Discovered Links
                    </h2>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {state.results.length} results
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {state.results.map((item: any, i: number) => (
                    <div 
                      key={i} 
                      className="group border border-slate-200/80 hover:border-violet-300 rounded-xl p-4 transition-all duration-200 hover:shadow-md bg-white flex flex-col justify-between space-y-3"
                    >
                      <p className="font-semibold text-slate-800 line-clamp-2 text-sm group-hover:text-violet-950 transition-colors">
                        {item.title}
                      </p>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700 truncate pt-2 border-t border-slate-100 mt-auto"
                      >
                        <span className="truncate">{item.link}</span>
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCRAPED PAGES */}
            {state?.pages?.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Extracted Data Pages
                    </h2>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {state.pages.length} pages
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {state.pages.map((page: any, i: number) => (
                    <div
                      key={i}
                      className="border border-slate-200/80 hover:border-sky-300 rounded-xl p-4 transition-all duration-200 hover:shadow-md bg-white flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1 text-sm">{page.title}</p>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                          {page.content}
                        </p>
                      </div>

                      {page.link && (
                        <a
                          href={page.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 pt-2 border-t border-slate-100 truncate"
                        >
                          <span className="truncate">{page.link}</span>
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SENTIMENT ANALYSIS */}
            {state?.sentiments?.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Market Sentiment Insights
                    </h2>
                  </div>
                  <Smile className="w-5 h-5 text-slate-400" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {state.sentiments.map((s: any, i: number) => (
                    <div 
                      key={i} 
                      className="border border-slate-200/80 rounded-xl p-4 bg-white flex flex-col justify-between space-y-3.5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-xs capitalize ${getSentimentBadge(s.sentiment)}`}>
                          {s.sentiment}
                        </span>
                        <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60">
                          Score: {s.score}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{s.reasoning}</p>

                      {s.link && (
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 truncate pt-2.5 border-t border-slate-100"
                        >
                          <span className="truncate">{s.link}</span>
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}