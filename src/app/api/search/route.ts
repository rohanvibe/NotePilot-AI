import { NextResponse } from "next/server";
import { generateContent } from "@/lib/sambanova";
import { Note } from "@/store/useStore";

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const { query, notes } = (await request.json()) as { query: string; notes: Note[] };

        if (!query || !notes || notes.length === 0) {
            return NextResponse.json({ success: true, rankings: [] });
        }

        // We'll ask the AI to rank the notes by relevance to the query
        const noteSummaries = notes.map((n: Note) => ({
            id: n.id,
            name: n.name,
            topic: n.topic,
            summary: n.summary,
        }));

        const systemPrompt = `You are a Semantic Search Engine. Given a user query and a list of note summaries, identify which notes are most relevant to the concept mentioned in the query.
        The user might use natural language, e.g., "how do I solve physics problems" should match Newton's Laws or Mechanics.
        
        Return a strict JSON array of objects:
        [
          {"id": "note-id", "relevanceScore": 0.0 to 1.0, "reason": "Why this is relevant"}
        ]
        Only include notes with relevanceScore > 0.3. Sort by relevanceScore descending.`;

        const userMessage = `Query: "${query}"\n\nNotes:\n${JSON.stringify(noteSummaries)}`;

        const aiResponse = await generateContent(systemPrompt, userMessage);
        const cleanedResponse = aiResponse
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();
        const rankings = JSON.parse(cleanedResponse);

        return NextResponse.json({ success: true, rankings });
    } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Internal error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
