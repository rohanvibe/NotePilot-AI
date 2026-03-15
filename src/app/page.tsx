"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  X,
  Share2,
} from "lucide-react";
import { useStore } from "@/store/useStore";

interface OrganizingResult {
  id: string;
  name: string;
  content: string;
  topic: string;
  summary: string;
  keyPoints: string[];
  importantTerms: string[];
  createdAt: number;
}

interface SummaryResult {
  impact: string;
  topInsight: string;
}

interface RawFlashcard {
  front: string;
  back: string;
}

// Fixed any types and moved outside to decouple from component lifecycle
/* eslint-disable @typescript-eslint/no-explicit-any */
const traverseFileTree = async (item: any): Promise<File[]> => {
  return new Promise((resolve) => {
    if (item.isFile) {
      item.file((file: File) => {
        resolve([file]);
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      dirReader.readEntries(async (entries: any[]) => {
        const files = await Promise.all(
          entries.map((entry) => traverseFileTree(entry))
        );
        resolve(files.flat());
      });
    } else {
      resolve([]);
    }
  });
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function Landing() {
  const { addNotes, addFlashcards, notes } = useStore();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPermission, setShowPermission] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [summary, setSummary] = useState<SummaryResult | null>(null);

  const processFiles = useCallback(
    async (files: File[]) => {
      setIsUploading(true);
      setError(null);
      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("file", file);
        });

        const res = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const text = await res.text();
          let msg = "Failed to process files";
          try {
            const errData = JSON.parse(text);
            msg = errData.error || msg;
          } catch {
            msg = `Server Error: ${res.status}`;
          }
          throw new Error(msg);
        }

        const data = await res.json();
        if (!data.notes) throw new Error("AI analysis did not return any usable notes.");

        const newNotes = data.notes.map((r: OrganizingResult) => ({
          id: r.id || crypto.randomUUID(),
          name: r.name,
          content: r.content,
          topic: r.topic,
          summary: r.summary,
          keyPoints: r.keyPoints,
          importantTerms: r.importantTerms,
          createdAt: r.createdAt || Date.now(),
        }));

        addNotes(newNotes);

        const fRes = await fetch("/api/flashcards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: newNotes.map((n: OrganizingResult) => n.content).join("\n\n"),
            notesNames: newNotes.map((n: OrganizingResult) => n.name),
          }),
        });

        if (fRes.ok) {
          const fData = await fRes.json();
          addFlashcards(
            fData.flashcards.map((f: RawFlashcard) => ({
              ...f,
              id: crypto.randomUUID(),
              nextReviewDate: Date.now(),
              difficulty: "new",
              interval: 0,
              ease: 2.5,
              reviewCount: 0,
              noteId: newNotes[0]?.id,
            }))
          );
        }

        setSummary({
          impact: `Transformed ${newNotes.length} messy inputs into structured knowledge.`,
          topInsight:
            newNotes[0]?.summary || "Your notes are now searchable and organized.",
        });
      } catch (err: unknown) {
        console.error("Processing error:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred during processing.");
        }
      } finally {
        setIsUploading(false);
      }
    },
    [addNotes, addFlashcards]
  );

  const loadDemo = () => {
    const demoNotes: OrganizingResult[] = [
      {
        id: crypto.randomUUID(),
        name: "Quantum Physics.txt",
        content: "Quantum entanglement is a phenomenon where particles...",
        topic: "Physics",
        summary: "Exploration of quantum phenomena and entanglement.",
        keyPoints: ["Entanglement", "Superposition", "Wave function"],
        importantTerms: ["Qubit", "Entanglement"],
        createdAt: Date.now(),
      },
      {
        id: crypto.randomUUID(),
        name: "Organic Chemistry.md",
        content: "Alkanes are saturated hydrocarbons...",
        topic: "Chemistry",
        summary: "Fundamentals of organic molecular structures.",
        keyPoints: ["Hydrocarbons", "Single bonds", "Saturated"],
        importantTerms: ["Alkanes", "Methane"],
        createdAt: Date.now(),
      }
    ];
    addNotes(demoNotes.map(n => ({
      ...n,
      id: crypto.randomUUID(), 
    }))); 
    
    setSummary({
      impact: "Simulated 2 messy documents into structured research topics.",
      topInsight: "Your second brain is ready to explore."
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const items = e.dataTransfer.items;
    if (!items) return;

    const promises = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item) {
        promises.push(traverseFileTree(item));
      }
    }

    const filesArray = await Promise.all(promises);
    const flattenedFiles = filesArray.flat();

    const validFiles = flattenedFiles.filter((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase();
      return ["txt", "md", "pdf", "docx", "csv"].includes(ext || "");
    });

    if (validFiles.length > 0) {
      setPendingFiles(validFiles);
      setShowPermission(true);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setPendingFiles(files);
      setShowPermission(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 space-y-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      
      {!summary ? (
        <div className="w-full max-w-4xl space-y-12 text-center relative z-10">
          <div className="space-y-4 animate-in fade-in slide-in-from-top-10 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300 uppercase tracking-[0.2em] shadow-inner">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              Intelligence Engine v2.0
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-[0.9]">
              Chaos into <br />
              <span className="bg-linear-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Clarity.
              </span>
            </h1>
            <p className="text-slate-300 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
              Drop your messy folders. Let AI build your second brain, 
              generate knowledge maps, and create study sets in seconds.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <button 
              onClick={() => document.querySelector('input')?.click()}
              className="group relative px-10 py-6 bg-white text-black rounded-3xl font-black text-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden focus-visible:ring-4 focus-visible:ring-indigo-500/50 outline-none"
              aria-label="Upload your files to start"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-3">
                Upload My Brain
                <UploadCloud className="w-6 h-6" aria-hidden="true" />
              </span>
            </button>
            <button 
              onClick={loadDemo}
              className="px-10 py-6 bg-white/5 border border-white/10 text-slate-200 rounded-3xl font-black text-xl hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 flex items-center gap-3 backdrop-blur-md focus-visible:ring-4 focus-visible:ring-white/30 outline-none"
              aria-label="Explore the demo experience"
            >
              Explore Demo
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <div
            onDragOver={handleDragOver}
            onDrop={onDrop}
            className="relative group h-96 rounded-[64px] border-2 border-dashed border-white/10 hover:border-indigo-500/50 bg-white/2 hover:bg-indigo-500/3 transition-all flex flex-col items-center justify-center space-y-6 cursor-pointer overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-1000 delay-500"
          >
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Pulsing Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 rounded-full border border-indigo-500/5 animate-ping duration-3000" />
            </div>

            <div className="p-10 rounded-[40px] bg-indigo-500/10 text-indigo-300 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] transition-all duration-700">
              {isUploading ? (
                <Loader2 className="w-16 h-16 animate-spin" aria-hidden="true" />
              ) : (
                <UploadCloud className="w-16 h-16" aria-hidden="true" />
              )}
            </div>
            
            <div className="space-y-2 relative z-10 text-center">
              <p className="text-3xl font-black tracking-tight text-white">
                {isUploading ? "Synthesizing Knowledge..." : "Drop files or folders here"}
              </p>
              <p className="text-slate-400 font-bold text-sm tracking-[0.2em] uppercase opacity-80">
                AI supports PDF, MD, TXT, DOCX
              </p>
            </div>

            <input
              type="file"
              multiple
              // @ts-expect-error webkitdirectory is non-standard but supported
              webkitdirectory=""
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileInput}
              aria-label="Upload folders or files"
            />
          </div>

          {error && (
            <div className="flex flex-col gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-bold text-sm max-h-60 overflow-y-auto text-left">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Error Details</span>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-xs opacity-80 pl-8">
                {error}
              </pre>
            </div>
          )}

          {notes.length > 0 && (
            <button
              onClick={() => router.push("/dashboard")}
              className="px-10 py-5 bg-white text-black rounded-3xl font-black text-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto shadow-2xl"
            >
              Go to Dashboard
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>
      ) : (
        <div className="w-full max-w-3xl space-y-10 animate-in zoom-in duration-700">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 rounded-[32px] bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-5xl font-black">Knowledge Synthesized</h2>
            <p className="text-slate-400 text-lg font-medium">
              Behold the impact of AI organization on your messy notes.
            </p>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-[48px] p-10 space-y-10 shadow-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Structure
                  Evolution
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                    <span className="text-slate-400 italic">Messy Chaos</span>
                    <span className="text-indigo-300">Structured Topics</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                    <div className="h-full bg-indigo-500 w-[70%]" />
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {summary.impact}
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" /> AI Insights
                </h3>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-slate-300 text-sm italic leading-relaxed">
                    &quot;{summary.topInsight}&quot;
                  </p>
                </div>
              </section>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 py-6 bg-white text-black rounded-[28px] text-2xl font-black transition-all hover:scale-105 flex items-center justify-center gap-4 shadow-3xl shadow-white/5"
            >
              Enter Second Brain
              <ArrowRight className="w-8 h-8" aria-hidden="true" />
            </button>
            <button
              onClick={() => {
                const text = `I just organized my messy notes with NotePilot AI! Check it out: ${window.location.host}`;
                if (navigator.share) {
                  navigator.share({ title: 'NotePilot AI', text, url: window.location.href });
                } else {
                  alert('Ready to share!');
                }
              }}
              className="px-10 py-6 bg-indigo-600 text-white rounded-[28px] text-xl font-black transition-all hover:bg-indigo-500 flex items-center justify-center gap-4 shadow-3xl shadow-indigo-500/20 active:scale-95 focus-visible:ring-4 focus-visible:ring-indigo-400 outline-none"
              aria-label="Share your organized knowledge"
            >
              Share with Friends
              <Share2 className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      {showPermission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0a0a0b] border border-white/10 w-full max-w-lg rounded-[48px] p-10 space-y-8 animate-in zoom-in duration-300 relative">
            <button
              onClick={() => setShowPermission(false)}
              className="absolute top-8 right-8 text-slate-500 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white leading-tight">
                AI Folder Intelligence
              </h2>
              <p className="text-slate-500 font-medium">
                NotePilot wants to rename and categorize your {pendingFiles.length}{" "}
                files to create a logical knowledge structure.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowPermission(false);
                  processFiles(pendingFiles);
                }}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-white transition-all"
              >
                Grant AI Permissions
              </button>
              <button
                onClick={() => {
                  setShowPermission(false);
                  setPendingFiles([]);
                }}
                className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-slate-400 transition-all"
              >
                Cancel Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
