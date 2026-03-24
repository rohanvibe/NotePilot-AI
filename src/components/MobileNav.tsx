"use client";

import { Menu } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function MobileNav() {
    const { setSidebarOpen } = useStore();

    return (
        <div className="md:hidden">
            <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                aria-label="Open navigation menu"
            >
                <Menu className="w-6 h-6" />
            </button>
        </div>
    );
}
