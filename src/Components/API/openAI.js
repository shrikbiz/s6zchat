import config from "../config";
import OpenAI from "openai";

/**
 * OpenAI API key from configuration
 * @type {string|undefined}
 */
const OPENAI_API_KEY = config.openai.apiKey;

/**
 * Validates that OpenAI API key is configured
 * @throws {Error} When API key is not found
 */
function validateAPIKey() {
    if (!OPENAI_API_KEY) {
        throw new Error(
            "OpenAI API key is not configured. Please set REACT_APP_OPENAI_API_KEY in your .env file"
        );
    }
}

/**
 * Warns if OpenAI API key is missing (non-blocking)
 */
function warnIfNoAPIKey() {
    if (!OPENAI_API_KEY) {
        console.warn(
            "OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY in your .env file"
        );
    }
}

// Initialize warning on module load
warnIfNoAPIKey();

/**
 * Retrieves the configured OpenAI API key
 *
 * This function validates that the API key is properly configured
 * before returning it for use in API requests.
 *
 * @returns {string} The OpenAI API key
 * @throws {Error} When API key is not configured
 *
 * @example
 * ```javascript
 * const apiKey = getOpenAIAPIKey();
 * ```
 */
export const getOpenAIAPIKey = () => {
    validateAPIKey();
    return OPENAI_API_KEY;
};

/**
 * OpenAI client instance configured for browser usage
 * @type {OpenAI}
 */
const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

/**
 * Makes a request to OpenAI API with the provided options
 *
 * This function sends a request to OpenAI's responses endpoint
 * with the specified configuration options.
 *
 * @param {Object} opts - Configuration options for the OpenAI API request
 * @returns {Promise<Object>} OpenAI API response object
 *
 * @example
 * ```javascript
 * const response = await getOpenAIResponse({
 *   model: 'gpt-4.1',
 *   input: [{ role: 'user', content: 'Hello' }],
 *   stream: true
 * });
 * ```
 */
export async function getOpenAIResponse(opts) {
    return client.responses.create(opts);
}

/**
 * Extracts content delta from different OpenAI response formats
 *
 * This helper function handles various response formats that OpenAI
 * might return during streaming, ensuring compatibility.
 *
 * @param {Object} chunk - Response chunk from OpenAI streaming
 * @returns {string|null} Content delta or null if not found
 */
function extractContentDelta(chunk) {
    // Check for standard OpenAI streaming format
    if (chunk.choices && chunk.choices[0]?.delta?.content) {
        return chunk.choices[0].delta.content;
    }
    // Check for alternative format
    else if (chunk.delta) {
        return chunk.delta;
    }

    return null;
}

/**
 * Updates the chat items state with new streaming content
 *
 * This function updates the last chat item with incoming content
 * while preserving the streaming effect.
 *
 * @param {Function} setChatItems - React state setter for chat items
 * @param {string} delta - New content to append
 */
function updateChatWithDelta(setChatItems, delta) {
    setChatItems((prev) => {
        const lastIndex = prev.length - 1;

        return prev.map((chatItem, index) => {
            if (index !== lastIndex) {
                return chatItem;
            } else {
                const updatedChatItem = { ...chatItem };
                // Append the delta for true streaming effect
                updatedChatItem.content += delta;
                updatedChatItem.isLoading = false;
                return updatedChatItem;
            }
        });
    });
}

/**
 * Processes the streaming response iterator from OpenAI
 *
 * This function handles the async iteration over the streaming
 * response chunks and updates the UI in real-time.
 *
 * @param {Object} response - OpenAI response object with iterator
 * @param {Function} setChatItems - React state setter for chat items
 * @param {Function} setIsProcessingQuery - React state setter for processing status
 * @returns {Promise<void>}
 */
async function processStreamingIterator(
    response,
    setChatItems,
    setIsProcessingQuery
) {
    for await (const chunk of response.iterator()) {
        const delta = extractContentDelta(chunk);

        if (delta) {
            updateChatWithDelta(setChatItems, delta);
        }
    }
}

/**
 * Handles streaming response from OpenAI API and updates chat UI in real-time
 *
 * This function processes the streaming response from OpenAI, extracts content
 * deltas, and updates the chat interface as content arrives. It handles:
 * - Response format validation
 * - Content delta extraction
 * - Real-time UI updates
 * - Error handling and state management
 *
 * @param {Object} response - OpenAI response object with streaming iterator
 * @param {Function} setChatItems - React state setter for chat items
 * @param {Function} setIsProcessingQuery - React state setter for processing status
 * @returns {Promise<void>}
 *
 * @example
 * ```javascript
 * const response = await getOpenAIResponse(opts);
 * await decodeAndStreamResponseForOpenAI(response, setChatItems, setIsProcessingQuery);
 * ```
 */
export async function decodeAndStreamResponseForOpenAI(
    response,
    setChatItems,
    setIsProcessingQuery
) {
    setIsProcessingQuery(true);

    try {
        // Handle the Stream object with iterator
        if (response && response.iterator) {
            await processStreamingIterator(
                response,
                setChatItems,
                setIsProcessingQuery
            );
        } else {
            console.error("Invalid response format - no iterator found");
        }
    } catch (error) {
        console.error("Streaming error:", error);
    } finally {
        setIsProcessingQuery(false);
    }
}
