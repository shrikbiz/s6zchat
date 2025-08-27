# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

S6ZChat is a React-based chat application supporting multiple AI providers (OpenAI and Ollama). It features real-time streaming responses, local chat history storage using IndexedDB, and syntax-highlighted code blocks.

## Development Commands

### Core Commands
- `npm start` - Start development server (localhost:3000)
- `npm run build` - Build for production
- `npm test` - Run tests in watch mode
- `npm run setup-env` - Create .env file with default configuration

### Environment Setup
Run `npm run setup-env` to automatically create a `.env` file with required variables:
- `REACT_APP_OPENAI_API_KEY` - OpenAI API key
- `REACT_APP_OLLAMA_BASE_URL` - Ollama server URL (default: http://localhost:11434)

## Architecture Overview

### Key Components Structure
- **API Layer** (`src/Components/API/`): AI provider integrations with unified configuration system
- **ChatDB** (`src/Components/ChatDB/`): Dexie.js-based IndexedDB wrapper for local chat storage
- **Chat Components** (`src/Components/ChatItems/`): User and agent chat message rendering
- **Layout** (`src/Components/Layout/`): Navigation, sidebar, and search functionality
- **MarkdownRenderer** (`src/Components/MarkdownRenderer/`): Code syntax highlighting with Prism.js

### AI Provider System
The application uses a unified configuration system in `src/Components/API/config.js`:
- `MODELS` enum defines available providers (OpenAI, Ollama)
- `MODELS_MODEL_ID_MAPPING` maps provider names to specific model IDs
- `getOptsForChats()` generates provider-specific API configurations
- `getOptsForTitle()` generates configurations for conversation title generation

### Data Flow
1. User input → TextEditor component
2. Chat messages stored in IndexedDB via ChatDB
3. API calls configured through unified config system
4. Streaming responses rendered in real-time
5. Chat history persisted locally with search functionality

### Build System
Uses `react-app-rewired` with custom webpack configuration (`config-overrides.js`) that:
- Reads path aliases from `jsconfig.json`
- Converts them to webpack aliases automatically
- Enables cleaner imports throughout the application

### Local Database Schema
ChatDB stores conversations with:
- `chatId`: Unique conversation identifier
- `chatName`: Generated conversation title
- `chatItem`: Array of message objects with role/content
- `createdOn`: Timestamp for sorting