"use client";

import { useState } from "react";
import { useStore, Note } from "@/store/useStore";
import Sidebar from "@/components/Sidebar";
import { Search, Sparkles, ArrowRight, FileText, Hash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
    const { notes } = useStore();
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const router = useRouter();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const res = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, notes })
            });
            const data = await res.json();
            if (data.success) {
                const combined = data.rankings.map((r: any) => ({
                    ...r,
                    note: notes.find(n => n.id === r.id)
                })).filter((r: any) => r.note);
                setResults(combined);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-12 px-6">
            <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" />
                    Concept-Based Retrieval
                </div>
                <h1 className="text-5xl font-black">Semantic Search</h1>
                <p className="text-slate-400 text-lg">
                    Search your notes using natural language. We find meanings, not just keywords.
                </p>
            </header>

            <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <Search className="w-6 h-6 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="e.g., 'What are the main laws of physics discussed?'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-[32px] py-6 pl-16 pr-32 text-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all backdrop-blur-xl"
                />
                <button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-3 top-3 bottom-3 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {isSearching ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                    Search
                </button>
            </form>

            <div className="space-y-6">
                {isSearching && (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
                        <p className="text-slate-500 font-medium animate-pulse">Analyzing conceptual relationships...</p>
                    </div>
                )}

                {!isSearching && results.length > 0 && (
                    <div className="grid grid-cols-1 gap-4">
                        {results.map((result, idx) => (
                            <div
                                key={idx}
                                onClick={() => router.push(`/dashboard?noteId=${result.id}`)}
                                className="group p-6 rounded-[28px] bg-slate-900/40 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer hover:bg-slate-900/60"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                                            <Hash className="w-3 h-3" /> {result.note.topic || 'Uncategorized'}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{result.note.name}</h3>
                                    </div>
                                    <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 text-[10px] font-black uppercase tracking-tighter">
                                        {Math.round(result.relevanceScore * 100)}% Match
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">
                                    &quot;{result.reason}&quot;
                                </p>
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                                    <FileText className="w-4 h-4" />
                                    {result.note.summary?.slice(0, 150)}...
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isSearching && results.length === 0 && query && (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                        <p className="text-slate-500">No deep conceptual matches found for &quot;{query}&quot;.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
