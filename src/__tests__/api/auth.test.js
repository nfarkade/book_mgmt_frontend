import * as authAPI from '../../api/auth';
import api from '../../api/axios';

jest.mock('../../api/axios');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  describe('login', () => {
    test('saves token to localStorage on successful login', async () => {
      const mockResponse = {
        data: {
          access_token: 'test-token',
          roles: ['user'],
        },
      };
      
      api.post.mockResolvedValue(mockResponse);

      const result = await authAPI.login({ username: 'test', password: 'pass' });

      expect(api.post).toHaveBeenCalledWith('/auth/login', { username: 'test', password: 'pass' });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'test-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('userRoles', JSON.stringify(['user']));
      expect(localStorageMock.setItem).toHaveBeenCalledWith('username', 'test');
      expect(result).toEqual(mockResponse.data);
    });

    test('handles token in response.data.token format', async () => {
      const mockResponse = {
        data: {
          token: 'alternative-token',
          roles: ['admin'],
        },
      };
      
      api.post.mockResolvedValue(mockResponse);

      await authAPI.login({ username: 'admin', password: 'pass' });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'alternative-token');
    });

    test('handles empty roles array', async () => {
      const mockResponse = {
        data: {
          access_token: 'test-token',
          roles: [],
        },
      };
      
      api.post.mockResolvedValue(mockResponse);

      await authAPI.login({ username: 'test', password: 'pass' });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('userRoles', JSON.stringify([]));
    });

    test('handles missing token in response', async () => {
      const mockResponse = {
        data: {
          message: 'Login successful',
        },
      };
      
      api.post.mockResolvedValue(mockResponse);

      await authAPI.login({ username: 'test', password: 'pass' });

      expect(console.error).toHaveBeenCalled();
    });

    test('throws error on 401 unauthorized', async () => {
      api.post.mockRejectedValue({ response: { status: 401 } });

      await expect(authAPI.login({ username: 'test', password: 'wrong' })).rejects.toThrow('Invalid credentials or access denied');
    });

    test('throws error on 403 forbidden', async () => {
      api.post.mockRejectedValue({ response: { status: 403 } });

      await expect(authAPI.login({ username: 'test', password: 'pass' })).rejects.toThrow('Invalid credentials or access denied');
    });

    test('uses mock login on network error', async () => {
      api.post.mockRejectedValue({ message: 'Network Error' });

      const result = await authAPI.login({ username: 'testuser', password: 'pass' });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', expect.stringContaining('mock-jwt-token'));
      expect(localStorageMock.setItem).toHaveBeenCalledWith('userRoles', JSON.stringify(['user']));
      expect(localStorageMock.setItem).toHaveBeenCalledWith('username', 'testuser');
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
    });

    test('uses mock login on ECONNREFUSED error', async () => {
      api.post.mockRejectedValue({ code: 'ECONNREFUSED' });

      const result = await authAPI.login({ username: 'testuser', password: 'pass' });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', expect.stringContaining('mock-jwt-token'));
      expect(result).toHaveProperty('access_token');
    });

    test('assigns admin role for admin username on mock login', async () => {
      api.post.mockRejectedValue({ message: 'Network Error' });

      await authAPI.login({ username: 'admin', password: 'pass' });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('userRoles', JSON.stringify(['admin']));
    });

    test('uses mock login on 500 server error', async () => {
      api.post.mockRejectedValue({ response: { status: 500 } });

      const result = await authAPI.login({ username: 'testuser', password: 'pass' });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', expect.stringContaining('mock-jwt-token'));
      expect(result).toHaveProperty('access_token');
    });

    test('throws other errors', async () => {
      const error = new Error('Unknown error');
      api.post.mockRejectedValue(error);

      await expect(authAPI.login({ username: 'test', password: 'pass' })).rejects.toThrow('Unknown error');
    });
  });

  describe('signup', () => {
    test('calls signup API endpoint', async () => {
      const signupData = { username: 'newuser', password: 'password123', email: 'user@example.com' };
      api.post.mockResolvedValue({ data: { message: 'User created successfully' } });

      const result = await authAPI.signup(signupData);

      expect(api.post).toHaveBeenCalledWith('/auth/signup', signupData);
      expect(result.data).toHaveProperty('message');
    });

    test('handles signup error', async () => {
      const signupData = { username: 'existinguser', password: 'password123' };
      api.post.mockRejectedValue({ response: { status: 409, data: { detail: 'Username already exists' } } });

      await expect(authAPI.signup(signupData)).rejects.toBeDefined();
    });
  });

  describe('logout', () => {
    test('removes token from localStorage', () => {
      authAPI.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userRoles');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('username');
    });

    test('can be called multiple times safely', () => {
      authAPI.logout();
      authAPI.logout();
      authAPI.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(9); // 3 calls × 3 items
    });
  });

  describe('isAdmin', () => {
    test('returns true for admin role', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['admin']));
      
      expect(authAPI.isAdmin()).toBe(true);
    });

    test('returns false for non-admin role', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['user']));
      
      expect(authAPI.isAdmin()).toBe(false);
    });

    test('returns false when roles array does not include admin', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['user', 'writer']));
      
      expect(authAPI.isAdmin()).toBe(false);
    });

    test('returns false when userRoles is empty', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([]));
      
      expect(authAPI.isAdmin()).toBe(false);
    });

    test('returns false when userRoles is null', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      expect(authAPI.isAdmin()).toBe(false);
    });

    test('handles invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      expect(() => authAPI.isAdmin()).not.toThrow();
      expect(authAPI.isAdmin()).toBe(false);
    });
  });

  describe('getUserRoles', () => {
    test('returns parsed roles', () => {
      const roles = ['user', 'writer'];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(roles));
      
      expect(authAPI.getUserRoles()).toEqual(roles);
    });

    test('returns empty array when userRoles is null', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      expect(authAPI.getUserRoles()).toEqual([]);
    });

    test('returns empty array when userRoles is empty string', () => {
      localStorageMock.getItem.mockReturnValue('');
      
      expect(authAPI.getUserRoles()).toEqual([]);
    });

    test('handles invalid JSON gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      expect(() => authAPI.getUserRoles()).not.toThrow();
      expect(authAPI.getUserRoles()).toEqual([]);
    });

    test('returns single role array', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['admin']));
      
      expect(authAPI.getUserRoles()).toEqual(['admin']);
    });
  });
});
