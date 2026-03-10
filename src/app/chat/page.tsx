"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { MessageSquare, Send, Bot, User, Loader2 } from "lucide-react";

export default function Chat() {
    const { notes } = useStore();
    const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !notes.length) return;

        const userMessage = { role: "user" as const, content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const allContext = notes.map((n) => n.content).join("\n\n").slice(0, 50000); // Send up to 50k chars
            const history = messages.slice(-10); // Last 10 messages

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    context: allContext,
                    message: userMessage.content,
                    history,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Chat failed");

            setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
        } catch (err: any) {
            setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I encountered an error: " + err.message }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (notes.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                <MessageSquare className="w-16 h-16 text-zinc-700" />
                <h2 className="text-2xl font-semibold text-zinc-300">No notes to discuss</h2>
                <p className="text-zinc-500">Upload notes first to start chatting with them.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-full p-4 md:p-8">
            <div className="flex items-center gap-3 pb-6 border-b border-zinc-800">
                <div className="p-3 bg-indigo-500/10 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
                        Chat with Your Notes
                    </h1>
                    <p className="text-sm text-zinc-500">Ask any question based on the {notes.length} uploaded files</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 py-6 scrollbar-thin scrollbar-thumb-zinc-800">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
                        <Bot className="w-12 h-12 opacity-50" />
                        <p className="text-lg">What would you like to know about your notes?</p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "ai" && (
                            <div className="flex-none p-2 bg-indigo-600 rounded-full h-10 w-10 flex items-center justify-center text-white">
                                <Bot className="w-5 h-5" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-indigo-600 text-white rounded-br-none"
                                    : "bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 rounded-bl-none"
                                }`}
                        >
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                        {msg.role === "user" && (
                            <div className="flex-none p-2 bg-zinc-800 rounded-full h-10 w-10 flex items-center justify-center text-zinc-400">
                                <User className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-4 justify-start">
                        <div className="flex-none p-2 bg-indigo-600 rounded-full h-10 w-10 flex items-center justify-center text-white">
                            <Bot className="w-5 h-5 animate-pulse" />
                        </div>
                        <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-150"></span>
                            <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-300"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="pt-4 border-t border-zinc-800">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your notes..."
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-full pl-6 pr-14 py-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-3 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
