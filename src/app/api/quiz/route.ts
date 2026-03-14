import { NextResponse } from "next/server";
import { generateContent } from "@/lib/sambanova";
import { extractJSON } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const { text, type = "mixed", count = 5 } = await request.json();

        if (!text) {
            return NextResponse.json(
                { error: "No text provided for quiz generation" },
                { status: 400 }
            );
        }

        const systemPrompt = `You are an AI Study Assistant. Generate a educational multiple-choice quiz based on the provided text.
        Return a strict JSON array of exactly ${count} question objects.
        
        Each object MUST have this exact structure:
        {
          "question": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct": 0, // The 0-based index of the correct option in the options array
          "explanation": "A brief explanation of why this is the answer"
        }
        
        Ensure it is valid JSON. No markdown formatting. Only output the JSON array.`;

        const aiResponse = await generateContent(systemPrompt, text);
        const quiz = extractJSON(aiResponse);

        return NextResponse.json({ success: true, quiz });
    } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Internal error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
