"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                aria-label="Open navigation menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/95 z-100 animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={`fixed inset-y-0 left-0 w-80 bg-zinc-950 z-101 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-r border-white/10 transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex flex-col h-full relative">
                    <button
                        onClick={() => setIsOpen(false)}
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
