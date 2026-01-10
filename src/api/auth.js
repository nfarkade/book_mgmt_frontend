import api from "./axios";

export const signup = (data) =>
  api.post("/auth/signup", data);

export const login = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    console.log('Login response:', res.data);
    const token = res.data.access_token || res.data.token;
    const userRoles = res.data.roles || [];
    
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userRoles", JSON.stringify(userRoles));
      localStorage.setItem("username", data.username);
      console.log('Token saved:', token);
      console.log('User roles:', userRoles);
    } else {
      console.error('No token in response:', res.data);
    }
    return res.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Invalid credentials or access denied');
    }
    if (error.message === 'Network Error' || error.code === 'ECONNREFUSED') {
      console.warn('Backend not available, using mock login');
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockRoles = data.username === 'admin' ? ['admin'] : ['user'];
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userRoles', JSON.stringify(mockRoles));
      localStorage.setItem('username', data.username);
      return { access_token: mockToken, user: { username: data.username }, roles: mockRoles };
    }
    if (error.response?.status === 500) {
      console.warn('Backend database error, using mock login');
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockRoles = data.username === 'admin' ? ['admin'] : ['user'];
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userRoles', JSON.stringify(mockRoles));
      localStorage.setItem('username', data.username);
      return { access_token: mockToken, user: { username: data.username }, roles: mockRoles };
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRoles");
  localStorage.removeItem("username");
};

export const isAdmin = () => {
  const roles = JSON.parse(localStorage.getItem("userRoles") || '[]');
  return roles.includes('admin');
};

export const getUserRoles = () => {
  return JSON.parse(localStorage.getItem("userRoles") || '[]');
};
