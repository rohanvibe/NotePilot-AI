import { NextResponse } from "next/server";
import { generateContent } from "@/lib/sambanova";
import { extractJSON } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const { text, notesNames } = await request.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const systemPrompt = `You are a professional AI Exam Expert. Create a comprehensive, fluff-free revision guide for NotePilot.
        NO analogies, NO storytelling. Use concrete technical mechanics and professional language.
        Output a strict JSON object with this exact structure:
        {
          "summary": "Professional technical summary",
          "keyPoints": ["Critical mechanism/fact 1", "Critical mechanism/fact 2"],
          "formulas": ["Definition or Formula 1", "Definition or Formula 2"],
          "examQuestions": ["Clear, testable scenario question 1"],
          "studyPlan": ["Actionable step 1", "Actionable step 2"]
        }
        Ensure it is valid JSON. No markdown formatting.`;

        const aiResponse = await generateContent(systemPrompt, text);
        const revision = extractJSON(aiResponse);

        return NextResponse.json({ success: true, revision });
    } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Internal error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
