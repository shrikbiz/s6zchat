#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const envTemplate = `# OpenAI API Configuration
REACT_APP_OPENAI_API_KEY=your_open_ai_api_key_here

# Google Gemini API Configuration (optional)
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here

# Ollama Configuration
REACT_APP_OLLAMA_BASE_URL=http://localhost:11434

# App Configuration
REACT_APP_APP_NAME=S6ZChat
REACT_APP_APP_VERSION=0.1.0
`;

const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envPath)) {
    console.log("⚠️  .env file already exists. Skipping creation.");
    console.log(
        "If you want to update it, please edit the .env file manually."
    );
} else {
    fs.writeFileSync(envPath, envTemplate);
    console.log("✅ .env file created successfully!");
    console.log(
        "📝 Please review and update the API keys in the .env file as needed."
    );
}

console.log("\n📋 Environment variables configured:");
console.log("- REACT_APP_OPENAI_API_KEY: Your OpenAI API key");
console.log(
    "- REACT_APP_GEMINI_API_KEY: Your Google Gemini API key (optional)"
);
console.log("- REACT_APP_OLLAMA_BASE_URL: Ollama server URL");
console.log("- REACT_APP_APP_NAME: Application name");
console.log("- REACT_APP_APP_VERSION: Application version");

console.log("\n🚀 You can now run the application with: npm start");
