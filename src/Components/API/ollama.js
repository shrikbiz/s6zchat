import config from "@components/config";

/**
 * Default inference options for Ollama API requests
 * @type {Object}
 */
const DEFAULT_INFERENCE_OPTIONS = {
    // Add default inference parameters here as needed
    // temperature: 0.7,
    // top_p: 0.9,
    // max_tokens: 1000,
};

/**
 * Creates the request body by merging user options with defaults
 * @param {Object} opts - User-provided options
 * @param {Object} options - Additional options to merge
 * @returns {Object} Merged request body
 */
function createRequestBody(opts, options) {
    return { ...opts, ...DEFAULT_INFERENCE_OPTIONS, ...options };
}

/**
 * Makes a chat request to the Ollama API
 * 
 * This function sends a POST request to the Ollama chat endpoint with the
 * provided options. It supports request cancellation via AbortController.
 * 
 * @param {Object} opts - Request options including model and messages
 * @param {AbortController} controller - Abort controller for request cancellation
 * @param {Object} options - Additional inference options (optional)
 * @returns {Promise<Response>} Fetch response object
 * 
 * @example
 * ```javascript
 * const controller = new AbortController();
 * const response = await requestOllama(
 *   { model: 'gemma3:latest', messages: [...] },
 *   controller
 * );
 * ```
 */
export function requestOllama(opts, controller, options = {}) {
    const OLLAMA_BASE_URL = config.ollama.baseUrl;
    const requestBody = createRequestBody(opts, options);

    return fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        signal: controller.signal,
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

/**
 * Generates a title for a chat conversation using Ollama
 * 
 * This function sends a request to Ollama's generate endpoint to create
 * a descriptive title based on the user's message.
 * 
 * @param {Object} opts - Request options including model and prompt
 * @returns {Promise<string|null>} Generated title or null if failed
 * 
 * @example
 * ```javascript
 * const title = await getTitleForChat({
 *   model: 'gemma3:latest',
 *   prompt: 'Generate title for: "How do I implement auth?"'
 * });
 * ```
 */
export async function getTitleForChat(opts) {
    const OLLAMA_BASE_URL = config.ollama.baseUrl;

    try {
        const rawResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: "POST",
            body: JSON.stringify(opts),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = await rawResponse.json();
        return response?.response;
    } catch (e) {
        console.error("Error in getTitleForChat:", e);
        return null;
    }
}

/**
 * Removes overlapping content between current and incoming text
 * 
 * This helper function prevents duplicate content when streaming responses
 * by detecting and removing overlapping text segments.
 * 
 * @param {string} current - Current content in the chat
 * @param {string} incoming - New incoming content
 * @param {number} overlapLength - Maximum length to check for overlap (default: 20)
 * @returns {string} Incoming content with overlap removed
 */
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

/**
 * Processes a single NDJSON line from the streaming response
 * 
 * @param {string} line - Single line of NDJSON data
 * @param {Function} setChatItems - State setter function for chat items
 * @param {Function} setIsProcessingQuery - State setter function for processing status
 */
function processLine(line, setChatItems, setIsProcessingQuery) {
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
    } catch (error) {
        // Ignore parse errors for incomplete lines
        console.warn("Failed to parse NDJSON line:", error);
        setIsProcessingQuery(false);
    }
}

/**
 * Processes the streaming response buffer and extracts complete lines
 * 
 * @param {string} buffer - Current buffer containing partial lines
 * @param {Function} setChatItems - State setter function for chat items
 * @param {Function} setIsProcessingQuery - State setter function for processing status
 * @returns {string} Remaining incomplete line for next iteration
 */
function processBuffer(buffer, setChatItems, setIsProcessingQuery) {
    const lines = buffer.split("\n");
    const remainingBuffer = lines.pop(); // Save incomplete line for next chunk

    for (const line of lines) {
        processLine(line, setChatItems, setIsProcessingQuery);
    }

    return remainingBuffer;
}

/**
 * Handles streaming response from Ollama API and updates chat UI in real-time
 * 
 * This function processes the streaming response from Ollama, decodes the NDJSON
 * format, and updates the chat interface as content arrives. It handles:
 * - Text decoding and buffering
 * - NDJSON parsing
 * - Overlap detection and removal
 * - Real-time UI updates
 * - Error handling and request cancellation
 * 
 * @param {Response} response - Fetch response object from Ollama API
 * @param {Function} setChatItems - React state setter for chat items
 * @param {Function} setIsProcessingQuery - React state setter for processing status
 * @returns {Promise<void>}
 * 
 * @example
 * ```javascript
 * const response = await requestOllama(opts, controller);
 * await decodeAndStreamResponseForOllama(response, setChatItems, setIsProcessingQuery);
 * ```
 */
export async function decodeAndStreamResponseForOllama(
    response,
    setChatItems,
    setIsProcessingQuery
) {
    setIsProcessingQuery(true);
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            buffer = processBuffer(buffer, setChatItems, setIsProcessingQuery);
        }
    } catch (err) {
        if (err.name === "AbortError") {
            console.log("Request was aborted");
        } else {
            console.error("Streaming error:", err);
        }
    } finally {
        setIsProcessingQuery(false);
    }
}
