import { NextResponse } from "next/server";
import { generateContent } from "@/lib/sambanova";
import { extractJSON } from "@/lib/utils";

export async function POST(request: Request) {
    try {
        const { text, notesNames } = (await request.json()) as {
            text: string;
            notesNames: string[];
        };

        const systemPrompt = `You are a professional pedagogical AI. Generate exactly 8 flashcards from the provided notes content. 
STRICT RULES:
1. Question: Short, clear, and highly testable.
2. Answer: Concise, no fluff, no long paragraphs.
3. Content: Exact facts only. One concept per card.
4. Formatting: Output as a strict JSON array of objects with 'front' and 'back' properties. No markdown.

Example:
[
  { "front": "What is the primary function of Mitochondria?", "back": "Production of ATP (energy) via cellular respiration." }
]`;

        const instructions = `Generate flashcards from notes named: ${notesNames.join(
            ", "
        )}\n\nContent:\n${text}`;

        const aiResponse = await generateContent(systemPrompt, instructions);

        let flashcards: unknown[];
        try {
            flashcards = extractJSON<unknown[]>(aiResponse);
        } catch {
            console.error("Failed to parse flashcards JSON:", aiResponse);
            throw new Error(
                "AI provided an invalid response instead of flashcards: " +
                aiResponse.slice(0, 100) +
                "..."
            );
        }

        if (!Array.isArray(flashcards)) {
            throw new Error("AI did not return an array of flashcards.");
        }

        return NextResponse.json({ success: true, flashcards });
    } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Internal error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
