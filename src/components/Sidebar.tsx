import Link from "next/link";
import { FolderHeart, LayoutDashboard, Layers, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar({ className }: { className?: string }) {
    return (
        <aside className={cn("flex flex-col py-6 px-4 shrink-0", className)}>
            <div className="flex items-center gap-3 px-2 mb-8">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
                    AI
                </div>
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">Notes App</span>
            </div>

            <nav className="flex-1 space-y-1">
                <NavItem href="/" icon={<FolderHeart className="w-4 h-4" />} label="Upload" />
                <NavItem href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
                <NavItem href="/flashcards" icon={<Layers className="w-4 h-4" />} label="Flashcards" />
                <NavItem href="/chat" icon={<MessageSquare className="w-4 h-4" />} label="Chat" />
            </nav>

            <div className="mt-auto">
                <NavItem href="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
            </div>
        </aside>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all font-medium text-sm group">
            <div className="text-zinc-500 group-hover:text-indigo-400 transition-colors">{icon}</div>
            {label}
        </Link>
    );
}
