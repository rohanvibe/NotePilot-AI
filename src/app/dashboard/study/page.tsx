"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import {
    BookOpen,
    Sparkles,
    CheckCircle,
    XCircle,
    RefreshCw,
    GraduationCap,
    ChevronRight,
    Brain,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Question {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

export default function StudyPage() {
    const { notes } = useStore();
    const router = useRouter();
    const [quiz, setQuiz] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    const generateQuiz = async (topic?: string) => {
        setIsGenerating(true);
        try {
            const context = notes
                .filter((n) => !topic || n.topic === topic)
                .map((n) => n.content)
                .join("\n\n")
                .slice(0, 15000);

            const res = await fetch("/api/study", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ context }),
            });

            const data = await res.json();
            if (data.success) {
                setQuiz(data.quiz);
                setCurrentQuestion(0);
                setScore(0);
                setIsFinished(false);
                setSelectedAnswer(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index);
        if (quiz[currentQuestion] && index === quiz[currentQuestion].correct) {
            setScore((prev) => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < quiz.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            setSelectedAnswer(null);
        } else {
            setIsFinished(true);
        }
    };

    const topics = Array.from(new Set(notes.map((n) => n.topic || "Uncategorized")));

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Study Arena
                    </h1>
                    <p className="text-slate-400 font-medium">
                        Test your knowledge with AI-driven challenges.
                    </p>
                </div>
                {quiz.length > 0 && !isFinished && (
                    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center gap-2">
                        <span className="text-emerald-500">Q{currentQuestion + 1}</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-slate-400">{quiz.length}</span>
                    </div>
                )}
            </header>

            {!quiz.length && !isGenerating && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
                        <div className="w-16 h-16 rounded-[24px] bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Quick Start</h2>
                            <p className="text-slate-500">
                                Generate a quiz from all your knowledge sources across all topics.
                            </p>
                        </div>
                        <button
                            onClick={() => generateQuiz()}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/20"
                        >
                            Generate Full Quiz
                        </button>
                    </div>

                    <div className="p-8 rounded-[40px] bg-slate-900/40 border border-white/5 space-y-6">
                        <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Topic Focus</h2>
                            <p className="text-slate-500">
                                Master specific subjects by selecting a topic below.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {topics.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => generateQuiz(t)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold transition-all"
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isGenerating && (
                <div className="py-20 text-center space-y-6">
                    <div className="w-20 h-20 border-8 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                    <p className="text-xl font-bold animate-pulse text-emerald-400">
                        Synthesizing practice questions...
                    </p>
                </div>
            )}

            {quiz.length > 0 && !isFinished && quiz[currentQuestion] && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="p-10 rounded-[48px] bg-slate-900/60 border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Brain className="w-32 h-32 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight relative z-10">
                            {quiz[currentQuestion].question}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {quiz[currentQuestion].options.map((option: string, idx: number) => {
                            const isCorrect = idx === quiz[currentQuestion].correct;
                            const isSelected = selectedAnswer === idx;

                            let styles =
                                "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10";
                            if (selectedAnswer !== null) {
                                if (isCorrect)
                                    styles = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400";
                                else if (isSelected)
                                    styles = "bg-red-500/20 border-red-500/50 text-red-400";
                                else styles = "opacity-40 grayscale";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={selectedAnswer !== null}
                                    className={`p-6 rounded-[28px] border text-left font-bold transition-all flex items-center justify-between group ${styles}`}
                                >
                                    <span className="flex-1 pr-4">{option}</span>
                                    {selectedAnswer !== null && isCorrect && (
                                        <CheckCircle className="w-6 h-6 shrink-0" />
                                    )}
                                    {isSelected && !isCorrect && (
                                        <XCircle className="w-6 h-6 shrink-0" />
                                    )}
                                    {selectedAnswer === null && (
                                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {selectedAnswer !== null && (
                        <div className="p-8 rounded-[32px] bg-emerald-500/5 border border-emerald-500/10 animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2 font-mono">
                                <Sparkles className="w-4 h-4" /> Insight
                            </div>
                            <p className="text-slate-300 leading-relaxed font-medium capitalize">
                                {quiz[currentQuestion].explanation}
                            </p>
                            <button
                                onClick={nextQuestion}
                                className="mt-8 px-10 py-4 bg-white text-black rounded-2xl font-black text-lg hover:scale-105 transition-all flex items-center gap-2"
                            >
                                Continue Path
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {isFinished && (
                <div className="text-center py-20 space-y-10 bg-white/5 border border-white/5 rounded-[64px] animate-in zoom-in duration-700">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse" />
                        <div className="w-32 h-32 rounded-[40px] bg-emerald-600 flex items-center justify-center mx-auto shadow-2xl relative">
                            <GraduationCap className="w-16 h-16 text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-5xl font-black">Evaluation Ready</h2>
                        <p className="text-slate-400 text-xl font-medium">
                            You dominated {score} / {quiz.length} concepts
                        </p>
                    </div>

                    <div className="max-w-xs mx-auto pt-6 flex flex-col gap-4">
                        <button
                            onClick={() => {
                                setQuiz([]);
                                setIsFinished(false);
                            }}
                            className="w-full py-5 bg-white text-black rounded-3xl font-black text-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                        >
                            <RefreshCw className="w-6 h-6" />
                            Retry Challenge
                        </button>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl font-black text-xl transition-all"
                        >
                            Back to Brain
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
