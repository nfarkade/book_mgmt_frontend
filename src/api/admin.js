import api from "./axios";

export const getUsers = () =>
  api.get("/admin/users");

export const updateUserRole = (id, role) =>
  api.post(`/admin/users/${id}/role`, { role });

export const deleteUser = (id) =>
  api.delete(`/admin/users/${id}`);
