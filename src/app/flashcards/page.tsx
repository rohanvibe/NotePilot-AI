"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Layers, RefreshCw, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

export default function Flashcards() {
    const { notes, flashcards, addFlashcards } = useStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateNewFlashcards = async () => {
        if (notes.length === 0) return;

        setIsGenerating(true);
        setError(null);

        try {
            // Pick a random chunk or just use all notes text up to a limit
            const text = notes.map(n => n.content).join("\n\n").slice(0, 10000); // Send up to 10k chars
            const names = notes.map(n => n.name);

            const res = await fetch("/api/flashcards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, notesNames: names })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to generate flashcards");

            const newCards = data.flashcards.map((fc: any) => ({
                id: crypto.randomUUID(),
                front: fc.front,
                back: fc.back
            }));

            addFlashcards(newCards);
            setCurrentIndex(flashcards.length); // point to first new card
            setIsFlipped(false);
        } catch (err: any) {
            setError(err.message || "Failed to generate flashcards.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    };

    if (notes.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                <Layers className="w-16 h-16 text-zinc-700" />
                <h2 className="text-2xl font-semibold text-zinc-300">No notes to quiz</h2>
                <p className="text-zinc-500">Upload notes first to generate flashcards.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col py-12 px-6 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-12">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Layers className="w-8 h-8 text-indigo-500" />
                        Study Flashcards
                    </h1>
                    <p className="text-zinc-500">Review key concepts extracted from your notes.</p>
                </div>

                <button
                    onClick={generateNewFlashcards}
                    disabled={isGenerating}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                    {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                    {isGenerating ? "Generating..." : "Generate More"}
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8">
                    {error}
                </div>
            )}

            {flashcards.length === 0 && !isGenerating ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4 border-2 border-dashed border-zinc-800 rounded-3xl">
                    <HelpCircle className="w-16 h-16 text-zinc-700" />
                    <p className="text-zinc-400 text-lg">Click "Generate More" to create your first deck!</p>
                </div>
            ) : flashcards.length > 0 ? (
                <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-8">

                    {/* Progress */}
                    <div className="w-full flex justify-between text-sm text-zinc-500 font-medium px-4">
                        <span>Card {currentIndex + 1} of {flashcards.length}</span>
                        <span>{isFlipped ? "Answer" : "Question"}</span>
                    </div>

                    {/* Card */}
                    <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="w-full aspect-[3/2] perspective-1000 cursor-pointer group"
                    >
                        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden bg-zinc-900 border border-zinc-800 shadow-2xl rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                                <div className="absolute top-6 left-6 text-indigo-500/20">
                                    <HelpCircle className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-medium text-zinc-100">
                                    {flashcards[currentIndex].front}
                                </h3>
                                <p className="absolute bottom-6 text-zinc-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to reveal answer
                                </p>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600/10 border border-indigo-500/30 shadow-2xl shadow-indigo-500/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                                <h3 className="text-2xl font-medium text-white">
                                    {flashcards[currentIndex].back}
                                </h3>
                            </div>

                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handlePrev}
                            className="p-4 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="p-4 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                </div>
            ) : null}

        </div>
    );
}
