import { fetchAndDecodeResponse } from '../index';
import { getOptsForChats, MODELS } from '../config';
import { decodeAndStreamResponseForOllama, requestOllama } from '../ollama';
import { decodeAndStreamResponseForOpenAI, getOpenAIResponse } from '../openAI';

// Mock the dependencies
jest.mock('../config');
jest.mock('../ollama');
jest.mock('../openAI');

describe('API Index Module', () => {
  // Mock functions
  const mockSetChatItems = jest.fn();
  const mockSetIsProcessingQuery = jest.fn();
  const mockController = {
    signal: {},
    abort: jest.fn(),
  };

  // Sample data
  const sampleChatItems = [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there!' },
  ];

  const sampleOpts = {
    model: 'test-model',
    input: sampleChatItems,
    stream: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    getOptsForChats.mockReturnValue(sampleOpts);
    getOpenAIResponse.mockResolvedValue({ ok: true, body: 'mock-response' });
    requestOllama.mockResolvedValue({ ok: true, body: 'mock-response' });
    decodeAndStreamResponseForOpenAI.mockResolvedValue();
    decodeAndStreamResponseForOllama.mockResolvedValue();
  });

  describe('fetchAndDecodeResponse', () => {
    describe('OpenAI model processing', () => {
      test('processes OpenAI model successfully', async () => {
        await fetchAndDecodeResponse(
          sampleChatItems,
          MODELS.openAI,
          mockController,
          mockSetChatItems,
          mockSetIsProcessingQuery
        );

        expect(getOptsForChats).toHaveBeenCalledWith(sampleChatItems, MODELS.openAI);
        expect(getOpenAIResponse).toHaveBeenCalledWith(sampleOpts);
        expect(decodeAndStreamResponseForOpenAI).toHaveBeenCalledWith(
          { ok: true, body: 'mock-response' },
          mockSetChatItems,
          mockSetIsProcessingQuery
        );
        expect(requestOllama).not.toHaveBeenCalled();
        expect(decodeAndStreamResponseForOllama).not.toHaveBeenCalled();
      });

      test('handles OpenAI API errors gracefully', async () => {
        const mockError = new Error('OpenAI API error');
        getOpenAIResponse.mockRejectedValue(mockError);

        await expect(
          fetchAndDecodeResponse(
            sampleChatItems,
            MODELS.openAI,
            mockController,
            mockSetChatItems,
            mockSetIsProcessingQuery
          )
        ).rejects.toThrow('OpenAI API error');

        expect(getOptsForChats).toHaveBeenCalledWith(sampleChatItems, MODELS.openAI);
        expect(getOpenAIResponse).toHaveBeenCalledWith(sampleOpts);
        expect(decodeAndStreamResponseForOpenAI).not.toHaveBeenCalled();
      });

      test('handles streaming errors for OpenAI', async () => {
        const mockError = new Error('Streaming error');
        decodeAndStreamResponseForOpenAI.mockRejectedValue(mockError);

        await expect(
          fetchAndDecodeResponse(
            sampleChatItems,
            MODELS.openAI,
            mockController,
            mockSetChatItems,
            mockSetIsProcessingQuery
          )
        ).rejects.toThrow('Streaming error');

        expect(getOpenAIResponse).toHaveBeenCalled();
        expect(decodeAndStreamResponseForOpenAI).toHaveBeenCalled();
      });
    });

    describe('Ollama model processing', () => {
      test('processes Ollama model successfully', async () => {
        await fetchAndDecodeResponse(
          sampleChatItems,
          MODELS.ollama,
          mockController,
          mockSetChatItems,
          mockSetIsProcessingQuery
        );

        expect(getOptsForChats).toHaveBeenCalledWith(sampleChatItems, MODELS.ollama);
        expect(requestOllama).toHaveBeenCalledWith(sampleOpts, mockController);
        expect(decodeAndStreamResponseForOllama).toHaveBeenCalledWith(
          { ok: true, body: 'mock-response' },
          mockSetChatItems,
          mockSetIsProcessingQuery
        );
        expect(getOpenAIResponse).not.toHaveBeenCalled();
        expect(decodeAndStreamResponseForOpenAI).not.toHaveBeenCalled();
      });

      test('handles Ollama API errors gracefully', async () => {
        const mockError = new Error('Ollama API error');
        requestOllama.mockRejectedValue(mockError);

        await expect(
          fetchAndDecodeResponse(
            sampleChatItems,
            MODELS.ollama,
            mockController,
            mockSetChatItems,
            mockSetIsProcessingQuery
          )
        ).rejects.toThrow('Ollama API error');

        expect(getOptsForChats).toHaveBeenCalledWith(sampleChatItems, MODELS.ollama);
        expect(requestOllama).toHaveBeenCalledWith(sampleOpts, mockController);
        expect(decodeAndStreamResponseForOllama).not.toHaveBeenCalled();
      });

      test('passes abort controller to Ollama request', async () => {
        const customController = {
          signal: { aborted: false },
          abort: jest.fn(),
        };

        await fetchAndDecodeResponse(
          sampleChatItems,
          MODELS.ollama,
          customController,
          mockSetChatItems,
          mockSetIsProcessingQuery
        );

        expect(requestOllama).toHaveBeenCalledWith(sampleOpts, customController);
      });
    });

    describe('Error handling', () => {
      test('throws error for unsupported model', async () => {
        const unsupportedModel = 'UnsupportedModel';

        await expect(
          fetchAndDecodeResponse(
            sampleChatItems,
            unsupportedModel,
            mockController,
            mockSetChatItems,
            mockSetIsProcessingQuery
          )
        ).rejects.toThrow(`Unsupported model: ${unsupportedModel}. Supported models are: Open AI, Ollama`);

        expect(getOptsForChats).toHaveBeenCalledWith(sampleChatItems, unsupportedModel);
        expect(getOpenAIResponse).not.toHaveBeenCalled();
        expect(requestOllama).not.toHaveBeenCalled();
      });

      test('throws error for null model', async () => {
        await expect(
          fetchAndDecodeResponse(
            sampleChatItems,
            null,
            mockController,
            mockSetChatItems,
            mockSetIsProcessingQuery
          )
        ).rejects.toThrow('Unsupported model: null');
      });

      test('throws error for undefined model', async () => {
        await expect(
          fetchAndDecodeResponse(
            sampleChatItems,
            undefined,
            mockController,
            mockSetChatItems,
            mockSetIsProcessingQuery
          )
        ).rejects.toThrow('Unsupported model: undefined');
      });

      test('handles config generation errors', async () => {
        const configError = new Error('Invalid chat items');
        getOptsForChats.mockImplementation(() => {
          throw configError;
        });

        await expect(
          fetchAndDecodeResponse(
            sampleChatItems,
            MODELS.openAI,
            mockController,
            mockSetChatItems,
            mockSetIsProcessingQuery
          )
        ).rejects.toThrow('Invalid chat items');

        expect(getOptsForChats).toHaveBeenCalledWith(sampleChatItems, MODELS.openAI);
        expect(getOpenAIResponse).not.toHaveBeenCalled();
        expect(requestOllama).not.toHaveBeenCalled();
      });
    });

    describe('Parameter validation', () => {
      test('handles empty chat items array', async () => {
        await fetchAndDecodeResponse(
          [],
          MODELS.openAI,
          mockController,
          mockSetChatItems,
          mockSetIsProcessingQuery
        );

        expect(getOptsForChats).toHaveBeenCalledWith([], MODELS.openAI);
        expect(getOpenAIResponse).toHaveBeenCalled();
      });

      test('handles null chat items', async () => {
        await fetchAndDecodeResponse(
          null,
          MODELS.openAI,
          mockController,
          mockSetChatItems,
          mockSetIsProcessingQuery
        );

        expect(getOptsForChats).toHaveBeenCalledWith(null, MODELS.openAI);
      });

      test('handles undefined controller for OpenAI', async () => {
        await fetchAndDecodeResponse(
          sampleChatItems,
          MODELS.openAI,
          undefined,
          mockSetChatItems,
          mockSetIsProcessingQuery
        );

        // OpenAI doesn't use controller, so it should still work
        expect(getOpenAIResponse).toHaveBeenCalled();
        expect(decodeAndStreamResponseForOpenAI).toHaveBeenCalled();
      });

      test('handles undefined controller for Ollama', async () => {
        await fetchAndDecodeResponse(
          sampleChatItems,
          MODELS.ollama,
          undefined,
          mockSetChatItems,
          mockSetIsProcessingQuery
        );

        expect(requestOllama).toHaveBeenCalledWith(sampleOpts, undefined);
      });

      test('handles null callback functions', async () => {
        await fetchAndDecodeResponse(
          sampleChatItems,
          MODELS.openAI,
          mockController,
          null,
          null
        );

        expect(decodeAndStreamResponseForOpenAI).toHaveBeenCalledWith(
          expect.any(Object),
          null,
          null
        );
      });
    });

    describe('Integration behavior', () => {
      test('maintains correct call order for OpenAI', async () => {
        const callOrder = [];
        
        getOptsForChats.mockImplementation((...args) => {
          callOrder.push('getOptsForChats');
          return sampleOpts;
        });
        
        getOpenAIResponse.mockImplementation((...args) => {
          callOrder.push('getOpenAIResponse');
          return Promise.resolve({ ok: true });
        });
        
        decodeAndStreamResponseForOpenAI.mockImplementation((...args) => {
          callOrder.push('decodeAndStreamResponseForOpenAI');
          return Promise.resolve();
        });

        await fetchAndDecodeResponse(
          sampleChatItems,
          MODELS.openAI,
          mockController,
          mockSetChatItems,
          mockSetIsProcessingQuery
        );

        expect(callOrder).toEqual([
          'getOptsForChats',
          'getOpenAIResponse',
          'decodeAndStreamResponseForOpenAI',
        ]);
      });

      test('maintains correct call order for Ollama', async () => {
        const callOrder = [];
        
        getOptsForChats.mockImplementation((...args) => {
          callOrder.push('getOptsForChats');
          return sampleOpts;
        });
        
        requestOllama.mockImplementation((...args) => {
          callOrder.push('requestOllama');
          return Promise.resolve({ ok: true });
        });
        
        decodeAndStreamResponseForOllama.mockImplementation((...args) => {
          callOrder.push('decodeAndStreamResponseForOllama');
          return Promise.resolve();
        });

        await fetchAndDecodeResponse(
          sampleChatItems,
          MODELS.ollama,
          mockController,
          mockSetChatItems,
          mockSetIsProcessingQuery
        );

        expect(callOrder).toEqual([
          'getOptsForChats',
          'requestOllama',
          'decodeAndStreamResponseForOllama',
        ]);
      });

      test('passes through all parameters correctly', async () => {
        const customChatItems = [{ role: 'user', content: 'Custom message' }];
        const customController = { signal: { custom: true } };
        const customSetChatItems = jest.fn();
        const customSetIsProcessingQuery = jest.fn();

        await fetchAndDecodeResponse(
          customChatItems,
          MODELS.openAI,
          customController,
          customSetChatItems,
          customSetIsProcessingQuery
        );

        expect(getOptsForChats).toHaveBeenCalledWith(customChatItems, MODELS.openAI);
        expect(decodeAndStreamResponseForOpenAI).toHaveBeenCalledWith(
          expect.any(Object),
          customSetChatItems,
          customSetIsProcessingQuery
        );
      });
    });

    describe('Edge cases', () => {
      test('handles very large chat history', async () => {
        const largeChatItems = Array.from({ length: 1000 }, (_, i) => ({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: `Message ${i}`,
        }));

        await fetchAndDecodeResponse(
          largeChatItems,
          MODELS.openAI,
          mockController,
          mockSetChatItems,
          mockSetIsProcessingQuery
        );

        expect(getOptsForChats).toHaveBeenCalledWith(largeChatItems, MODELS.openAI);
        expect(getOpenAIResponse).toHaveBeenCalled();
      });

      test('handles chat items with special characters', async () => {
        const specialChatItems = [
          { role: 'user', content: 'Hello! 🚀 How are you?' },
          { role: 'assistant', content: 'I\'m doing well! "Thanks" for asking.' },
        ];

        await fetchAndDecodeResponse(
          specialChatItems,
          MODELS.openAI,
          mockController,
          mockSetChatItems,
          mockSetIsProcessingQuery
        );

        expect(getOptsForChats).toHaveBeenCalledWith(specialChatItems, MODELS.openAI);
      });

      test('handles concurrent requests', async () => {
        const requests = Array.from({ length: 3 }, (_, i) =>
          fetchAndDecodeResponse(
            [{ role: 'user', content: `Request ${i}` }],
            MODELS.openAI,
            mockController,
            mockSetChatItems,
            mockSetIsProcessingQuery
          )
        );

        await Promise.all(requests);

        expect(getOptsForChats).toHaveBeenCalledTimes(3);
        expect(getOpenAIResponse).toHaveBeenCalledTimes(3);
      });
    });
  });
});