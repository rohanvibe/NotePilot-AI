import { NextResponse } from "next/server";
import { generateContent } from "@/lib/sambanova";

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const { notes } = await request.json();

        if (!notes || notes.length < 2) {
            return NextResponse.json({ relationships: [] });
        }

        const noteSummaries = notes.map((n: any) => ({
            id: n.id,
            name: n.name,
            topic: n.topic,
            summary: n.summary?.slice(0, 300)
        }));

        const systemPrompt = `You are a Knowledge Architect. Identify semantic relationships between the following notes.
        Relationship types: 'related' (concepts shared), 'parent' (one note explains the foundation for another), 'prerequisite' (should read X before Y).
        
        Return a strict JSON array of objects:
        [
          {"source": "id1", "target": "id2", "type": "string", "reason": "short explanation"}
        ]
        Only return strong, non-obvious relationships. Max 10 relationships total.
        Ensure it is valid JSON. No markdown formatting.`;

        const aiResponse = await generateContent(systemPrompt, JSON.stringify(noteSummaries));
        const cleanedResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        const relationships = JSON.parse(cleanedResponse);

        return NextResponse.json({ success: true, relationships });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
