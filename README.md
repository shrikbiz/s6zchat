# S6ZChat

A modern chat application built with React that supports multiple AI providers including OpenAI and Ollama. Features a beautiful UI with syntax-highlighted code blocks, real-time streaming responses, and local chat history storage.

## Features

- 🤖 **Multi-AI Provider Support**: Chat with OpenAI GPT models or local Ollama models
- 💬 **Real-time Streaming**: See responses as they're generated
- 📝 **Syntax Highlighting**: Code blocks with VS Code-like syntax highlighting
- 💾 **Local Storage**: Chat history stored locally using IndexedDB
- 🎨 **Modern UI**: Clean, responsive interface built with Material-UI
- 🔄 **Conversation Management**: Create, save, and manage multiple chat sessions
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- For Ollama: macOS, Linux, or Windows with WSL2

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd s6zchat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   npm run setup-env
   ```

4. **Configure your AI providers** (see sections below)

5. **Start the application**
   ```bash
   npm start
   ```

The app will open at [http://localhost:3000](http://localhost:3000)

## AI Provider Setup

### 1. OpenAI Setup

#### Getting an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the generated API key
5. Add it to your `.env` file:
   ```bash
   REACT_APP_OPENAI_API_KEY=sk-your-api-key-here
   ```

#### OpenAI Models Used

- **GPT-4.1**: Primary model for chat responses
- **GPT-4o**: Available for multimodal features (currently disabled)

#### OpenAI API Costs

- GPT-4.1: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- GPT-4o: ~$0.005 per 1K input tokens, ~$0.015 per 1K output tokens

### 2. Ollama Setup

#### Installing Ollama

**macOS:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows (WSL2):**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

#### Starting Ollama Server

```bash
ollama serve
```

The server will start on `http://localhost:11434` by default.

#### Downloading the Required Model

This app uses the **Gemma3:latest** model by default. Download it with:

```bash
ollama pull gemma3:latest
```

#### Model Information

- **Model**: `gemma3:latest`
- **Size**: ~4.5GB
- **Memory Usage**: ~8GB RAM during inference
- **Performance**: Good for general chat and coding tasks
- **License**: Open source (Apache 2.0)

#### Alternative Models

You can use other Ollama models by modifying the configuration in `src/Components/API/config.js`:

```javascript
export const MODELS_MODEL_ID_MAPPING = {
    "Open AI": "gpt-4.1",
    Ollama: "llama3.2:latest", // Change to your preferred model
};
```

Popular alternatives:
- `llama3.2:latest` (8B parameters, ~4.7GB)
- `codellama:latest` (7B parameters, ~4GB, optimized for code)
- `mistral:latest` (7B parameters, ~4.1GB)
- `phi3:latest` (3.8B parameters, ~2.3GB)

#### Ollama System Requirements

- **Minimum RAM**: 8GB (16GB recommended)
- **Storage**: 5-10GB free space for models
- **CPU**: Multi-core processor (4+ cores recommended)
- **GPU**: Optional but recommended for faster inference

## Environment Configuration

### Automatic Setup

The easiest way to set up environment variables is using the provided script:

```bash
npm run setup-env
```

This will create a `.env` file with all necessary variables and helpful comments.

### Manual Setup

Create a `.env` file in the root directory:

```bash
# OpenAI API Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini API Configuration (optional)
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here

# Ollama Configuration
REACT_APP_OLLAMA_BASE_URL=http://localhost:11434

# App Configuration
REACT_APP_APP_NAME=S6ZChat
REACT_APP_APP_VERSION=0.1.0
```

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_OPENAI_API_KEY` | Yes* | - | Your OpenAI API key |
| `REACT_APP_OLLAMA_BASE_URL` | No | `http://localhost:11434` | Ollama server URL |
| `REACT_APP_GEMINI_API_KEY` | No | - | Google Gemini API key (future use) |
| `REACT_APP_APP_NAME` | No | `S6ZChat` | Application name |
| `REACT_APP_APP_VERSION` | No | `0.1.0` | Application version |

*Required if you want to use OpenAI models

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Runs unit tests with coverage and builds the app for production (full pipeline)

### `npm run build-react`
Builds the app for production in the `build` folder (React build only, no tests)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run test:e2e`
Runs end-to-end tests using Playwright (requires dev server running on localhost:3000)

### `npm run setup-env`
Creates a `.env` file with default configuration

### `npm run eject`
**⚠️ One-way operation!** Ejects from Create React App configuration

## Project Structure

```
s6zchat/
├── src/
│   ├── Components/
│   │   ├── API/           # AI provider integrations
│   │   ├── ChatDB/        # Local database management
│   │   ├── ChatItems/     # Chat UI components
│   │   ├── Layout/        # Layout components
│   │   ├── MainPage/      # Main chat interface
│   │   ├── MarkdownRenderer/ # Markdown and code rendering
│   │   └── TextEditor/    # Input component
│   ├── App.js            # Main app component
│   └── index.js          # App entry point
├── public/               # Static assets
├── setup-env.js         # Environment setup script
└── package.json         # Dependencies and scripts
```

## Technology Stack

- **Frontend**: React 19, Material-UI
- **State Management**: React Hooks
- **Local Storage**: Dexie.js (IndexedDB)
- **AI Providers**: OpenAI API, Ollama
- **Code Highlighting**: Prism.js
- **Markdown**: markdown-to-jsx
- **Styling**: Styled Components, CSS

## Troubleshooting

### Common Issues

**Ollama Connection Error:**
- Ensure Ollama server is running: `ollama serve`
- Check if the model is downloaded: `ollama list`
- Verify the base URL in `.env` file

**OpenAI API Errors:**
- Verify your API key is correct
- Check your OpenAI account balance
- Ensure the API key has proper permissions

**Build Errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

### Performance Tips

- Use smaller Ollama models for faster responses
- Close other applications to free up RAM for Ollama
- Consider using GPU acceleration for Ollama (if available)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the code comments for implementation details
- Open an issue on the repository

---

**Happy Chatting! 🤖💬**
