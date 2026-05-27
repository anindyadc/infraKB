import client from './client';

export const getMe = async () => {
  const { data } = await client.get('/auth/me');
  return data.data;
};

export const getUsers = async (params: { page?: number; limit?: number; role?: string; search?: string }) => {
  const { data } = await client.get('/users', { params });
  return data;
};

export const createUser = async (payload: any) => {
  const { data } = await client.post('/auth/register', payload);
  return data.data;
};

export const updateUser = async (id: number, payload: { role?: string; isActive?: boolean; displayName?: string; password?: string }) => {
  const { data } = await client.put(`/users/${id}`, payload);
  return data.data;
};

export const deleteUser = async (id: number) => {
  const { data } = await client.delete(`/users/${id}`);
  return data.data;
};
