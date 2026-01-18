import * as adminAPI from '../../api/admin';
import api from '../../api/axios';

jest.mock('../../api/axios');

describe('Admin API', () => {
  const mockUsers = [
    { id: 1, username: 'user1', role: 'admin' },
    { id: 2, username: 'user2', role: 'user' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    test('fetches users successfully', async () => {
      api.get.mockResolvedValue({ data: mockUsers });

      const result = await adminAPI.getUsers();

      expect(api.get).toHaveBeenCalledWith('/admin/users');
      expect(result.data).toEqual(mockUsers);
    });

    test('handles API error', async () => {
      api.get.mockRejectedValue({ response: { status: 500 } });

      await expect(adminAPI.getUsers()).rejects.toBeDefined();
    });
  });

  describe('updateUserRole', () => {
    test('updates user role successfully', async () => {
      api.post.mockResolvedValue({ data: { id: 1, role: 'admin' } });

      const result = await adminAPI.updateUserRole(1, 'admin');

      expect(api.post).toHaveBeenCalledWith('/admin/users/1/role', { role: 'admin' });
      expect(result.data).toHaveProperty('role', 'admin');
    });

    test('handles API error', async () => {
      api.post.mockRejectedValue({ response: { status: 404 } });

      await expect(adminAPI.updateUserRole(1, 'admin')).rejects.toBeDefined();
    });
  });

  describe('deleteUser', () => {
    test('deletes user successfully', async () => {
      api.delete.mockResolvedValue({ data: { message: 'User deleted' } });

      const result = await adminAPI.deleteUser(1);

      expect(api.delete).toHaveBeenCalledWith('/admin/users/1');
      expect(result.data).toHaveProperty('message');
    });

    test('handles API error', async () => {
      api.delete.mockRejectedValue({ response: { status: 404 } });

      await expect(adminAPI.deleteUser(1)).rejects.toBeDefined();
    });
  });
});
