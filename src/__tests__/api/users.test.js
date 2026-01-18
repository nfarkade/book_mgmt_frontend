import * as usersAPI from '../../api/users';
import api from '../../api/axios';

jest.mock('../../api/axios');

describe('Users API', () => {
  const mockUsers = [
    { id: 1, username: 'admin', email: 'admin@example.com', role: 'Admin', status: 'Active' },
    { id: 2, username: 'user1', email: 'user1@example.com', role: 'User', status: 'Active' },
  ];

  const mockRoles = [
    { id: 1, name: 'admin', can_read: true, can_write: true, can_delete: true, is_admin: true },
    { id: 2, name: 'user', can_read: true, can_write: false, can_delete: false, is_admin: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    test('fetches users successfully', async () => {
      api.get.mockResolvedValue({ data: mockUsers });

      const result = await usersAPI.getUsers();

      expect(api.get).toHaveBeenCalledWith('/admin/users/');
      expect(result.data).toEqual(mockUsers);
    });

    test('returns mock data on network error', async () => {
      api.get.mockRejectedValue({ message: 'Network Error' });

      const result = await usersAPI.getUsers();

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('createUser', () => {
    test('creates user successfully', async () => {
      const userData = { username: 'newuser', password: 'password123', role_names: ['user'] };
      api.post.mockResolvedValue({ data: { id: 3, ...userData } });

      const result = await usersAPI.createUser(userData);

      expect(api.post).toHaveBeenCalledWith('/admin/users/', userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000,
      });
      expect(result.data).toHaveProperty('id');
    });

    test('throws error on failure', async () => {
      const userData = { username: 'newuser', password: 'password123' };
      api.post.mockRejectedValue({ response: { status: 400, data: { detail: 'Invalid data' } } });

      await expect(usersAPI.createUser(userData)).rejects.toBeDefined();
    });
  });

  describe('updateUser', () => {
    test('updates user successfully', async () => {
      const updateData = { email: 'updated@example.com' };
      api.put.mockResolvedValue({ data: { id: 1, ...updateData } });

      const result = await usersAPI.updateUser(1, updateData);

      expect(api.put).toHaveBeenCalledWith('/admin/users/1/', updateData);
      expect(result.data).toHaveProperty('id', 1);
    });

    test('returns mock data on network error', async () => {
      api.put.mockRejectedValue({ message: 'Network Error' });

      const result = await usersAPI.updateUser(1, { email: 'test@example.com' });

      expect(result.data).toBeDefined();
    });
  });

  describe('deleteUser', () => {
    test('deletes user successfully', async () => {
      api.delete.mockResolvedValue({ data: { message: 'User deleted successfully' } });

      const result = await usersAPI.deleteUser(1);

      expect(api.delete).toHaveBeenCalledWith('/admin/users/1/');
      expect(result.data).toHaveProperty('message');
    });

    test('returns mock data on network error', async () => {
      api.delete.mockRejectedValue({ message: 'Network Error' });

      const result = await usersAPI.deleteUser(1);

      expect(result.data).toBeDefined();
    });
  });

  describe('getRoles', () => {
    test('fetches roles successfully', async () => {
      api.get.mockResolvedValue({ data: mockRoles });

      const result = await usersAPI.getRoles();

      expect(api.get).toHaveBeenCalledWith('/admin/users/roles');
      expect(result.data).toEqual(mockRoles);
    });

    test('returns mock data on network error', async () => {
      api.get.mockRejectedValue({ message: 'Network Error' });

      const result = await usersAPI.getRoles();

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('createRole', () => {
    test('creates role successfully', async () => {
      const roleData = { name: 'editor', can_read: true, can_write: true };
      api.post.mockResolvedValue({ data: { id: 3, ...roleData } });

      const result = await usersAPI.createRole(roleData);

      expect(api.post).toHaveBeenCalledWith('/admin/users/roles', roleData);
      expect(result.data).toHaveProperty('id');
    });

    test('throws error on failure', async () => {
      const roleData = { name: 'editor' };
      api.post.mockRejectedValue({ response: { status: 400 } });

      await expect(usersAPI.createRole(roleData)).rejects.toBeDefined();
    });
  });

  describe('updateRole', () => {
    test('updates role successfully', async () => {
      const roleData = { name: 'updated_role', can_read: true };
      api.put.mockResolvedValue({ data: { id: 1, ...roleData } });

      const result = await usersAPI.updateRole(1, roleData);

      expect(api.put).toHaveBeenCalledWith('/admin/users/roles/1', roleData);
      expect(result.data).toHaveProperty('id', 1);
    });

    test('throws error on failure', async () => {
      const roleData = { name: 'updated_role' };
      api.put.mockRejectedValue({ response: { status: 404 } });

      await expect(usersAPI.updateRole(1, roleData)).rejects.toBeDefined();
    });
  });

  describe('deleteRole', () => {
    test('deletes role successfully', async () => {
      api.delete.mockResolvedValue({ data: { message: 'Role deleted successfully' } });

      const result = await usersAPI.deleteRole(1);

      expect(api.delete).toHaveBeenCalledWith('/admin/roles/1');
      expect(result.data).toHaveProperty('message');
    });

    test('returns mock data on network error', async () => {
      api.delete.mockRejectedValue({ message: 'Network Error' });

      const result = await usersAPI.deleteRole(1);

      expect(result.data).toBeDefined();
    });
  });
});
