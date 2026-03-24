"use client";

import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MobileSidebar() {
    const { isSidebarOpen, setSidebarOpen } = useStore();
    const pathname = usePathname();

    // Auto-close on navigation
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname, setSidebarOpen]);

    return (
        <div className="md:hidden">
            {/* Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/95 z-[999] animate-in fade-in duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Drawer */}
            <div 
                className={`fixed inset-y-0 left-0 w-80 bg-zinc-950 z-[1000] shadow-[0_0_50px_rgba(0,0,0,0.8)] border-r border-white/10 transform transition-transform duration-300 ease-out ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full relative">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-all z-110"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    <Sidebar className="w-full flex-1 border-r-0 bg-transparent! backdrop-blur-none! shadow-none" />
                </div>
            </div>
        </div>
    );
}
