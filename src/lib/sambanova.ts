export async function generateContent(systemPrompt: string, userMessage: string, model: string = "Meta-Llama-3.1-8B-Instruct") {
    const apiKey = process.env.SAMBANOVA_API_KEY;
    if (!apiKey) {
        throw new Error("SAMBANOVA_API_KEY is not set.");
    }

    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            model: model,
            temperature: 0.1,
            top_p: 0.1,
        })
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("SambaNova Error:", text);
        throw new Error("SambaNova API request failed: " + text);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
