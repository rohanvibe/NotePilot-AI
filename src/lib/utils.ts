import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function extractJSON<T>(text: string): T {
    try {
        // Try direct parse first
        return JSON.parse(text.trim());
    } catch {
        // Find the first { or [ and last } or ]
        const firstBracket = text.indexOf('{');
        const firstSquareStack = text.indexOf('[');
        const start = (firstBracket !== -1 && (firstSquareStack === -1 || firstBracket < firstSquareStack)) ? firstBracket : firstSquareStack;

        if (start === -1) throw new Error("No JSON found in response");

        const lastBracket = text.lastIndexOf('}');
        const lastSquareStack = text.lastIndexOf(']');
        const end = Math.max(lastBracket, lastSquareStack);

        if (end === -1 || end < start) throw new Error("Invalid JSON bounds");

        const jsonStr = text.substring(start, end + 1);
        return JSON.parse(jsonStr) as T;
    }
}
