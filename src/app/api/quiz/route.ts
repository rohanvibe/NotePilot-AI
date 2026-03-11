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

        const systemPrompt = `You are an AI Study Assistant. Generate a educational quiz based on the provided text.
        Return a strict JSON array of question objects. Each object must have:
        - "type": "multiple_choice" or "short_answer"
        - "question": "The question text"
        - "options": ["option A", "option B", "option C", "option D"] (only for multiple_choice)
        - "answer": "The correct answer"
        - "explanation": "A brief explanation of why this is the answer"
        
        Generate exactly ${count} questions of type ${type}.
        Ensure it is valid JSON. No markdown formatting.`;

        const aiResponse = await generateContent(systemPrompt, text);
        const quiz = extractJSON(aiResponse);

        return NextResponse.json({ success: true, quiz });
    } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Internal error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
