# S6ZChat

A modern chat application built with React that supports multiple AI providers including OpenAI and Ollama.

## Environment Setup

Before running the application, you need to set up your environment variables. Create a `.env` file in the root directory with the following variables:

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

### Required Environment Variables

- `REACT_APP_OPENAI_API_KEY`: Your OpenAI API key (required for OpenAI integration)
- `REACT_APP_OLLAMA_BASE_URL`: Ollama server URL (defaults to http://localhost:11434)

### Optional Environment Variables

- `REACT_APP_GEMINI_API_KEY`: Your Google Gemini API key (for future Gemini integration)
- `REACT_APP_APP_NAME`: Application name (defaults to "S6ZChat")
- `REACT_APP_APP_VERSION`: Application version (defaults to "0.1.0")

### Getting API Keys

1. **OpenAI API Key**: Visit [OpenAI Platform](https://platform.openai.com/api-keys) to create an API key
2. **Google Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to create an API key

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
