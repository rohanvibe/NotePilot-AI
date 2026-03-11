import { NextResponse } from "next/server";
import { generateContent } from "@/lib/sambanova";

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const { notes } = await request.json();

        if (!notes || notes.length === 0) {
            return NextResponse.json({ error: "No notes provided" }, { status: 400 });
        }

        const noteInfo = notes.map((n: any) => ({
            id: n.id,
            name: n.name,
            topic: n.topic,
            summary: n.summary
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
        const cleanedResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        const course = JSON.parse(cleanedResponse);

        return NextResponse.json({ success: true, course });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
