import { NextResponse } from "next/server";
import { generateContent } from "@/lib/sambanova";

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const { text } = (await request.json()) as { text: string };

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const systemPrompt = `You are an AI Tutor. Rewrite the following notes for absolute clarity, stripping away complex jargon while maintaining professional depth.
        STRICT RULES:
        1. NO analogies (no "magic strings", "invisible dancers", etc.).
        2. Use concrete, direct, and objective language.
        3. No fluff words like "Imagine", "It's like", or "Behold".
        
        STRUCTURE:
        ### Essential Concept
        [A direct, one-paragraph explanation of what this is]
        
        ### Key Breakdown
        [Numbered list of the critical technical steps or facts]
        
        ### Practical Application
        [How this is used in the real world or industry]
        
        Return markdown.`;

        const explanation = await generateContent(systemPrompt, text);

        return NextResponse.json({ success: true, explanation });
    } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Internal error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
