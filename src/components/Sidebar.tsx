"use client";

import Link from "next/link";
import { FolderHeart, LayoutDashboard, Layers, MessageSquare, Settings, Share2, Brain, Search, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside className={cn("flex flex-col py-8 px-5 shrink-0 bg-black/40 border-r border-white/5 backdrop-blur-xl w-64", className)}>
            <div className="flex items-center gap-4 px-2 mb-10">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 text-white font-bold text-xl">
                    N
                </div>
                <div>
                    <span className="text-lg font-black tracking-tight text-white block leading-none">NotePilot</span>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest pl-0.5">AI v2.0</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-3">Main Menu</p>
                <NavItem href="/" icon={<FolderHeart className="w-4 h-4" />} label="Upload" active={pathname === "/"} />
                <NavItem href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active={pathname === "/dashboard"} />
                <NavItem href="/dashboard/graph" icon={<Share2 className="w-4 h-4" />} label="Knowledge Graph" active={pathname === "/dashboard/graph"} />

                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-6 px-3">Learn</p>
                <NavItem href="/flashcards" icon={<Layers className="w-4 h-4" />} label="Flashcards" active={pathname === "/flashcards"} />
                <NavItem href="/dashboard/study" icon={<Brain className="w-4 h-4" />} label="Study Mode" active={pathname === "/dashboard/study"} />
                <NavItem href="/dashboard/course" icon={<GraduationCap className="w-4 h-4" />} label="Course Builder" active={pathname === "/dashboard/course"} />

                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-6 px-3">Intelligence</p>
                <NavItem href="/chat" icon={<MessageSquare className="w-4 h-4" />} label="Chat AI" active={pathname === "/chat"} />
                <NavItem href="/dashboard/search" icon={<Search className="w-4 h-4" />} label="Semantic Search" active={pathname === "/dashboard/search"} />
            </nav>

            <div className="mt-auto border-t border-white/5 pt-6">
                <NavItem href="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" active={pathname === "/settings"} />
            </div>
        </aside>
    );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm group",
                active
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            )}
        >
            <div className={cn(
                "transition-colors",
                active ? "text-indigo-400" : "text-slate-500 group-hover:text-white"
            )}>
                {icon}
            </div>
            {label}
        </Link>
    );
}
