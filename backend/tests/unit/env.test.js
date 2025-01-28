const { getEnvVariable } = require ('../../config/env.js');

describe('Environment Variables', () => {

    test('should load environment variables', () => {
        expect(getEnvVariable('API_KEY')).toBe('mock_api_key');
    });

    test('should throw error for missing variable', () => {
        expect(() => getEnvVariable('MISSING_VARIABLE')).toThrow('Environment variable MISSING_VARIABLE is not set');
    });

})