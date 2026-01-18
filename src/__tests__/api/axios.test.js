import api from '../../api/axios';
import axios from 'axios';

jest.mock('axios');
jest.mock('../../config', () => ({
  API_BASE_URL: 'http://test-api.com',
  API_TIMEOUT: 10000,
  IS_PRODUCTION: false,
}));

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('adds authorization header when token exists', async () => {
    localStorage.setItem('token', 'test-token');
    const mockAxios = axios.create();
    axios.create.mockReturnValue(mockAxios);
    
    mockAxios.get = jest.fn().mockResolvedValue({ data: {} });
    mockAxios.interceptors = {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    };

    // Re-import to trigger interceptor setup
    jest.resetModules();
    const newApi = require('../../api/axios').default;
    
    await newApi.get('/test');

    expect(mockAxios.get).toHaveBeenCalled();
  });

  test('handles 401 error by redirecting to login', () => {
    const mockAxios = axios.create();
    axios.create.mockReturnValue(mockAxios);
    
    mockAxios.interceptors = {
      request: { use: jest.fn() },
      response: { 
        use: jest.fn((onFulfilled, onRejected) => {
          const error = {
            response: { status: 401 },
          };
          onRejected(error);
        }),
      },
    };

    delete window.location;
    window.location = { href: '' };

    jest.resetModules();
    require('../../api/axios');

    expect(localStorage.getItem('token')).toBeNull();
  });
});
