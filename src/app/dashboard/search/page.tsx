"use client";

import { useState } from "react";
import { useStore, Note } from "@/store/useStore";
import { Search, Sparkles, ArrowRight, FileText, Hash } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
    id: string;
    relevanceScore: number;
    reason: string;
    note: Note;
}

interface RawRanking {
    id: string;
    relevanceScore: number;
    reason: string;
}

export default function SearchPage() {
    const { notes } = useStore();
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const router = useRouter();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const res = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, notes }),
            });
            if (res.ok) {
                const data = await res.json();
                const combined = data.rankings
                    .map((r: RawRanking) => ({
                        ...r,
                        note: notes.find((n) => n.id === r.id),
                    }))
                    .filter((r: { note: Note | undefined }) => r.note) as SearchResult[];
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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-300 uppercase tracking-widest shadow-inner">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    Concept-Based Retrieval
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white">Semantic Search</h1>
                <p className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
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
                    aria-label="Semantic search query"
                />
                <button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-3 top-3 bottom-3 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {isSearching ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                        <ArrowRight className="w-5 h-5" />
                    )}
                    Search
                </button>
            </form>

            <div className="space-y-6">
                {isSearching && (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
                        <p className="text-zinc-400 font-medium animate-pulse opacity-90">
                            Analyzing conceptual relationships...
                        </p>
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
                                        <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-widest opacity-90">
                                            <Hash className="w-3 h-3" aria-hidden="true" />{" "}
                                            {result.note.topic || "Uncategorized"}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                            {result.note.name}
                                        </h3>
                                    </div>
                                    <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 text-xs font-black uppercase tracking-tighter">
                                        {Math.round(result.relevanceScore * 100)}% Match
                                    </div>
                                </div>
                                <p className="text-slate-200 text-sm leading-relaxed mb-6 italic opacity-90 bg-black/20 p-4 rounded-xl border border-white/5">
                                    &quot;{result.reason}&quot;
                                </p>
                                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium opacity-90">
                                    <FileText className="w-4 h-4 text-blue-400" aria-hidden="true" />
                                    <span className="line-clamp-1">{result.note.summary?.slice(0, 150)}...</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isSearching && results.length === 0 && query && (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                        <p className="text-zinc-400 font-medium opacity-80">
                            No deep conceptual matches found for &quot;{query}&quot;.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
