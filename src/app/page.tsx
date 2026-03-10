"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FolderUp, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotes } = useStore();
  const router = useRouter();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = async (files: File[]) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
      });

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze files");

      addNotes(data.notes);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-8 z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Knowledge Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Upload & Connect <br /> Your Messy Notes
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            Drop your PDFs, Word docs, Markdown, or raw text files. We'll automatically organize and summarize them using AI.
          </p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-3xl p-12 transition-all duration-300 relative bg-zinc-900/50 backdrop-blur-xl group
            ${isDragging ? "border-indigo-500 bg-indigo-500/5" : "border-zinc-800 hover:border-zinc-700"}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
              <p className="text-zinc-300 font-medium animate-pulse">Analyzing & Extracting Notes...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="w-20 h-20 rounded-2xl bg-zinc-800/80 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <UploadCloud className="w-10 h-10 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-medium text-zinc-200">Drag & Drop your files</p>
                <p className="text-zinc-500 text-sm">Supports .txt, .md, .pdf, .docx</p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="relative cursor-pointer bg-white text-zinc-950 px-6 py-2.5 rounded-full font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" />
                  Select Files
                  <input type="file" multiple className="hidden" accept=".txt,.md,.pdf,.docx" onChange={handleFileInput} />
                </label>
                <label className="relative cursor-pointer bg-zinc-800 text-white px-6 py-2.5 rounded-full font-medium hover:bg-zinc-700 transition-colors flex items-center gap-2">
                  <FolderUp className="w-4 h-4" />
                  Select Folder
                  <input type="file" {...{ webkitdirectory: "true", directory: "true" }} className="hidden" onChange={handleFileInput} />
                </label>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 justify-center text-red-400 bg-red-500/10 py-3 px-4 rounded-xl border border-red-500/20">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
