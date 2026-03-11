import { NextResponse } from "next/server";
import { extractJSON } from "@/lib/utils";

// Polyfill for Vercel Serverless environment where pdf-parse dependencies are missing
if (typeof globalThis.DOMMatrix === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).DOMMatrix = class DOMMatrix { };
}
if (typeof globalThis.Path2D === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Path2D = class Path2D { };
}
if (typeof globalThis.ImageData === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).ImageData = class ImageData { };
}

// @ts-expect-error pdf-parse lacks types
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { generateContent } from "@/lib/sambanova";

export const maxDuration = 60; // Max execution time for Next.js
export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({ status: "API is active. Use POST to upload." }, { status: 200 });
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            Allow: "POST, GET, OPTIONS",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Origin": "*",
        },
    });
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("file") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
        }

        const results = [];

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            let text = "";

            const ext = file.name.split(".").pop()?.toLowerCase();

            if (ext === "txt" || ext === "md" || ext === "csv") {
                text = buffer.toString("utf-8");
            } else if (ext === "pdf") {
                const data = await pdfParse(buffer);
                text = data.text;
            } else if (ext === "docx") {
                const result = await mammoth.extractRawText({ buffer });
                text = result.value;
            } else {
                text = "Unsupported file format: " + ext;
            }

            // Ensure text is not empty before asking SambaNova to analyze
            if (text.trim().length === 0) {
                continue;
            }

            // Analyze using SambaNova
            const systemPrompt = `You are an AI Notes Organizer.
Given the following messy notes text, analyze it and return a strict JSON object with this exact structure, nothing else:
{
  "topic": "A short 1-4 word category/topic name",
  "summary": "A 2-3 sentence overview of the contents",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "importantTerms": ["term 1", "term 2"]
}
Ensure it is valid JSON. Do not include markdown formatting or backticks around the json, just output {"topic":...} directly.`;

            const aiResponse = await generateContent(systemPrompt, text);

            try {
                const parsedAnalysis = extractJSON<Record<string, unknown>>(aiResponse);
                results.push({
                    id: crypto.randomUUID(),
                    name: file.name,
                    content: text,
                    ...parsedAnalysis,
                    createdAt: Date.now(),
                });
            } catch {
                console.error(
                    "Failed to parse AI response as JSON for file:",
                    file.name,
                    aiResponse
                );
                // Fallback
                results.push({
                    id: crypto.randomUUID(),
                    name: file.name,
                    content: text,
                    topic: "Uncategorized",
                    summary: "Could not generate summary.",
                    keyPoints: [],
                    importantTerms: [],
                    createdAt: Date.now(),
                });
            }
        }

        return NextResponse.json({ success: true, notes: results });
    } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error occured";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
