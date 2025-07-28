/**
 * Supported AI model types
 * @type {Object.<string, string>}
 */
export const MODELS = {
    openAI: "Open AI",
    ollama: "Ollama",
};

/**
 * Mapping of model names to their specific model identifiers
 * @type {Object.<string, string>}
 */
export const MODELS_MODEL_ID_MAPPING = {
    "Open AI": "gpt-4.1",
    Ollama: "gemma3:latest",
};

/**
 * Creates OpenAI-specific configuration options for chat requests
 * @param {Array} content - Array of chat messages with role and content
 * @returns {Object} OpenAI API configuration object
 */
function createOpenAIOptions(content) {
    const multiodal = false; // flag to switch between gpt-4.1 and gpt-4o
    const model = multiodal ? "gpt-4o" : "gpt-4.1";
    const input = content.map(({ role, content, type = "text" }) => ({
        role,
        content,
    }));

    return {
        model,
        input,
        stream: true,
    };
}

/**
 * Creates Ollama-specific configuration options for chat requests
 * @param {Array} content - Array of chat messages with role and content
 * @returns {Object} Ollama API configuration object
 */
function createOllamaOptions(content) {
    return {
        model: "gemma3:latest",
        messages: content,
    };
}

/**
 * Generates configuration options for chat requests based on the selected model
 *
 * This function creates the appropriate API configuration object depending on
 * whether the user has selected OpenAI or Ollama as their AI model.
 *
 * @param {Array} content - Array of chat messages with role and content properties
 * @param {string} model - The selected AI model (from MODELS enum)
 * @returns {Object} Configuration object for the specified model
 * @throws {Error} When an unsupported model is provided
 *
 * @example
 * ```javascript
 * const chatHistory = [
 *   { role: 'user', content: 'Hello' },
 *   { role: 'assistant', content: 'Hi there!' }
 * ];
 * const options = getOptsForChats(chatHistory, MODELS.openAI);
 * ```
 */
export function getOptsForChats(content, model) {
    if (model === MODELS.openAI) {
        return createOpenAIOptions(content);
    } else if (model === MODELS.ollama) {
        return createOllamaOptions(content);
    } else {
        throw new Error(
            `Unsupported model: ${model}. Supported models are: ${Object.values(MODELS).join(", ")}`
        );
    }
}

/**
 * Creates a prompt for generating conversation titles
 * @param {string} userMsg - The user's message to base the title on
 * @returns {string} Formatted prompt for title generation
 */
function createTitlePrompt(userMsg) {
    return `Generate a short and descriptive title for a conversation based on this user's message:\n\nUser: "${userMsg}"\n\nThe title should be concise (3 to 6 words), clearly describe the topic, and avoid punctuation.\n\nTitle:`;
}

/**
 * Generates configuration options for title generation requests
 *
 * This function creates a specialized configuration for generating conversation
 * titles based on the user's initial message. The prompt is designed to produce
 * concise, descriptive titles without punctuation.
 *
 * @param {string} userMsg - The user's message to base the title on
 * @param {string} model - The selected AI model (from MODELS enum)
 * @returns {Object} Configuration object for title generation
 * @throws {Error} When an unsupported model is provided
 *
 * @example
 * ```javascript
 * const titleOptions = getOptsForTitle("How do I implement authentication?", MODELS.openAI);
 * ```
 */
export function getOptsForTitle(userMsg, model) {
    if (!MODELS_MODEL_ID_MAPPING[model]) {
        throw new Error(
            `Unsupported model: ${model}. Supported models are: ${Object.keys(MODELS_MODEL_ID_MAPPING).join(", ")}`
        );
    }

    const prompt = createTitlePrompt(userMsg);
    return {
        model: MODELS_MODEL_ID_MAPPING[model],
        prompt,
        stream: false,
    };
}
