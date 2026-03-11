"use client";

import { RefreshCw } from "lucide-react";
import { useStore } from "@/store/useStore";
import dynamic from "next/dynamic";

const KnowledgeGraph = dynamic(() => import("@/components/KnowledgeGraph"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[600px] flex items-center justify-center bg-slate-900/50 rounded-2xl border border-white/10 text-slate-500 font-medium">
            Initializing Graph...
        </div>
    ),
});

export default function GraphPage() {
    const { notes, addRelationships } = useStore();
    return (
        <div className="max-w-6xl mx-auto space-y-8 py-12 px-6">
            <header className="flex items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Knowledge Graph
                    </h1>
                    <p className="text-slate-400">
                        Connect topics, discover patterns, and explore your digital second brain.
                    </p>
                </div>
                <button
                    onClick={async () => {
                        const res = await fetch("/api/analyze-relationships", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ notes }),
                        });
                        const data = await res.json();
                        if (data.success) {
                            addRelationships(data.relationships);
                        }
                    }}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-sm transition-all flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Synchronize Connections
                </button>
            </header>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-900/40 border border-white/5 p-1 rounded-3xl overflow-hidden shadow-2xl">
                    <KnowledgeGraph />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <h3 className="font-semibold text-blue-400 mb-1">Total Nodes</h3>
                        <p className="text-2xl font-mono">Exploring...</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <h3 className="font-semibold text-indigo-400 mb-1">Relationships</h3>
                        <p className="text-2xl font-mono">Mapping...</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <h3 className="font-semibold text-purple-400 mb-1">Top Subject</h3>
                        <p className="text-2xl font-mono">Analyzing...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
