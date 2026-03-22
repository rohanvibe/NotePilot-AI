"use client";

import { useState, useMemo, useEffect } from "react";
import { useStore } from "@/store/useStore";
import {
    Brain,
    Layers,
    CheckCircle,
    Sparkles,
    Bookmark,
    ChevronRight,
    GraduationCap,
    XCircle,
    Loader2,
} from "lucide-react";
import { calculateNextReview } from "@/lib/spacedRepetition";

export default function FlashcardsPage() {
    const { flashcards, updateFlashcard, notes } = useStore();
    const [isStudying, setIsStudying] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [tutorMode, setTutorMode] = useState(false);
    const [userResponse, setUserResponse] = useState("");
    const [feedback, setFeedback] = useState<string | null>(null);

    // Initialize with 0 and set on mount to avoid purity errors
    const [now, setNow] = useState(0);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNow(Date.now());
    }, []);

    const dueCards = useMemo(
        () => (now === 0 ? [] : flashcards.filter((card) => card.nextReviewDate <= now)),
        [flashcards, now]
    );

    const currentCard = dueCards[currentIdx];

    const handleScore = (quality: number) => {
        if (!currentCard) return;

        const { interval, ease, reviewCount, nextReviewDate } = calculateNextReview(
            quality,
            currentCard.interval,
            currentCard.ease,
            currentCard.reviewCount
        );

        updateFlashcard(currentCard.id, {
            interval,
            ease,
            reviewCount,
            nextReviewDate,
            difficulty: quality < 3 ? "hard" : quality < 5 ? "medium" : "easy",
        });

        if (currentIdx < dueCards.length - 1) {
            setCurrentIdx((prev) => prev + 1);
            setShowBack(false);
            setUserResponse("");
            setFeedback(null);
        } else {
            setIsStudying(false);
            setCurrentIdx(0);
        }
    };

    const handleTutorSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userResponse.trim()) return;
        setFeedback("Thinking...");
        // Mock feedback - in real app would call API
        setTimeout(() => {
            setShowBack(true);
            setFeedback(null);
        }, 800);
    };

    if (now === 0) return null; // Wait for mount to avoid hydration mismatch and purity errors

    return (
        <div className="max-w-5xl mx-auto py-12 px-6 space-y-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black bg-linear-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                        Practice Session
                    </h1>
                    <p className="text-slate-300 font-medium tracking-tight">
                        Smart learning for better memory
                    </p>
                </div>
                {!isStudying && dueCards.length > 0 && (
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setTutorMode(!tutorMode)}
                            className={`px-5 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border ${tutorMode ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                        >
                            <span className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                {tutorMode ? "Tutor: ON" : "Tutor: OFF"}
                            </span>
                        </button>
                        <button
                            onClick={() => setIsStudying(true)}
                            className="px-8 py-4 bg-orange-600 hover:bg-orange-500 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20"
                        >
                            <Brain className="w-6 h-6" />
                            Start Session ({dueCards.length})
                        </button>
                    </div>
                )}
            </header>

            {!isStudying ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <section className="bg-slate-900/40 border border-white/5 rounded-[40px] p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Layers className="w-6 h-6 text-amber-500" aria-hidden="true" />
                                    Your Cards
                                </h2>
                                <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300 uppercase tracking-widest shadow-inner">
                                    {flashcards.length} Total Cards
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-green-500/5 border border-green-500/10">
                                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">
                                        Mastered
                                    </p>
                                    <p className="text-3xl font-black">
                                        {flashcards.filter((c) => c.difficulty === "easy").length}
                                    </p>
                                </div>
                                <div className="p-6 rounded-3xl bg-orange-500/5 border border-orange-500/10">
                                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
                                        Due Now
                                    </p>
                                    <p className="text-3xl font-black font-mono">{dueCards.length}</p>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 gap-4">
                            {flashcards.slice(0, 5).map((card) => {
                                const note = notes.find((n) => n.id === card.noteId);
                                return (
                                    <div
                                        key={card.id}
                                        className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-default"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-200 line-clamp-1">
                                                {card.front}
                                            </p>
                                            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest opacity-90 flex items-center gap-1.5">
                                                <Bookmark className="w-3 h-3 text-amber-500" aria-hidden="true" />{" "}
                                                {note?.name || "General Knowledge"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-400 uppercase opacity-90">
                                                Review In
                                            </p>
                                            <p className="text-sm font-black text-amber-400">
                                                {card.nextReviewDate <= now
                                                    ? "Now"
                                                    : Math.ceil(
                                                        (card.nextReviewDate - now) /
                                                        (24 * 3600 * 1000)
                                                    ) + " days"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <section className="bg-indigo-600/10 border border-indigo-500/20 rounded-[40px] p-8 space-y-4">
                            <Sparkles className="w-10 h-10 text-indigo-400" />
                            <h3 className="text-xl font-bold">Smart Priority</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Our system focuses on cards you find tricky, so you learn faster 
                                and waste no time.
                            </p>
                            <div className="pt-4">
                                <button className="text-indigo-400 font-bold text-xs uppercase tracking-widest border-b border-indigo-500/30 pb-1">
                                    View Analytics
                                </button>
                            </div>
                        </section>

                        <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 flex flex-col items-center text-center space-y-4">
                            <GraduationCap className="w-12 h-12 text-zinc-700" />
                            <p className="text-zinc-400 font-medium text-sm opacity-90">
                                Consistent daily review increases retention by up to 80%.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-500">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setIsStudying(false)}
                            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest opacity-90">
                                Progress
                            </p>
                            <p className="text-base font-black text-white">
                                {currentIdx + 1} / {dueCards.length}
                            </p>
                        </div>
                        <div className="w-12 h-12" /> {/* Spacer */}
                    </div>

                    <div className="group perspective h-[450px]">
                        <div
                            onClick={() => setShowBack(!showBack)}
                            className={`relative w-full h-full duration-700 preserve-3d cursor-pointer ${showBack ? "rotate-y-180" : ""
                                }`}
                        >
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden bg-slate-900 border-2 border-orange-500/20 rounded-[48px] p-12 flex flex-col items-center justify-center text-center space-y-8 shadow-2xl">
                                <div className="p-4 rounded-3xl bg-orange-500/10 text-orange-500">
                                    <Brain className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black leading-tight text-white px-4">
                                    {currentCard?.front}
                                </h2>
                                {!tutorMode && (
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">
                                        Click to Reveal Answer
                                    </p>
                                )}
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-orange-600 rounded-[48px] p-12 flex flex-col items-center justify-center text-center space-y-8 shadow-2xl shadow-orange-500/40">
                                <CheckCircle className="w-16 h-16 text-white/50" />
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                        Answer
                                    </h3>
                                    <p className="text-2xl md:text-3xl font-black text-white leading-tight">
                                        {currentCard?.back}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {tutorMode && !showBack && (
                        <form onSubmit={handleTutorSubmit} className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                             <div className="relative">
                                <textarea
                                    value={userResponse}
                                    onChange={(e) => setUserResponse(e.target.value)}
                                    placeholder="Explain your answer here..."
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-white placeholder:text-slate-600 font-medium resize-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                                />
                                {feedback && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-3xl flex items-center justify-center font-bold text-indigo-300">
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" /> {feedback}
                                    </div>
                                )}
                             </div>
                             <button 
                                type="submit"
                                disabled={!userResponse.trim()}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-[28px] font-black text-xl transition-all shadow-xl shadow-indigo-500/20"
                             >
                                Submit Answer
                             </button>
                        </form>
                    )}

                    {showBack ? (
                        <div className="grid grid-cols-4 gap-3 animate-in slide-in-from-bottom-4 duration-300">
                            {[
                                { q: 1, label: "Forgot", color: "bg-red-600 shadow-red-600/20 active:bg-red-700" },
                                { q: 3, label: "Hard", color: "bg-orange-600 shadow-orange-600/20 active:bg-orange-700" },
                                { q: 4, label: "Good", color: "bg-indigo-600 shadow-indigo-600/20 active:bg-indigo-700" },
                                {
                                    q: 5,
                                    label: "Easy",
                                    color: "bg-emerald-600 shadow-emerald-600/20 active:bg-emerald-700",
                                },
                            ].map((btn) => (
                                <button
                                    key={btn.q}
                                    onClick={() => handleScore(btn.q)}
                                    className={`py-6 rounded-3xl text-white font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl outline-none focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-offset-black focus-visible:ring-white/50 ${btn.color}`}
                                    aria-label={`Mark as ${btn.label}`}
                                >
                                    <span className="block text-[11px] font-black opacity-80 uppercase mb-1 tracking-widest">
                                        {btn.label}
                                    </span>
                                    {btn.q}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowBack(true)}
                                className="px-12 py-5 bg-white text-black rounded-[28px] font-black text-xl hover:scale-105 transition-all flex items-center gap-3"
                            >
                                Show Answer
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
