import { NextResponse } from "next/server";
import { generateContent } from "@/lib/sambanova";

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const { files } = await request.json(); // List of { name: string, content: string }

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }

        const systemPrompt = `You are an AI File Organizer. Reorganize and rename the following files for better structure.
        Suggest a new name and a folder path for each file.
        
        Return a strict JSON array of objects:
        [
          {
            "originalName": "string",
            "newName": "string",
            "folder": "string",
            "reason": "string"
          }
        ]
        Ensure names are professional and descriptive. Group similar files into the same folder.
        Ensure it is valid JSON. No markdown formatting.`;

        const aiResponse = await generateContent(systemPrompt, JSON.stringify(files.map((f: any) => ({ name: f.name, summary: f.content.slice(0, 500) }))));
        const cleanedResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        const organization = JSON.parse(cleanedResponse);

        return NextResponse.json({ success: true, organization });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
