"use client";

import { useStore } from "@/store/useStore";
import { Folder, Key, AlignLeft, Tags } from "lucide-react";

export default function Dashboard() {
    const { notes } = useStore();

    const groupedNotes = notes.reduce((acc, note) => {
        const topic = note.topic || "Uncategorized";
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(note);
        return acc;
    }, {} as Record<string, typeof notes>);

    if (notes.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                <Folder className="w-16 h-16 text-zinc-700" />
                <h2 className="text-2xl font-semibold text-zinc-300">No notes found</h2>
                <p className="text-zinc-500">Go back to the home page and upload some messy notes!</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto w-full space-y-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
                    Your Organized Knowledge
                </h1>
                <p className="text-zinc-500">AI has grouped and summarized your uploaded files.</p>
            </div>

            <div className="space-y-12">
                {Object.entries(groupedNotes).map(([topic, topicNotes]) => (
                    <div key={topic} className="space-y-6">
                        <h2 className="text-2xl font-semibold flex items-center gap-3 border-b border-zinc-800 pb-4 text-indigo-400">
                            <Folder className="w-6 h-6" />
                            {topic}
                            <span className="text-sm font-medium bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full ml-auto">
                                {topicNotes.length} files
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {topicNotes.map((note) => (
                                <div key={note.id} className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 hover:bg-zinc-900 transition-colors space-y-6 shadow-sm">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-medium text-white line-clamp-1">{note.name}</h3>
                                        <p className="text-xs text-zinc-500">{new Date(note.createdAt).toLocaleString()}</p>
                                    </div>

                                    {note.summary && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                                                <AlignLeft className="w-4 h-4" /> Summary
                                            </div>
                                            <p className="text-zinc-300 text-sm leading-relaxed bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                                                {note.summary}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        {note.keyPoints && note.keyPoints.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                                                    <Key className="w-4 h-4" /> Key Points
                                                </div>
                                                <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
                                                    {note.keyPoints.slice(0, 3).map((kp, i) => (
                                                        <li key={i} className="line-clamp-2">{kp}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {note.importantTerms && note.importantTerms.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                                                    <Tags className="w-4 h-4" /> Key Terms
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {note.importantTerms.slice(0, 5).map((term, i) => (
                                                        <span key={i} className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-1 rounded-md">
                                                            {term}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
