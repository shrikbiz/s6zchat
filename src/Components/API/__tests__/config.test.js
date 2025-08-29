import {
  MODELS,
  MODELS_MODEL_ID_MAPPING,
  getOptsForChats,
  getOptsForTitle,
} from '../config';

describe('API Configuration', () => {
  describe('MODELS constant', () => {
    test('contains expected model types', () => {
      expect(MODELS).toEqual({
        openAI: 'Open AI',
        ollama: 'Ollama',
      });
    });

    test('model values are strings', () => {
      Object.values(MODELS).forEach(model => {
        expect(typeof model).toBe('string');
        expect(model.length).toBeGreaterThan(0);
      });
    });

    test('model keys are camelCase', () => {
      Object.keys(MODELS).forEach(key => {
        expect(key).toMatch(/^[a-z][a-zA-Z]*$/);
      });
    });
  });

  describe('MODELS_MODEL_ID_MAPPING constant', () => {
    test('contains mapping for all model types', () => {
      expect(MODELS_MODEL_ID_MAPPING).toEqual({
        'Open AI': 'gpt-4.1',
        'Ollama': 'gemma3:latest',
      });
    });

    test('has mappings for all MODELS values', () => {
      Object.values(MODELS).forEach(modelName => {
        expect(MODELS_MODEL_ID_MAPPING[modelName]).toBeDefined();
        expect(typeof MODELS_MODEL_ID_MAPPING[modelName]).toBe('string');
      });
    });

    test('model IDs are valid strings', () => {
      Object.values(MODELS_MODEL_ID_MAPPING).forEach(modelId => {
        expect(typeof modelId).toBe('string');
        expect(modelId.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getOptsForChats function', () => {
    const sampleContent = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
      { role: 'user', content: 'How are you?' },
    ];

    describe('OpenAI configuration', () => {
      test('returns correct configuration for OpenAI', () => {
        const result = getOptsForChats(sampleContent, MODELS.openAI);
        
        expect(result).toEqual({
          model: 'gpt-4.1',
          input: [
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi there!' },
            { role: 'user', content: 'How are you?' },
          ],
          stream: true,
        });
      });

      test('handles content with type property', () => {
        const contentWithType = [
          { role: 'user', content: 'Hello', type: 'text' },
          { role: 'assistant', content: 'Hi!', type: 'response' },
        ];
        
        const result = getOptsForChats(contentWithType, MODELS.openAI);
        
        expect(result.input).toEqual([
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi!' },
        ]);
      });

      test('uses gpt-4.1 model by default', () => {
        const result = getOptsForChats(sampleContent, MODELS.openAI);
        expect(result.model).toBe('gpt-4.1');
      });

      test('enables streaming by default', () => {
        const result = getOptsForChats(sampleContent, MODELS.openAI);
        expect(result.stream).toBe(true);
      });

      test('handles empty content array', () => {
        const result = getOptsForChats([], MODELS.openAI);
        
        expect(result).toEqual({
          model: 'gpt-4.1',
          input: [],
          stream: true,
        });
      });
    });

    describe('Ollama configuration', () => {
      test('returns correct configuration for Ollama', () => {
        const result = getOptsForChats(sampleContent, MODELS.ollama);
        
        expect(result).toEqual({
          model: 'gemma3:latest',
          messages: sampleContent,
        });
      });

      test('preserves original content structure', () => {
        const contentWithExtra = [
          { role: 'user', content: 'Hello', timestamp: '2023-01-01' },
          { role: 'assistant', content: 'Hi!', id: 'msg-123' },
        ];
        
        const result = getOptsForChats(contentWithExtra, MODELS.ollama);
        expect(result.messages).toEqual(contentWithExtra);
      });

      test('handles empty content array', () => {
        const result = getOptsForChats([], MODELS.ollama);
        
        expect(result).toEqual({
          model: 'gemma3:latest',
          messages: [],
        });
      });
    });

    describe('Error handling', () => {
      test('throws error for unsupported model', () => {
        expect(() => {
          getOptsForChats(sampleContent, 'UnsupportedModel');
        }).toThrow('Unsupported model: UnsupportedModel. Supported models are: Open AI, Ollama');
      });

      test('throws error for null model', () => {
        expect(() => {
          getOptsForChats(sampleContent, null);
        }).toThrow('Unsupported model: null');
      });

      test('throws error for undefined model', () => {
        expect(() => {
          getOptsForChats(sampleContent, undefined);
        }).toThrow('Unsupported model: undefined');
      });

      test('throws error for empty string model', () => {
        expect(() => {
          getOptsForChats(sampleContent, '');
        }).toThrow('Unsupported model: ');
      });
    });

    describe('Edge cases', () => {
      test('handles content with null values', () => {
        const contentWithNulls = [
          { role: 'user', content: null },
          { role: 'assistant', content: '' },
        ];
        
        expect(() => {
          getOptsForChats(contentWithNulls, MODELS.openAI);
        }).not.toThrow();
      });

      test('handles content with special characters', () => {
        const specialContent = [
          { role: 'user', content: 'Hello! 🚀 How are you?' },
          { role: 'assistant', content: 'I\'m doing well! "Thanks" for asking.' },
        ];
        
        const result = getOptsForChats(specialContent, MODELS.openAI);
        expect(result.input).toEqual([
          { role: 'user', content: 'Hello! 🚀 How are you?' },
          { role: 'assistant', content: 'I\'m doing well! "Thanks" for asking.' },
        ]);
      });
    });
  });

  describe('getOptsForTitle function', () => {
    describe('Valid inputs', () => {
      test('returns correct configuration for OpenAI title generation', () => {
        const userMsg = 'How do I implement authentication?';
        const result = getOptsForTitle(userMsg, MODELS.openAI);
        
        expect(result).toEqual({
          model: 'gpt-4.1',
          prompt: `Generate a short and descriptive title for a conversation based on this user's message:\n\nUser: "How do I implement authentication?"\n\nThe title should be concise (3 to 6 words), clearly describe the topic, and avoid punctuation.\n\nTitle:`,
          stream: false,
        });
      });

      test('returns correct configuration for Ollama title generation', () => {
        const userMsg = 'What is React?';
        const result = getOptsForTitle(userMsg, MODELS.ollama);
        
        expect(result).toEqual({
          model: 'gemma3:latest',
          prompt: `Generate a short and descriptive title for a conversation based on this user's message:\n\nUser: "What is React?"\n\nThe title should be concise (3 to 6 words), clearly describe the topic, and avoid punctuation.\n\nTitle:`,
          stream: false,
        });
      });

      test('disables streaming for title generation', () => {
        const result = getOptsForTitle('Test message', MODELS.openAI);
        expect(result.stream).toBe(false);
      });

      test('handles empty user message', () => {
        const result = getOptsForTitle('', MODELS.openAI);
        expect(result.prompt).toContain('User: ""');
      });

      test('handles user message with quotes', () => {
        const userMsg = 'What is "machine learning"?';
        const result = getOptsForTitle(userMsg, MODELS.openAI);
        expect(result.prompt).toContain(`User: "What is "machine learning"?"`);
      });

      test('handles user message with special characters', () => {
        const userMsg = 'How to use React hooks? 🚀';
        const result = getOptsForTitle(userMsg, MODELS.openAI);
        expect(result.prompt).toContain('User: "How to use React hooks? 🚀"');
      });
    });

    describe('Error handling', () => {
      test('throws error for unsupported model', () => {
        expect(() => {
          getOptsForTitle('Test message', 'UnsupportedModel');
        }).toThrow('Unsupported model: UnsupportedModel. Supported models are: Open AI, Ollama');
      });

      test('throws error for null model', () => {
        expect(() => {
          getOptsForTitle('Test message', null);
        }).toThrow('Unsupported model: null');
      });

      test('throws error for undefined model', () => {
        expect(() => {
          getOptsForTitle('Test message', undefined);
        }).toThrow('Unsupported model: undefined');
      });

      test('throws error for empty string model', () => {
        expect(() => {
          getOptsForTitle('Test message', '');
        }).toThrow('Unsupported model: ');
      });
    });

    describe('Prompt generation', () => {
      test('generates consistent prompt format', () => {
        const userMsg = 'Test message';
        const result = getOptsForTitle(userMsg, MODELS.openAI);
        
        expect(result.prompt).toContain('Generate a short and descriptive title');
        expect(result.prompt).toContain('User: "Test message"');
        expect(result.prompt).toContain('concise (3 to 6 words)');
        expect(result.prompt).toContain('avoid punctuation');
        expect(result.prompt).toContain('Title:');
      });

      test('handles long user messages', () => {
        const longMsg = 'This is a very long user message that contains multiple sentences and goes on for quite a while to test how the title generation handles lengthy input text.';
        const result = getOptsForTitle(longMsg, MODELS.openAI);
        
        expect(result.prompt).toContain(`User: "${longMsg}"`);
      });

      test('handles multiline user messages', () => {
        const multilineMsg = 'First line\nSecond line\nThird line';
        const result = getOptsForTitle(multilineMsg, MODELS.openAI);
        
        expect(result.prompt).toContain(`User: "${multilineMsg}"`);
      });
    });

    describe('Edge cases', () => {
      test('handles null user message', () => {
        expect(() => {
          getOptsForTitle(null, MODELS.openAI);
        }).not.toThrow();
      });

      test('handles undefined user message', () => {
        expect(() => {
          getOptsForTitle(undefined, MODELS.openAI);
        }).not.toThrow();
      });

      test('handles numeric user message', () => {
        const result = getOptsForTitle(123, MODELS.openAI);
        expect(result.prompt).toContain('User: "123"');
      });

      test('handles boolean user message', () => {
        const result = getOptsForTitle(true, MODELS.openAI);
        expect(result.prompt).toContain('User: "true"');
      });
    });
  });

  describe('Integration tests', () => {
    test('models constants work with functions', () => {
      Object.values(MODELS).forEach(model => {
        expect(() => {
          getOptsForChats([{ role: 'user', content: 'test' }], model);
        }).not.toThrow();

        expect(() => {
          getOptsForTitle('test message', model);
        }).not.toThrow();
      });
    });

    test('model mappings are consistent', () => {
      Object.values(MODELS).forEach(modelName => {
        expect(MODELS_MODEL_ID_MAPPING[modelName]).toBeDefined();
      });
    });

    test('configuration objects have required properties', () => {
      const chatOpts = getOptsForChats([{ role: 'user', content: 'test' }], MODELS.openAI);
      expect(chatOpts).toHaveProperty('model');
      expect(chatOpts).toHaveProperty('stream');

      const titleOpts = getOptsForTitle('test', MODELS.openAI);
      expect(titleOpts).toHaveProperty('model');
      expect(titleOpts).toHaveProperty('prompt');
      expect(titleOpts).toHaveProperty('stream');
    });
  });
});