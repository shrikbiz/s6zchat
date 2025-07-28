// Environment Configuration
const config = {
    // OpenAI Configuration
    openai: {
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    },
    
    // Google Gemini Configuration
    gemini: {
        apiKey: process.env.REACT_APP_GEMINI_API_KEY,
    },
    
    // Ollama Configuration
    ollama: {
        baseUrl: process.env.REACT_APP_OLLAMA_BASE_URL || "http://localhost:11434",
    },
    
    // App Configuration
    app: {
        name: process.env.REACT_APP_APP_NAME || "S6ZChat",
        version: process.env.REACT_APP_APP_VERSION || "0.1.0",
    },
};

// Validation function to check if required environment variables are set
export const validateConfig = () => {
    const warnings = [];
    const errors = [];
    
    if (!config.openai.apiKey) {
        warnings.push("REACT_APP_OPENAI_API_KEY is not set");
    }
    
    if (!config.gemini.apiKey) {
        warnings.push("REACT_APP_GEMINI_API_KEY is not set");
    }
    
    // Log warnings and errors
    if (warnings.length > 0) {
        console.warn("Configuration warnings:", warnings);
    }
    
    if (errors.length > 0) {
        console.error("Configuration errors:", errors);
        throw new Error("Required environment variables are missing");
    }
    
    return { warnings, errors };
};

export default config;
