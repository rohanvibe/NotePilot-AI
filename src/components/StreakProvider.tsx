"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function StreakProvider() {
    const { updateStreak } = useStore();

    useEffect(() => {
        updateStreak();
    }, [updateStreak]);

    return null;
}
