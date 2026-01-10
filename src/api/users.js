import api from "./axios";

// Mock data for development
const mockUsers = [
  { id: 1, username: "admin", email: "admin@example.com", role: "Admin", status: "Active" },
  { id: 2, username: "user1", email: "user1@example.com", role: "User", status: "Active" },
  { id: 3, username: "user2", email: "user2@example.com", role: "Editor", status: "Inactive" }
];

const mockRoles = [
  { id: 1, name: "admin", can_read: true, can_write: false, can_delete: false, is_admin: false },
  { id: 2, name: "user", can_read: true, can_write: false, can_delete: false, is_admin: false }
];

let nextUserId = 4;
let nextRoleId = 4;

const handleApiError = async (apiCall, mockResponse) => {
  try {
    return await apiCall();
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ECONNREFUSED' || 
        error.response?.status === 500 || error.response?.status === 404 || 
        error.response?.status === 403 || error.response?.status === 400) {
      console.warn('Backend not available or error, using mock data');
      return { data: mockResponse };
    }
    throw error;
  }
};

// Users API
export const getUsers = () => handleApiError(
  () => api.get("/admin/users/"),
  mockUsers
);

export const createUser = (userData) => {
  console.log('Creating user with data:', userData);
  return api.post("/admin/users/", userData, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 10000 // 10 second timeout
  });
};

export const updateUser = (id, userData) => handleApiError(
  () => api.put(`/admin/users/${id}/`, userData),
  (() => {
    const index = mockUsers.findIndex(user => user.id === parseInt(id));
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...userData };
      return mockUsers[index];
    }
    return null;
  })()
);

export const deleteUser = (id) => handleApiError(
  () => api.delete(`/admin/users/${id}/`),
  (() => {
    const index = mockUsers.findIndex(user => user.id === parseInt(id));
    if (index !== -1) {
      mockUsers.splice(index, 1);
      return { message: 'User deleted successfully' };
    }
    return null;
  })()
);

// Roles API
export const getRoles = () => handleApiError(
  () => api.get("/admin/users/roles"),
  mockRoles
);

export const createRole = (roleData) => {
  console.log('Creating role with data:', roleData);
  return api.post("/admin/users/roles", roleData);
};

export const updateRole = (id, roleData) => {
  console.log('Updating role with data:', roleData);
  return api.put(`/admin/users/roles/${id}`, roleData);
};

export const deleteRole = (id) => handleApiError(
  () => api.delete(`/admin/roles/${id}`),
  (() => {
    const index = mockRoles.findIndex(role => role.id === parseInt(id));
    if (index !== -1) {
      mockRoles.splice(index, 1);
      return { message: 'Role deleted successfully' };
    }
    return null;
  })()
);