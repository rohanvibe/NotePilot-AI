import { NextResponse } from "next/server";
import { generateContent } from "@/lib/sambanova";

export async function POST(request: Request) {
    try {
        const { text, notesNames } = (await request.json()) as {
            text: string;
            notesNames: string[];
        };

        const systemPrompt = `You are a strict flashcard generator AI. Generate exactly 5 flashcards from the provided notes content. 
Output them strictly as a JSON array of objects with 'front' and 'back' properties. Do not include ANY extra conversation, explanation, or markdown formatting around the output. Only output valid JSON resembling this exact array:
[
  { "front": "Question 1?", "back": "Answer 1" },
  { "front": "Question 2?", "back": "Answer 2" }
]`;

        const instructions = `Generate flashcards from notes named: ${notesNames.join(
            ", "
        )}\n\nContent:\n${text}`;

        const aiResponse = await generateContent(systemPrompt, instructions);

        const cleanedResponse = aiResponse
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        let flashcards;
        try {
            flashcards = JSON.parse(cleanedResponse);
        } catch {
            console.error("Failed to parse flashcards JSON:", cleanedResponse);
            throw new Error(
                "AI provided an invalid response instead of flashcards: " +
                cleanedResponse.slice(0, 100) +
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
