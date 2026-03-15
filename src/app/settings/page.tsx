"use client";

import { useStore } from "@/store/useStore";
import { Settings as SettingsIcon, Trash2, Database, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function Settings() {
    const { notes, flashcards, clearAll } = useStore();
    const [isClearing, setIsClearing] = useState(false);

    const handleClear = async () => {
        if (!confirm("Are you sure you want to delete ALL notes and flashcards? This cannot be undone.")) return;
        setIsClearing(true);
        setTimeout(() => {
            clearAll();
            setIsClearing(false);
        }, 500); // Give user a tiny bit of feedback
    };

    return (
        <div className="flex-1 p-8 md:p-12 max-w-4xl mx-auto w-full space-y-12 relative z-10">
            <header className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white">
                        <SettingsIcon className="w-8 h-8 opacity-80" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-white leading-none">Settings</h1>
                        <p className="text-zinc-400 font-medium mt-1 opacity-90">Manage your digital brain configuration</p>
                    </div>
                </div>
            </header>

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="bg-white/2 border border-white/5 rounded-[40px] p-10 backdrop-blur-3xl shadow-3xl space-y-12">
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <Database className="w-5 h-5 text-indigo-400" /> 
                            Knowledge Storage
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/2 rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center space-y-2 group hover:bg-white/5 transition-all">
                                <span className="text-5xl font-black text-white group-hover:scale-110 transition-transform">{notes.length}</span>
                                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Active Notes</span>
                            </div>
                            <div className="bg-white/2 rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center space-y-2 group hover:bg-white/5 transition-all">
                                <span className="text-5xl font-black text-white group-hover:scale-110 transition-transform">{flashcards.length}</span>
                                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Flashcards</span>
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
                            <AlertTriangle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                Your intelligence remains private. All data is stored locally on this machine using 
                                <span className="text-indigo-400"> IndexedDB</span>. No cloud uploads occur without your explicit permission.
                            </p>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 space-y-6">
                        <h2 className="text-xl font-bold text-red-500 flex items-center gap-3">
                            Privacy & Erasure
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-6 items-center justify-between p-8 bg-red-500/5 rounded-[32px] border border-red-500/10 hover:bg-red-500/10 transition-all">
                            <div className="space-y-2 text-center sm:text-left">
                                <h3 className="text-red-400 font-bold text-lg">Brain Reset</h3>
                                <p className="text-sm text-red-400/60 font-medium max-w-sm leading-snug">
                                    Permanently delete all notes, knowledge graphs, and study data. This action is irreversible.
                                </p>
                            </div>
                            <button
                                onClick={handleClear}
                                disabled={isClearing || (notes.length === 0 && flashcards.length === 0)}
                                className="bg-red-500 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all hover:scale-105 hover:bg-red-600 active:scale-95 disabled:opacity-30 disabled:grayscale"
                            >
                                <Trash2 className="w-5 h-5" />
                                {isClearing ? "Erasing..." : "Erase All Data"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
