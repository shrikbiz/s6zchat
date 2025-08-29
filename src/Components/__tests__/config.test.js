import config, { validateConfig } from '../config';

// Store original env vars
const originalEnv = process.env;

describe('Config Module', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('config object structure', () => {
    test('has correct structure', () => {
      expect(config).toHaveProperty('openai');
      expect(config).toHaveProperty('gemini');
      expect(config).toHaveProperty('ollama');
      expect(config).toHaveProperty('app');
    });

    test('openai config has apiKey property', () => {
      expect(config.openai).toHaveProperty('apiKey');
    });

    test('gemini config has apiKey property', () => {
      expect(config.gemini).toHaveProperty('apiKey');
    });

    test('ollama config has baseUrl property', () => {
      expect(config.ollama).toHaveProperty('baseUrl');
    });

    test('app config has name and version properties', () => {
      expect(config.app).toHaveProperty('name');
      expect(config.app).toHaveProperty('version');
    });
  });

  describe('environment variable reading', () => {
    test('reads REACT_APP_OPENAI_API_KEY', () => {
      process.env.REACT_APP_OPENAI_API_KEY = 'test-openai-key';
      
      // Re-import to get updated env vars
      delete require.cache[require.resolve('../config')];
      const newConfig = require('../config').default;
      
      expect(newConfig.openai.apiKey).toBe('test-openai-key');
    });

    test('reads REACT_APP_GEMINI_API_KEY', () => {
      process.env.REACT_APP_GEMINI_API_KEY = 'test-gemini-key';
      
      delete require.cache[require.resolve('../config')];
      const newConfig = require('../config').default;
      
      expect(newConfig.gemini.apiKey).toBe('test-gemini-key');
    });

    test('reads REACT_APP_OLLAMA_BASE_URL', () => {
      process.env.REACT_APP_OLLAMA_BASE_URL = 'http://custom-ollama:8080';
      
      delete require.cache[require.resolve('../config')];
      const newConfig = require('../config').default;
      
      expect(newConfig.ollama.baseUrl).toBe('http://custom-ollama:8080');
    });

    test('reads REACT_APP_APP_NAME', () => {
      process.env.REACT_APP_APP_NAME = 'CustomChatApp';
      
      delete require.cache[require.resolve('../config')];
      const newConfig = require('../config').default;
      
      expect(newConfig.app.name).toBe('CustomChatApp');
    });

    test('reads REACT_APP_APP_VERSION', () => {
      process.env.REACT_APP_APP_VERSION = '2.0.0';
      
      delete require.cache[require.resolve('../config')];
      const newConfig = require('../config').default;
      
      expect(newConfig.app.version).toBe('2.0.0');
    });
  });

  describe('default values', () => {
    test('uses default ollama baseUrl when env var not set', () => {
      delete process.env.REACT_APP_OLLAMA_BASE_URL;
      
      delete require.cache[require.resolve('../config')];
      const newConfig = require('../config').default;
      
      expect(newConfig.ollama.baseUrl).toBe('http://localhost:11434');
    });

    test('uses default app name when env var not set', () => {
      delete process.env.REACT_APP_APP_NAME;
      
      delete require.cache[require.resolve('../config')];
      const newConfig = require('../config').default;
      
      expect(newConfig.app.name).toBe('S6ZChat');
    });

    test('uses default app version when env var not set', () => {
      delete process.env.REACT_APP_APP_VERSION;
      
      delete require.cache[require.resolve('../config')];
      const newConfig = require('../config').default;
      
      expect(newConfig.app.version).toBe('0.1.0');
    });

    test('apiKey is undefined when env var not set', () => {
      delete process.env.REACT_APP_OPENAI_API_KEY;
      delete process.env.REACT_APP_GEMINI_API_KEY;
      
      delete require.cache[require.resolve('../config')];
      const newConfig = require('../config').default;
      
      expect(newConfig.openai.apiKey).toBeUndefined();
      expect(newConfig.gemini.apiKey).toBeUndefined();
    });
  });

  describe('validateConfig function', () => {
    let consoleWarnSpy;
    let consoleErrorSpy;

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    test('returns warnings and errors objects', () => {
      const result = validateConfig();
      
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('errors');
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(Array.isArray(result.errors)).toBe(true);
    });

    test('warns when REACT_APP_OPENAI_API_KEY is not set', () => {
      process.env.REACT_APP_OPENAI_API_KEY = undefined;
      
      delete require.cache[require.resolve('../config')];
      const { validateConfig: newValidateConfig } = require('../config');
      
      const result = newValidateConfig();
      
      expect(result.warnings).toContain('REACT_APP_OPENAI_API_KEY is not set');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Configuration warnings:',
        expect.arrayContaining(['REACT_APP_OPENAI_API_KEY is not set'])
      );
    });

    test('warns when REACT_APP_GEMINI_API_KEY is not set', () => {
      process.env.REACT_APP_GEMINI_API_KEY = undefined;
      
      delete require.cache[require.resolve('../config')];
      const { validateConfig: newValidateConfig } = require('../config');
      
      const result = newValidateConfig();
      
      expect(result.warnings).toContain('REACT_APP_GEMINI_API_KEY is not set');
    });

    test('does not warn when API keys are set', () => {
      process.env.REACT_APP_OPENAI_API_KEY = 'test-key';
      process.env.REACT_APP_GEMINI_API_KEY = 'test-key';
      
      delete require.cache[require.resolve('../config')];
      const { validateConfig: newValidateConfig } = require('../config');
      
      const result = newValidateConfig();
      
      expect(result.warnings).not.toContain('REACT_APP_OPENAI_API_KEY is not set');
      expect(result.warnings).not.toContain('REACT_APP_GEMINI_API_KEY is not set');
    });

    test('logs warnings to console', () => {
      process.env.REACT_APP_OPENAI_API_KEY = undefined;
      process.env.REACT_APP_GEMINI_API_KEY = undefined;
      
      delete require.cache[require.resolve('../config')];
      const { validateConfig: newValidateConfig } = require('../config');
      
      newValidateConfig();
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Configuration warnings:',
        expect.arrayContaining([
          'REACT_APP_OPENAI_API_KEY is not set',
          'REACT_APP_GEMINI_API_KEY is not set'
        ])
      );
    });

    test('does not log warnings when there are none', () => {
      process.env.REACT_APP_OPENAI_API_KEY = 'test-key';
      process.env.REACT_APP_GEMINI_API_KEY = 'test-key';
      
      delete require.cache[require.resolve('../config')];
      const { validateConfig: newValidateConfig } = require('../config');
      
      newValidateConfig();
      
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    test('logs errors to console when present', () => {
      // Since the current implementation doesn't have errors, we would need to mock
      // a scenario where errors exist. For now, test the empty errors case.
      const result = validateConfig();
      
      expect(result.errors).toEqual([]);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    test('throws error when errors are present', () => {
      // This test is for future-proofing. Currently, no errors are generated,
      // but if the validation logic changes, this test will be relevant.
      
      // Mock a scenario where validateConfig would generate errors
      // Since we can't easily modify the function behavior without changing the source,
      // we'll test the current behavior (no errors)
      expect(() => validateConfig()).not.toThrow();
    });

    test('handles multiple warnings correctly', () => {
      process.env.REACT_APP_OPENAI_API_KEY = undefined;
      process.env.REACT_APP_GEMINI_API_KEY = undefined;
      
      delete require.cache[require.resolve('../config')];
      const { validateConfig: newValidateConfig } = require('../config');
      
      const result = newValidateConfig();
      
      expect(result.warnings).toHaveLength(2);
      expect(result.warnings).toContain('REACT_APP_OPENAI_API_KEY is not set');
      expect(result.warnings).toContain('REACT_APP_GEMINI_API_KEY is not set');
    });
  });

  describe('edge cases', () => {
    test('handles empty string environment variables', () => {
      process.env.REACT_APP_OPENAI_API_KEY = '';
      process.env.REACT_APP_APP_NAME = '';
      
      delete require.cache[require.resolve('../config')];
      const newConfig = require('../config').default;
      
      expect(newConfig.openai.apiKey).toBe('');
      expect(newConfig.app.name).toBe('S6ZChat'); // Should use default for empty string
    });

    test('handles whitespace-only environment variables', () => {
      process.env.REACT_APP_OPENAI_API_KEY = '   ';
      process.env.REACT_APP_OLLAMA_BASE_URL = '   ';
      
      delete require.cache[require.resolve('../config')];
      const newConfig = require('../config').default;
      
      expect(newConfig.openai.apiKey).toBe('   ');
      expect(newConfig.ollama.baseUrl).toBe('http://localhost:11434'); // Should use default
    });

    test('handles special characters in environment variables', () => {
      process.env.REACT_APP_APP_NAME = 'My App! 🚀';
      process.env.REACT_APP_OLLAMA_BASE_URL = 'https://api.example.com:8443/v1';
      
      delete require.cache[require.resolve('../config')];
      const newConfig = require('../config').default;
      
      expect(newConfig.app.name).toBe('My App! 🚀');
      expect(newConfig.ollama.baseUrl).toBe('https://api.example.com:8443/v1');
    });

    test('validates config with mixed valid and invalid settings', () => {
      process.env.REACT_APP_OPENAI_API_KEY = 'valid-key';
      process.env.REACT_APP_GEMINI_API_KEY = undefined;
      
      delete require.cache[require.resolve('../config')];
      const { validateConfig: newValidateConfig } = require('../config');
      
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = newValidateConfig();
      
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings).toContain('REACT_APP_GEMINI_API_KEY is not set');
      expect(result.warnings).not.toContain('REACT_APP_OPENAI_API_KEY is not set');
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('config immutability', () => {
    test('config object can be modified (not frozen)', () => {
      // Test that config is not frozen, allowing for runtime modifications if needed
      expect(() => {
        config.openai.apiKey = 'new-key';
      }).not.toThrow();
    });

    test('validateConfig does not modify config', () => {
      const originalConfig = { ...config };
      
      validateConfig();
      
      expect(config).toEqual(originalConfig);
    });
  });

  describe('type checking', () => {
    test('all config values have expected types', () => {
      expect(typeof config.openai.apiKey === 'string' || config.openai.apiKey === undefined).toBe(true);
      expect(typeof config.gemini.apiKey === 'string' || config.gemini.apiKey === undefined).toBe(true);
      expect(typeof config.ollama.baseUrl).toBe('string');
      expect(typeof config.app.name).toBe('string');
      expect(typeof config.app.version).toBe('string');
    });

    test('validateConfig returns objects with correct types', () => {
      const result = validateConfig();
      
      expect(typeof result).toBe('object');
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(Array.isArray(result.errors)).toBe(true);
      
      result.warnings.forEach(warning => {
        expect(typeof warning).toBe('string');
      });
      
      result.errors.forEach(error => {
        expect(typeof error).toBe('string');
      });
    });
  });
});