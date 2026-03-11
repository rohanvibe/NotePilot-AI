"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { GraduationCap, Sparkles, ArrowRight, BookOpen, CheckCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CoursePage() {
    const { notes, courses, addCourse } = useStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    const generateCourse = async () => {
        if (notes.length === 0) return;
        setIsGenerating(true);
        try {
            const res = await fetch("/api/course", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes }),
            });
            if (res.ok) {
                const data = await res.json();
                addCourse({
                    ...data.course,
                    id: crypto.randomUUID(),
                    createdAt: Date.now(), // Fixed to number type as per store
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-12 px-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-10 rounded-[40px] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <GraduationCap className="w-64 h-64 text-indigo-400" />
                </div>
                <div className="space-y-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        AI Curriculum Builder
                    </div>
                    <h1 className="text-5xl font-black">Course Builder</h1>
                    <p className="text-slate-400 text-lg max-w-xl">
                        We&apos;ve analyzed your notes and can build a logical learning path for you to
                        master any subject.
                    </p>
                </div>
                <button
                    onClick={generateCourse}
                    disabled={isGenerating || notes.length === 0}
                    className="relative z-10 px-8 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black transition-all shadow-2xl shadow-indigo-500/30 flex items-center gap-3 disabled:opacity-50"
                >
                    {isGenerating ? (
                        <Clock className="w-6 h-6 animate-spin" />
                    ) : (
                        <GraduationCap className="w-6 h-6" />
                    )}
                    Generate Academy
                </button>
            </header>

            <div className="grid grid-cols-1 gap-12">
                {courses.length === 0 && !isGenerating && (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[48px] space-y-6">
                        <BookOpen className="w-16 h-16 text-slate-700 mx-auto" />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-slate-500">No courses yet</h3>
                            <p className="text-slate-600">
                                Click the button above to build your first learning path.
                            </p>
                        </div>
                    </div>
                )}

                {isGenerating && (
                    <div className="py-20 text-center space-y-6">
                        <div className="w-20 h-20 border-8 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                        <p className="text-xl font-bold animate-pulse text-indigo-400">
                            Architecting your custom curriculum...
                        </p>
                    </div>
                )}

                {courses.map((course) => (
                    <section
                        key={course.id}
                        className="bg-slate-900/40 border border-white/5 rounded-[48px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-12 duration-700"
                    >
                        <div className="p-10 border-b border-white/5 bg-indigo-500/5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black tracking-tight">
                                        {course.subject}
                                    </h2>
                                    <p className="text-slate-400 font-medium">
                                        Curated Academy • {course.steps.length} Learning Modules
                                    </p>
                                </div>
                                <div className="p-6 rounded-[32px] bg-white/5 border border-white/5">
                                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                                </div>
                            </div>
                        </div>

                        <div className="p-10 space-y-10">
                            {course.steps.map((step, idx) => (
                                <div key={step.id} className="relative pl-12 group">
                                    {/* Connector line */}
                                    {idx < course.steps.length - 1 && (
                                        <div className="absolute left-[15px] top-10 bottom-[-40px] w-0.5 bg-linear-to-b from-indigo-500 to-transparent opacity-20 group-hover:opacity-100 transition-opacity" />
                                    )}

                                    {/* Step indicator */}
                                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-black text-xs z-10 shadow-lg shadow-indigo-500/30">
                                        {idx + 1}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-bold group-hover:text-indigo-400 transition-colors">
                                                {step.title}
                                            </h3>
                                            <p className="text-slate-400 leading-relaxed max-w-2xl">
                                                {step.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            {step.noteIds.map((nid) => {
                                                const note = notes.find((n) => n.id === nid);
                                                if (!note) return null;
                                                return (
                                                    <div
                                                        key={nid}
                                                        onClick={() => router.push(`/dashboard?noteId=${nid}`)}
                                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                                                    >
                                                        <BookOpen className="w-3 h-3" />
                                                        {note.name}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-10 bg-black/20 flex justify-center">
                            <button
                                onClick={() => router.push("/dashboard/study")}
                                className="px-12 py-5 bg-white text-black rounded-[24px] font-black text-lg hover:bg-slate-200 transition-all flex items-center gap-3"
                            >
                                Start Learning Journey
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
