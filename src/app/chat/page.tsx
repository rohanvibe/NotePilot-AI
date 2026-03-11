"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import {
    MessageSquare,
    Send,
    Bot,
    User,
    Sparkles,
    FileText,
    ExternalLink,
    RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
    role: "user" | "ai";
    content: string;
    sources?: string[];
}

export default function Chat() {
    const { notes } = useStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !notes.length) return;

        const userMessage: Message = { role: "user", content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const allContext = notes
                .map((n) => `--- NOTE: ${n.name} ---\n${n.content}`)
                .join("\n\n")
                .slice(0, 40000);
            const history = messages
                .slice(-5)
                .map((m) => ({ role: m.role, content: m.content }));

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    context: allContext,
                    message: userMessage.content,
                    history,
                    notes: notes.map((n) => ({ id: n.id, name: n.name })),
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Chat error (${res.status}): ${text.slice(0, 50)}...`);
            }

            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    content: data.reply,
                    sources: data.sources,
                },
            ]);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "Sorry, I encountered an error: " + errorMessage },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    if (notes.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
                <div className="p-12 rounded-[48px] bg-slate-900/40 border border-white/5 text-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mx-auto">
                        <MessageSquare className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black">Memory Empty</h2>
                    <p className="text-slate-500 max-w-xs mx-auto">
                        Upload notes first to start chatting with your second brain.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-4 px-8 py-3 bg-white text-black rounded-2xl font-black text-sm hover:scale-105 transition-all"
                    >
                        Upload Files
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full min-w-0 max-w-5xl mx-auto w-full">
            {/* Header */}
            <header className="p-6 md:p-10 flex items-center justify-between border-b border-white/5 bg-black/20 z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                            Brain Chat
                            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                        </h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {notes.length} Knowledge Sources
                        </p>
                    </div>
                </div>
            </header>

            {/* Chat Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-12 scroll-smooth">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-20">
                        <div className="w-32 h-32 rounded-[40px] bg-indigo-600/5 border border-indigo-500/10 flex items-center justify-center mb-4">
                            <Bot className="w-16 h-16 text-indigo-500 opacity-50" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black">AI Tutor Engaged</h2>
                            <p className="text-slate-500 max-w-sm">
                                Ask complex questions about your synthesized knowledge.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 max-w-md">
                            <QuickQuestion q="What are the key concepts?" setInput={setInput} />
                            <QuickQuestion
                                q="Summarize the mechanics notes"
                                setInput={setInput}
                            />
                            <QuickQuestion q="How does X relate to Y?" setInput={setInput} />
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex gap-6 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                            } animate-in fade-in slide-in-from-bottom-4 duration-500`}
                    >
                        <div
                            className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${msg.role === "ai"
                                ? "bg-indigo-600 shadow-indigo-500/20"
                                : "bg-white/5 border border-white/10"
                                }`}
                        >
                            {msg.role === "ai" ? (
                                <Bot className="w-6 h-6" />
                            ) : (
                                <User className="w-6 h-6" />
                            )}
                        </div>

                        <div className={`max-w-[85%] md:max-w-[70%] space-y-4`}>
                            <div
                                className={`p-6 md:p-8 rounded-[32px] text-lg leading-relaxed ${msg.role === "user"
                                    ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-100 rounded-tr-none"
                                    : "bg-slate-900/60 border border-white/5 text-slate-200 rounded-tl-none"
                                    }`}
                            >
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>

                            {msg.sources && msg.sources.length > 0 && (
                                <div className="flex flex-wrap gap-2 px-2">
                                    {msg.sources.map((sid) => {
                                        const note = notes.find((n) => n.id === sid);
                                        return (
                                            <div
                                                key={sid}
                                                onClick={() => router.push(`/dashboard?noteId=${sid}`)}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                                            >
                                                <FileText className="w-3 h-3" />
                                                {note?.name || "Referenced Source"}
                                                <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-6 animate-in fade-in duration-300">
                        <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white animate-pulse">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div className="bg-slate-900/60 border border-white/5 rounded-[32px] rounded-tl-none p-6 flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150" />
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-300" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <footer className="p-6 md:p-10 bg-black/40 backdrop-blur-xl border-t border-white/5 relative z-10 w-full">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <MessageSquare className="w-6 h-6 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask your second brain..."
                        className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-[32px] pl-16 pr-32 py-6 text-xl text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-3 top-3 bottom-3 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-black tracking-tighter transition-all disabled:opacity-50 flex items-center gap-2 shadow-2xl shadow-indigo-500/20"
                    >
                        {isTyping ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                        Send
                    </button>
                </form>
            </footer>
        </div>
    );
}

function QuickQuestion({ q, setInput }: { q: string; setInput: (v: string) => void }) {
    return (
        <button
            onClick={() => setInput(q)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold text-slate-400 hover:text-white transition-all"
        >
            {q}
        </button>
    );
}
