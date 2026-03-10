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
        <div className="flex-1 p-8 max-w-4xl mx-auto w-full space-y-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                    <SettingsIcon className="w-8 h-8 text-zinc-400" />
                    Settings
                </h1>
                <p className="text-zinc-500">Manage your data and preferences.</p>
            </div>

            <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8">

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                            <Database className="w-5 h-5 text-indigo-400" /> Storage Stats
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800 flex flex-col items-center justify-center">
                                <span className="text-4xl font-extrabold text-white">{notes.length}</span>
                                <span className="text-zinc-500 mt-2 font-medium text-sm text-center">Saved Notes</span>
                            </div>
                            <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800 flex flex-col items-center justify-center">
                                <span className="text-4xl font-extrabold text-white">{flashcards.length}</span>
                                <span className="text-zinc-500 mt-2 font-medium text-sm text-center">Generated Flashcards</span>
                            </div>
                        </div>
                        <p className="text-sm text-zinc-400 px-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            All data is stored securely in your browser's local storage via IndexedDB.
                        </p>
                    </div>

                    <div className="pt-8 border-t border-zinc-800 space-y-4">
                        <h2 className="text-xl font-semibold text-red-400 flex items-center gap-2">
                            Danger Zone
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                            <div className="space-y-1 text-center sm:text-left">
                                <h3 className="text-red-300 font-medium text-sm">Delete All Data</h3>
                                <p className="text-xs text-red-400/80">Permanently clear all notes and flashcards from this device.</p>
                            </div>
                            <button
                                onClick={handleClear}
                                disabled={isClearing || (notes.length === 0 && flashcards.length === 0)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Trash2 className="w-4 h-4" />
                                {isClearing ? "Clearing..." : "Clear Data"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
