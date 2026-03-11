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

        const systemPrompt = `You are an AI Exam Expert. Create a comprehensive revision guide for the files: ${notesNames?.join(
            ", "
        )}.
        Output a strict JSON object with these sections:
        {
          "summary": "A high-level executive summary of the entire subject",
          "keyPoints": ["important point 1", "important point 2", ...],
          "formulas": ["formula 1: description", "formula 2", ...],
          "examQuestions": ["Likely exam question 1?", "Likely exam question 2?", "Likely exam question 3?"],
          "studyPlan": ["Step 1: focus on X", "Step 2: review Y", ...]
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
