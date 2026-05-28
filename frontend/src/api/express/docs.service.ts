import client from '../client';
import { IDocsService } from '../types';

export const docsService: IDocsService = {
  getAll: async (params) => {
    const { data } = await client.get('/docs', { params });
    return data;
  },
  getOne: async (idOrSlug) => {
    const { data } = await client.get(`/docs/${idOrSlug}`);
    return data.data;
  },
  create: async (payload) => {
    const { data } = await client.post('/docs', payload);
    return data.data;
  },
  update: async (id, payload) => {
    const { data } = await client.put(`/docs/${id}`, payload);
    return data.data;
  },
  delete: async (id) => {
    const { data } = await client.delete(`/docs/${id}`);
    return data.data;
  },
};
 Broadway