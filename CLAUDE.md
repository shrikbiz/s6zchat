# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

S6ZChat is a React-based chat application supporting multiple AI providers (OpenAI and Ollama). It features real-time streaming responses, local chat history storage using IndexedDB, and syntax-highlighted code blocks.

## Development Commands

### Core Commands
- `npm start` - Start development server (localhost:3000)
- `npm run build` - Run unit tests with coverage and build for production (full pipeline)
- `npm run build-react` - Build for production (React build only, no tests)
- `npm test` - Run unit tests in watch mode
- `npm run test:e2e` - Run E2E tests (requires dev server running)
- `npm run setup-env` - Create .env file with default configuration

### End-to-End Testing
- `node e2e-tests/playwright-test.js` - Run Playwright E2E test for chat functionality

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

## Testing

S6ZChat includes comprehensive testing coverage with both unit tests and end-to-end tests.

### Unit Testing with Jest & React Testing Library

**Test Coverage:**
- ✅ **App.js**: Router configuration and navigation
- ✅ **API Layer**: Configuration, request handling, and model routing
- ✅ **ChatDB**: Database operations, CRUD operations, and search functionality
- ✅ **Components**: TextEditor, ModelSelector, Welcome screen
- ✅ **Configuration**: Environment variables and validation

**Key Test Files:**
- `src/__tests__/App.test.js` - Main app routing tests
- `src/Components/API/__tests__/` - API layer tests (config.test.js, index.test.js)
- `src/Components/ChatDB/__tests__/index.test.js` - Database operations
- `src/Components/TextEditor/__tests__/index.test.js` - Text input and interactions
- `src/Components/ModelSelector/__tests__/index.test.js` - Model switching
- `src/Components/Welcome/__tests__/index.test.js` - Welcome screen with loading states
- `src/Components/__tests__/config.test.js` - Configuration and environment variables

**Running Unit Tests:**
```bash
# Run all unit tests
npm test

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test -- src/Components/Welcome/__tests__/index.test.js

# Run tests in watch mode
npm test -- --watch
```

### E2E Testing with Playwright

**Prerequisites:**
- Development server running on `localhost:3000`
- Playwright installed (`npm install --save-dev playwright`)
- Chromium browser installed (`npx playwright install chromium`)

**Available E2E Tests:**

1. `e2e-tests/playwright-test.js`: Basic chat interaction test
   - Opens browser to localhost:3000
   - Enters a prompt in the text editor
   - Submits the prompt and waits for AI response  
   - Takes full-page screenshot of the result
   - Saves screenshot with timestamp in `.e2e-screenshots/`

2. `e2e-tests/side-menu-test.js`: Side menu verification test
   - Opens the sidebar navigation
   - Verifies presence of required menu items (New chat, Search, Chats section)
   - Checks for settings button
   - Takes screenshot of open sidebar

3. `e2e-tests/chat-history-test.js`: Chat history functionality test
   - Creates a new chat with a unique prompt
   - Waits for AI response (10 seconds)
   - Opens sidebar to verify chat appears in history
   - Tests clicking on chat history items
   - Verifies chat persistence

4. `e2e-tests/model-switching-test.js`: Model switching test
   - Locates the model selector dropdown
   - Tests switching between OpenAI and Ollama models
   - Verifies model selection changes
   - Takes screenshots of dropdown options

5. `e2e-tests/settings-test.js`: Settings menu test
   - Opens sidebar and locates settings button
   - Opens settings modal/dialog
   - Tests closing settings modal
   - Verifies settings accessibility

**Running E2E Tests:**
```bash
# Ensure dev server is running
npm start

# Run all E2E tests (recommended)
npm run test:e2e

# Run individual E2E tests
node e2e-tests/playwright-test.js
node e2e-tests/side-menu-test.js
node e2e-tests/chat-history-test.js
node e2e-tests/model-switching-test.js
node e2e-tests/settings-test.js

# Run all E2E tests sequentially (alternative)
node e2e-tests/run-all-tests.js
```

### Comprehensive Test Runner

**Run All Tests (Unit + E2E):**
```bash
# Run comprehensive test suite
node scripts/run-all-tests.js
```

This script will:
- ✅ Check prerequisites (Node.js, npm, Playwright)
- ✅ Run all unit tests with coverage
- ✅ Verify development server is running
- ✅ Execute all E2E tests sequentially
- ✅ Provide detailed summary with pass/fail counts
- ✅ Generate screenshots for E2E tests (saved in `.e2e-screenshots/`)

**Test Structure:**
```
src/
├── __tests__/              # App-level tests
│   └── App.test.js
├── Components/
│   ├── API/__tests__/       # API layer tests
│   ├── ChatDB/__tests__/    # Database tests
│   ├── TextEditor/__tests__/ # Component tests
│   ├── Welcome/__tests__/   # Component tests
│   └── __tests__/          # Shared component tests
e2e-tests/                  # End-to-end tests
scripts/                    # Test utilities
└── run-all-tests.js       # Comprehensive test runner
```