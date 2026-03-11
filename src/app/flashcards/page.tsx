"use client";

import { useState } from "react";
import { useStore, Flashcard } from "@/store/useStore";
import { Brain, Layers, RefreshCw, CheckCircle, Sparkles, AlertCircle, Bookmark, ChevronLeft, ChevronRight, GraduationCap, XCircle } from "lucide-react";
import { calculateNextReview } from "@/lib/spacedRepetition";
import { useRouter } from "next/navigation";

export default function FlashcardsPage() {
    const { flashcards, updateFlashcard, notes } = useStore();
    const [isStudying, setIsStudying] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const router = useRouter();

    const dueCards = flashcards.filter(card => card.nextReviewDate <= Date.now());
    const upcomingCards = flashcards.filter(card => card.nextReviewDate > Date.now());
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
            difficulty: quality < 3 ? 'hard' : (quality < 5 ? 'medium' : 'easy')
        });

        if (currentIdx < dueCards.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setShowBack(false);
        } else {
            setIsStudying(false);
            setCurrentIdx(0);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-6 space-y-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                        Memory Engine
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight">Active recall via Spaced Repetition (SM-2)</p>
                </div>
                {!isStudying && dueCards.length > 0 && (
                    <button
                        onClick={() => setIsStudying(true)}
                        className="px-8 py-4 bg-orange-600 hover:bg-orange-500 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20"
                    >
                        <Brain className="w-6 h-6" />
                        Start Session ({dueCards.length})
                    </button>
                )}
            </header>

            {!isStudying ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <section className="bg-slate-900/40 border border-white/5 rounded-[40px] p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Layers className="w-6 h-6 text-amber-500" />
                                    Knowledge Inventory
                                </h2>
                                <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {flashcards.length} Total Cards
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-green-500/5 border border-green-500/10">
                                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">Mastered</p>
                                    <p className="text-3xl font-black">{flashcards.filter(c => c.difficulty === 'easy').length}</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-orange-500/5 border border-orange-500/10">
                                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Due Now</p>
                                    <p className="text-3xl font-black font-mono">{dueCards.length}</p>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 gap-4">
                            {flashcards.slice(0, 5).map(card => {
                                const note = notes.find(n => n.id === card.noteId);
                                return (
                                    <div key={card.id} className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-default">
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-200 line-clamp-1">{card.front}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                <Bookmark className="w-3 h-3" /> {note?.name || 'General Knowledge'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">Review In</p>
                                            <p className="text-xs font-black text-amber-500">
                                                {card.nextReviewDate <= Date.now() ? 'Now' : Math.ceil((card.nextReviewDate - Date.now()) / (24 * 3600 * 1000)) + ' days'}
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
                            <h3 className="text-xl font-bold">Smart Insights</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Our SM-2 algorithm prioritizes cards you find difficult, ensuring zero-waste studying.
                            </p>
                            <div className="pt-4">
                                <button className="text-indigo-400 font-bold text-xs uppercase tracking-widest border-b border-indigo-500/30 pb-1">
                                    View Analytics
                                </button>
                            </div>
                        </section>

                        <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 flex flex-col items-center text-center space-y-4">
                            <GraduationCap className="w-12 h-12 text-slate-700" />
                            <p className="text-slate-500 font-medium text-sm">Consistent daily review increases retention by up to 80%.</p>
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
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Progress</p>
                            <p className="text-sm font-black">{currentIdx + 1} / {dueCards.length}</p>
                        </div>
                        <div className="w-12 h-12" /> {/* Spacer */}
                    </div>

                    <div className="group perspective h-[450px]">
                        <div
                            onClick={() => setShowBack(!showBack)}
                            className={`relative w-full h-full duration-700 preserve-3d cursor-pointer ${showBack ? 'rotate-y-180' : ''}`}
                        >
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden bg-slate-900 border-2 border-orange-500/20 rounded-[48px] p-12 flex flex-col items-center justify-center text-center space-y-8 shadow-2xl">
                                <div className="p-4 rounded-3xl bg-orange-500/10 text-orange-500">
                                    <Brain className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-black leading-tight text-white">{currentCard.front}</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Click to Reveal Answer</p>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-orange-600 rounded-[48px] p-12 flex flex-col items-center justify-center text-center space-y-8 shadow-2xl shadow-orange-500/40">
                                <CheckCircle className="w-16 h-16 text-white/50" />
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Answer</h3>
                                    <p className="text-3xl font-black text-white leading-tight">{currentCard.back}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {showBack ? (
                        <div className="grid grid-cols-4 gap-3 animate-in slide-in-from-bottom-4 duration-300">
                            {[
                                { q: 1, label: 'Forgot', color: 'bg-red-500 shadow-red-500/20' },
                                { q: 3, label: 'Hard', color: 'bg-orange-500 shadow-orange-500/20' },
                                { q: 4, label: 'Good', color: 'bg-indigo-600 shadow-indigo-500/20' },
                                { q: 5, label: 'Easy', color: 'bg-emerald-600 shadow-emerald-500/20' }
                            ].map(btn => (
                                <button
                                    key={btn.q}
                                    onClick={() => handleScore(btn.q)}
                                    className={`py-6 rounded-3xl text-white font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl ${btn.color}`}
                                >
                                    <span className="block text-[10px] opacity-60 uppercase mb-1">{btn.label}</span>
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
                                Reveal Secret
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
