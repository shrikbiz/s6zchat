import { getOptsForChats, MODELS } from "./config";
import { decodeAndStreamResponseForOllama, requestOllama } from "./ollama";
import { decodeAndStreamResponseForOpenAI, getOpenAIResponse } from "./openAI";

/**
 * Processes chat response for OpenAI model
 * @param {Object} opts - Configuration options for the API request
 * @param {Function} setChatItems - State setter function for chat items
 * @param {Function} setIsProcessingQuery - State setter function for processing status
 * @returns {Promise<void>}
 */
async function processOpenAIResponse(opts, setChatItems, setIsProcessingQuery) {
    const response = await getOpenAIResponse(opts);
    await decodeAndStreamResponseForOpenAI(
        response,
        setChatItems,
        setIsProcessingQuery
    );
}

/**
 * Processes chat response for Ollama model
 * @param {Object} opts - Configuration options for the API request
 * @param {AbortController} controller - Abort controller for request cancellation
 * @param {Function} setChatItems - State setter function for chat items
 * @param {Function} setIsProcessingQuery - State setter function for processing status
 * @returns {Promise<void>}
 */
async function processOllamaResponse(opts, controller, setChatItems, setIsProcessingQuery) {
    const response = await requestOllama(opts, controller);
    decodeAndStreamResponseForOllama(
        response,
        setChatItems,
        setIsProcessingQuery
    );
}

/**
 * Determines which model processor to use based on the model type
 * @param {string} model - The model identifier (OpenAI or Ollama)
 * @param {Object} opts - Configuration options for the API request
 * @param {AbortController} controller - Abort controller for request cancellation
 * @param {Function} setChatItems - State setter function for chat items
 * @param {Function} setIsProcessingQuery - State setter function for processing status
 * @returns {Promise<void>}
 * @throws {Error} When an unsupported model is provided
 */
async function routeToModelProcessor(model, opts, controller, setChatItems, setIsProcessingQuery) {
    if (model === MODELS.openAI) {
        await processOpenAIResponse(opts, setChatItems, setIsProcessingQuery);
    } else if (model === MODELS.ollama) {
        await processOllamaResponse(opts, controller, setChatItems, setIsProcessingQuery);
    } else {
        throw new Error(`Unsupported model: ${model}. Supported models are: ${Object.values(MODELS).join(', ')}`);
    }
}

/**
 * Main function to fetch and decode responses from AI models
 * 
 * This function orchestrates the entire process of:
 * 1. Preparing the request options based on chat history and model
 * 2. Routing to the appropriate model processor (OpenAI or Ollama)
 * 3. Handling streaming responses and updating the UI state
 * 
 * @param {Array} chatItems - Array of chat messages with role and content
 * @param {string} model - The AI model to use (OpenAI or Ollama)
 * @param {AbortController} controller - Abort controller for request cancellation
 * @param {Function} setChatItems - State setter function for chat items (React state updater)
 * @param {Function} setIsProcessingQuery - State setter function for processing status (React state updater)
 * @returns {Promise<void>}
 * 
 * @example
 * ```javascript
 * await fetchAndDecodeResponse(
 *   chatHistory,
 *   MODELS.openAI,
 *   abortController,
 *   setChatItems,
 *   setIsProcessingQuery
 * );
 * ```
 */
export async function fetchAndDecodeResponse(
    chatItems,
    model,
    controller,
    setChatItems,
    setIsProcessingQuery
) {
    // Prepare request options based on chat history and selected model
    const opts = getOptsForChats(chatItems, model);
    
    // Route to appropriate model processor
    await routeToModelProcessor(model, opts, controller, setChatItems, setIsProcessingQuery);
}
