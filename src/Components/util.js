export async function decodeAndStreamResponse(
    response,
    setChatItems,
    setIsProcessingQuery
) {
    setIsProcessingQuery(true);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    // Helper to find and remove overlap between current and new content
    function removeOverlap(current, incoming, overlapLength = 20) {
        if (!current || !incoming) return incoming;
        const end = current.slice(-overlapLength);
        const start = incoming.slice(0, overlapLength);
        for (let i = Math.min(end.length, start.length); i > 0; i--) {
            if (end.slice(-i) === start.slice(0, i)) {
                return incoming.slice(i);
            }
        }
        return incoming;
    }

    // Helper to process a single NDJSON line
    function processLine(line) {
        if (!line.trim()) return;
        try {
            const json = JSON.parse(line);
            const newContent = json?.message?.content;
            if (!newContent) return;

            setChatItems((prev) => {
                const newChatItems = [...prev];
                const idx = newChatItems.length - 1;
                const currentContent = newChatItems[idx]?.content || "";
                const contentToAdd = removeOverlap(currentContent, newContent);
                newChatItems[idx].content += contentToAdd;
                newChatItems[idx].isLoading = false;
                return newChatItems;
            });
        } catch {
            // Ignore parse errors for incomplete lines
            setIsProcessingQuery(false);
        }
    }

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop(); // Save incomplete line for next chunk

            for (const line of lines) {
                processLine(line);
            }
        }
    } catch (err) {
        if (err.name === "AbortError") {
            // Request was aborted, handle gracefully (optional: log or set state)
        } else {
            // Handle other errors if needed
            console.error(err);
        }
    } finally {
        setIsProcessingQuery(false);
    }
}

// You can control inference for Ollama APIs by passing additional parameters in the request body.
// For example, you can set temperature, top_p, max_tokens, stop sequences, etc.
// See: https://github.com/jmorganca/ollama/blob/main/docs/api.md#parameters

export function requestOllama(chatItems, controller, options = {}) {
    // Default inference options (customize as needed)
    const defaultOptions = {
        model: "gemma3:latest",
        messages: chatItems,
        // Example inference controls:
        // temperature: 0.7,
        // top_p: 0.9,
        // max_tokens: 10,
        // stop: ["</s>"],
    };

    // Merge user-provided options with defaults
    const requestBody = { ...defaultOptions, ...options };

    return fetch("http://localhost:11434/api/chat", {
        signal: controller.signal,
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function getTitleForChat(userMsg) {
    const prompt = `Generate a short and descriptive title for a conversation based on this user's message:\n\nUser: "${userMsg}"\n\nThe title should be concise (3 to 6 words), clearly describe the topic, and avoid punctuation.\n\nTitle:`;

    // Default inference options (customize as needed)
    const defaultOptions = {
        model: "gemma3:latest",
        prompt,
        stream: false,
    };

    try {
        // Merge user-provided options with defaults
        const requestBody = { ...defaultOptions };

        const rawResponse = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = await rawResponse.json(); // Await the JSON parsing
        return response?.response;
    } catch (e) {
        console.error("Error in getTitleForChat:", e);
    } finally {
        console.log("Fetching completed");
    }
}
