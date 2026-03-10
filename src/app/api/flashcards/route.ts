import { NextResponse } from "next/server";
import { generateContent } from "@/lib/sambanova";

export async function POST(request: Request) {
    try {
        const { text, notesNames } = await request.json();

        const systemPrompt = `You are a helpful study assistant. Generate exactly 5 flashcards from the provided notes content.
Output them strictly as a JSON array of objects with 'front' and 'back' properties. Do not use markdown backticks, just raw JSON:
[
  { "front": "Question 1?", "back": "Answer 1" },
  { "front": "Question 2?", "back": "Answer 2" }
]`;

        const instructions = `Generate flashcards from notes named: ${notesNames.join(", ")}\n\nContent:\n${text}`;

        const aiResponse = await generateContent(systemPrompt, instructions);

        const cleanedResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        const flashcards = JSON.parse(cleanedResponse);

        return NextResponse.json({ success: true, flashcards });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
