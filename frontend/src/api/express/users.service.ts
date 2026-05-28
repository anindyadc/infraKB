import client from '../client';
import { IUsersService } from '../types';

export const usersService: IUsersService = {
  getAll: async (params) => {
    const { data } = await client.get('/users', { params });
    return data;
  },
  update: async (id, payload) => {
    const { data } = await client.put(`/users/${id}`, payload);
    return data.data;
  },
  delete: async (id) => {
    const { data } = await client.delete(`/users/${id}`);
    return data.data;
  },
};
 Broadway