import { NextResponse } from "next/server";
import { generateContent } from "@/lib/sambanova";

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const systemPrompt = `You are an AI Tutor. Rewrite the following notes in extremely simple, beginner-friendly language.
        Use analogies, simple words, and clear explanations. 
        Structure it with:
        ### The Big Idea
        [Simple explanation]
        
        ### Breaking it Down
        [1-2-3 list of steps or concepts]
        
        ### Why it Matters
        [Why this is important in the real world]
        
        Return markdown.`;

        const explanation = await generateContent(systemPrompt, text);

        return NextResponse.json({ success: true, explanation });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
