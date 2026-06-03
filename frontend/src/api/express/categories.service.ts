import client from '../client';
import { ICategoriesService } from '../types';

export const categoriesService: ICategoriesService = {
  getAll: async () => {
    const { data } = await client.get('/categories');
    return data.data;
  },
  create: async (payload) => {
    const { data } = await client.post('/categories', payload);
    return data.data;
  },
  update: async (id, payload) => {
    const { data } = await client.put(`/categories/${id}`, payload);
    return data.data;
  },
  delete: async (id) => {
    const { data } = await client.delete(`/categories/${id}`);
    return data.data;
  },
};
