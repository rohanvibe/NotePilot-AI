"use client";

import { useState } from "react";
import { useStore, Note } from "@/store/useStore";
import {
    Folder,
    Key,
    AlignLeft,
    Tags,
    Zap,
    BookOpen,
    GraduationCap,
    Search,
    Sparkles,
    Files,
    CheckCircle2,
    RefreshCw,
    XCircle,
    Calendar,
    Share2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface RevisionData {
    topic: string;
    summary: string;
    examQuestions: string[];
    formulas: string[];
    studyPlan: string[];
}

export default function Dashboard() {
    const { notes, updateNote, flashcards } = useStore();
    const [simplifyingId, setSimplifyingId] = useState<string | null>(null);
    const [revisingTopic, setRevisingTopic] = useState<string | null>(null);
    const [revisionData, setRevisionData] = useState<RevisionData | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const groupedNotes = notes.reduce((acc, note) => {
        const topic = note.topic || "Uncategorized";
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(note);
        return acc;
    }, {} as Record<string, Note[]>);

    const filteredNotes = Object.entries(groupedNotes).filter(
        ([topic, topicNotes]) =>
            topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topicNotes.some(
                (n) =>
                    n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    n.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
    );

    const explainSimply = async (note: Note) => {
        setSimplifyingId(note.id);
        try {
            const res = await fetch("/api/explain-simply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: note.content }),
            });
            if (res.ok) {
                const data = await res.json();
                updateNote(note.id, { simplifiedContent: data.explanation });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSimplifyingId(null);
        }
    };

    const prepareForExam = async (topic: string, topicNotes: Note[]) => {
        setRevisingTopic(topic);
        try {
            const text = topicNotes
                .map((n) => n.content)
                .join("\n\n")
                .slice(0, 15000);
            const res = await fetch("/api/revision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, notesNames: topicNotes.map((n) => n.name) }),
            });
            if (res.ok) {
                const data = await res.json();
                setRevisionData({ topic, ...data.revision });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setRevisingTopic(null);
        }
    };

    if (notes.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
                <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 shadow-2xl">
                    <Folder className="w-16 h-16 text-indigo-500 mb-4 mx-auto" />
                    <h2 className="text-3xl font-bold text-center">Your brain is empty</h2>
                    <p className="text-slate-400 text-center max-w-sm mt-2">
                        Go to the Upload section and drop some messy notes to start building
                        your second brain.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-8 w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                    >
                        Upload Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 py-12 px-6">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <header className="space-y-1">
                    <h1 className="text-4xl font-bold bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Managing your digital knowledge base
                    </p>
                </header>

                <div className="relative group max-w-md w-full">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search concepts, topics, or notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all backdrop-blur-md"
                    />
                </div>
            </div>

            {/* Chaos to Knowledge Summary */}
            <section className="bg-indigo-600/10 border border-indigo-500/20 rounded-[40px] p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Sparkles className="w-48 h-48 text-indigo-400" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="space-y-4 max-w-md">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                            <CheckCircle2 className="w-3 h-3" />
                            Transformation Complete
                        </div>
                        <h2 className="text-3xl font-bold">Organized Notes</h2>
                        <p className="text-slate-400 leading-relaxed">
                            We&apos;ve automatically sorted your files into topics and summaries.
                        </p>
                    </div>

                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        <StatCard
                            icon={<Files className="w-4 h-4" />}
                            label="Files"
                            value={notes.length}
                            color="blue"
                        />
                        <StatCard
                            icon={<Tags className="w-4 h-4" />}
                            label="Topics"
                            value={Object.keys(groupedNotes).length}
                            color="purple"
                        />
                        <StatCard
                            icon={<Zap className="w-4 h-4" />}
                            label="Cards"
                            value={flashcards.length}
                            color="amber"
                        />
                        <StatCard
                            icon={<GraduationCap className="w-4 h-4" />}
                            label="Mastery"
                            value={Math.min(100, notes.length * 5)}
                            color="emerald"
                        />
                    </div>
                </div>
            </section>

            {/* Grouped Notes */}
            <div className="space-y-16">
                {filteredNotes.map(([topic, topicNotes]) => (
                    <section key={topic} className="space-y-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-3xl bg-indigo-500/10 text-indigo-400">
                                    <Folder className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                                        {topic}
                                    </h2>
                                    <p className="text-slate-500 text-sm font-medium">
                                        {topicNotes.length} source files
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        const text = `Check out my structured revision for ${topic} on NotePilot AI!`;
                                        navigator.share ? navigator.share({ title: 'Study Hub', text, url: window.location.href }) : alert('Drafting share...');
                                    }}
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5 transition-all"
                                    title="Invite classmates"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => prepareForExam(topic, topicNotes)}
                                    disabled={revisingTopic === topic}
                                    className="hidden md:flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-sm transition-all text-white"
                                >
                                    {revisingTopic === topic ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <GraduationCap className="w-4 h-4" />
                                    )}
                                    Get Exam Ready
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {topicNotes.map((note) => (
                                <div
                                    key={note.id}
                                    className="group bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 rounded-[32px] p-8 transition-all hover:bg-slate-900/60 shadow-xl space-y-8"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                                                {note.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-mono">
                                                {new Date(note.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => explainSimply(note)}
                                            disabled={simplifyingId === note.id}
                                            className="p-3 rounded-2xl bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 transition-all border border-transparent hover:border-indigo-500/30"
                                        >
                                            {simplifyingId === note.id ? (
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Zap className="w-5 h-5" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                const text = `Shared note: ${note.name}\n\nSummary: ${note.summary}`;
                                                navigator.share ? navigator.share({ title: note.name, text, url: window.location.href }) : alert('URL Copied!');
                                            }}
                                            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all border border-transparent"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {note.summary && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                <AlignLeft className="w-3 h-3 text-indigo-500" />{" "}
                                                Summary
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed bg-black/40 p-5 rounded-2xl border border-white/5 italic">
                                                &quot;{note.summary}&quot;
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {note.keyPoints && note.keyPoints.length > 0 && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                    <Key className="w-3 h-3 text-purple-500" /> Focus
                                                </div>
                                                <ul className="space-y-3">
                                                    {note.keyPoints.slice(0, 3).map((kp, i) => (
                                                        <li
                                                            key={i}
                                                            className="text-sm text-slate-400 flex items-start gap-3"
                                                        >
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                                            <span className="line-clamp-2">{kp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {note.importantTerms && note.importantTerms.length > 0 && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                    <Tags className="w-3 h-3 text-emerald-500" /> Tags
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {note.importantTerms.slice(0, 4).map((term, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-[10px] font-bold bg-white/5 text-slate-300 border border-white/10 px-3 py-1.5 rounded-lg"
                                                        >
                                                            #{term}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {note.simplifiedContent && (
                                        <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                                            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-4">
                                                <Sparkles className="w-4 h-4" /> Simplified
                                            </div>
                                            <div className="text-slate-300 text-sm leading-relaxed">
                                                <p className="whitespace-pre-wrap">
                                                    {note.simplifiedContent}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Revision Modal */}
            {revisionData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0a0a0b] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] p-8 md:p-12 relative shadow-3xl">
                        <button
                            onClick={() => setRevisionData(null)}
                            className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                        >
                            <XCircle className="w-8 h-8" />
                        </button>

                        <div className="space-y-10">
                            <header className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                                    <GraduationCap className="w-4 h-4" />
                                    Revision Guide
                                </div>
                                <h2 className="text-5xl font-black text-white">
                                    {revisionData.topic} Mastery
                                </h2>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <section className="space-y-4">
                                        <h3 className="text-xl font-bold text-indigo-400 flex items-center gap-2 italic">
                                            <AlignLeft className="w-5 h-5" /> Summary
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed text-lg pb-6 border-b border-white/5">
                                            {revisionData.summary}
                                        </p>
                                    </section>
                                    <section className="space-y-4">
                                        <h3 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                                            <BookOpen className="w-5 h-5" /> Questions
                                        </h3>
                                        <div className="space-y-3">
                                            {revisionData.examQuestions.map((q: string, i: number) => (
                                                <div
                                                    key={i}
                                                    className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 text-slate-200"
                                                >
                                                    {q}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                                <div className="space-y-8">
                                    <section className="space-y-4">
                                        <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                                            <Zap className="w-5 h-5" /> Formulas
                                        </h3>
                                        <div className="space-y-3">
                                            {revisionData.formulas.map((f: string, i: number) => (
                                                <div
                                                    key={i}
                                                    className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 font-mono text-emerald-300 text-sm"
                                                >
                                                    {f}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                    <section className="space-y-4">
                                        <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                                            <Calendar className="w-5 h-5" /> Plan
                                        </h3>
                                        <div className="space-y-3">
                                            {revisionData.studyPlan.map((s: string, i: number) => (
                                                <div key={i} className="flex gap-4 items-center">
                                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-xs shrink-0">
                                                        {i + 1}
                                                    </div>
                                                    <p className="text-slate-300 text-sm font-medium">{s}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push("/dashboard/study")}
                                className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 rounded-[28px] text-xl font-black text-white transition-all shadow-2xl shadow-indigo-500/30"
                            >
                                Start Practice Quiz
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
}) {
    const colors: Record<string, string> = {
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };

    return (
        <div className={`p-6 rounded-3xl border ${colors[color]} backdrop-blur-md`}>
            <div className="flex items-center gap-2 mb-3 opacity-60">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest">
                    {label}
                </span>
            </div>
            <p className="text-3xl font-black tracking-tighter">{value}</p>
        </div>
    );
}
