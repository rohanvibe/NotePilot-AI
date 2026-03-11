import { NextResponse } from "next/server";
import { generateContent } from "@/lib/sambanova";

export const maxDuration = 60;

interface ChatRequest {
    context: string;
    message: string;
    history: { role: string; content: string }[];
    notes: { id: string; name: string }[];
}

export async function POST(request: Request) {
    try {
        const { context, message, history, notes } = (await request.json()) as ChatRequest;

        const systemPrompt = `You are a Retrieval-Augmented Generation (RAG) agent for the NotePilot AI application. 
        Your goal is to answer questions strictly based on the provided notes context.
        
        Available Notes: ${JSON.stringify(notes.map((n) => ({ id: n.id, name: n.name })))}
        
        Rules:
        1. Cite the note name when referring to information.
        2. If the user asks for a specific note, mention its name.
        3. At the end of your response, add a strict JSON block with the IDs of the notes you referenced.
        
        Response Format:
        [Your detailed answer with citations like (Note Name)]
        
        SOURCES_USED: ["note-id-1", "note-id-2"]`;

        const userMessage = `Context: ${context}\n\nHistory: ${JSON.stringify(
            history
        )}\n\nQuestion: ${message}`;

        const aiResponse = await generateContent(systemPrompt, userMessage);

        // Extract sources
        const sourcesMatch = aiResponse.match(/SOURCES_USED:\s*(\[.*?\])/);
        let sources = [];
        let cleanReply = aiResponse;

        if (sourcesMatch) {
            try {
                sources = JSON.parse(sourcesMatch[1]);
                cleanReply = aiResponse.replace(/SOURCES_USED:\s*\[.*?\]/, "").trim();
            } catch (e) {
                console.error("Failed to parse sources", e);
            }
        }

        return NextResponse.json({ success: true, reply: cleanReply, sources });
    } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Internal error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
