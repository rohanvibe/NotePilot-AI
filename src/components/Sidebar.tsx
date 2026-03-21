"use client";

import Link from "next/link";
import { FolderHeart, LayoutDashboard, Layers, MessageSquare, Settings, Share2, Brain, Search, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { usePathname } from "next/navigation";

export default function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { level, xp, streak } = useStore();
    const progress = (xp % 1000) / 10;

    return (
        <aside 
            className={cn("flex flex-col py-8 px-5 shrink-0 bg-black/40 border-r border-white/5 backdrop-blur-xl w-64", className)}
            aria-label="Sidebar Navigation"
        >
            <div className="flex items-center gap-4 px-2 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)] text-white font-black text-2xl relative overflow-hidden group/logo">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/logo:translate-y-0 transition-transform duration-500" />
                    <span className="relative">N</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tight text-white leading-none">NotePilot</span>
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em] mt-1 pl-0.5 opacity-90">AI Engine v2.0</span>
                </div>
            </div>

            {/* Level & XP Card */}
            <div className="mx-2 mb-8 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="px-2 py-1 rounded-md bg-indigo-500 text-[10px] font-black text-white">LVL {level}</div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{xp % 1000} / 1000 XP</span>
                    </div>
                    {streak > 0 && (
                        <div className="flex items-center gap-1 text-orange-400 font-black text-xs animate-bounce-slow">
                            🔥 {streak}
                        </div>
                    )}
                </div>
                <div className="h-1.5 w-full bg-indigo-500/10 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-indigo-500 transition-all duration-1000" 
                        style={{ width: `${progress}%` }} 
                    />
                </div>
            </div>

            <nav className="flex-1 space-y-1.5" aria-label="Main navigation items">
                <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest mb-2 px-3 opacity-90">Main Menu</p>
                <NavItem href="/" icon={<FolderHeart className="w-4 h-4" aria-hidden="true" />} label="Upload" active={pathname === "/"} />
                <NavItem href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" aria-hidden="true" />} label="Dashboard" active={pathname === "/dashboard"} />
                <NavItem href="/dashboard/graph" icon={<Share2 className="w-4 h-4" aria-hidden="true" />} label="Idea Map" active={pathname === "/dashboard/graph"} />

                <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest mb-2 mt-6 px-3 opacity-90">Learn</p>
                <NavItem href="/flashcards" icon={<Layers className="w-4 h-4" aria-hidden="true" />} label="Flashcards" active={pathname === "/flashcards"} />
                <NavItem href="/dashboard/study" icon={<Brain className="w-4 h-4" aria-hidden="true" />} label="Quiz Mode" active={pathname === "/dashboard/study"} />
                <NavItem href="/dashboard/course" icon={<GraduationCap className="w-4 h-4" aria-hidden="true" />} label="Study Path" active={pathname === "/dashboard/course"} />

                <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest mb-2 mt-6 px-3 opacity-90">Intelligence</p>
                <NavItem href="/chat" icon={<MessageSquare className="w-4 h-4" aria-hidden="true" />} label="Study Chat" active={pathname === "/chat"} />
                <NavItem href="/dashboard/search" icon={<Search className="w-4 h-4" aria-hidden="true" />} label="Smart Search" active={pathname === "/dashboard/search"} />
            </nav>

            <div className="mt-auto border-t border-white/5 pt-6">
                <NavItem href="/settings" icon={<Settings className="w-4 h-4" aria-hidden="true" />} label="Settings" active={pathname === "/settings"} />
            </div>
        </aside>
    );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                active
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
            )}
        >
            <div className={cn(
                "transition-colors",
                active ? "text-indigo-300" : "text-slate-400 group-hover:text-white"
            )}>
                {icon}
            </div>
            {label}
        </Link>
    );
}

