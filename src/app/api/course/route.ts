import { NextResponse } from "next/server";
import { generateContent } from "@/lib/sambanova";
import { Note } from "@/store/useStore";
import { extractJSON } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { notes } = (await request.json()) as { notes: Note[] };

    if (!notes || notes.length === 0) {
      return NextResponse.json({ error: "No notes provided" }, { status: 400 });
    }

    const noteInfo = notes.map((n: Note) => ({
      id: n.id,
      name: n.name,
      topic: n.topic,
      summary: n.summary,
    }));

    const systemPrompt = `You are a Curriculum Architect. Organize the following notes into a structured learning course.
        Identify the main subject and create a logical sequence of modules/steps.
        
        Return a strict JSON object:
        {
          "subject": "The overall subject name",
          "steps": [
            {
              "id": "step-1",
              "title": "Module Title",
              "description": "What the user will learn",
              "noteIds": ["id1", "id2"] // IDs of relevant notes for this step
            }
          ]
        }
        Ensure it is valid JSON. No markdown formatting.`;

    const aiResponse = await generateContent(systemPrompt, JSON.stringify(noteInfo));
    const course = extractJSON(aiResponse);

    return NextResponse.json({ success: true, course });
  } catch (err) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
