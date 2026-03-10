import { NextResponse } from "next/server";
import { generateContent } from "@/lib/sambanova";

export async function POST(request: Request) {
    try {
        const { context, message, history } = await request.json();

        let systemPrompt = `You are a helpful AI tutor for a notes app. 
You are given the extracted content of the user's notes below. 
Answer their questions based STRICTLY on the notes. If the notes do not contain the info, say you don't know based on these notes. Do not make things up.

=== NOTES CONTENT START ===
${context}
=== NOTES CONTENT END ===

Respond to their question concisely.`;

        let userMessage = "";
        if (history && history.length > 0) {
            userMessage = "Here is the chat history:\n";
            history.forEach((msg: any) => {
                userMessage += `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}\n`;
            });
            userMessage += `\nNow, respond to the newest user question: ${message}`;
        } else {
            userMessage = message;
        }

        const aiResponse = await generateContent(systemPrompt, userMessage);

        return NextResponse.json({ success: true, reply: aiResponse });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
