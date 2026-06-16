import client from '../client';
import { IDocsService, Document } from '../types';

const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error('DATABASE_TIMEOUT')), ms));

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
    console.log('ExpressDocs: Creating document...', payload.title);
    try {
      const response = await Promise.race([
        client.post('/docs', payload),
        timeout(15000)
      ]) as any;
      return response.data.data;
    } catch (err: any) {
      console.error('ExpressDocs: Save failed:', err);
      throw err;
    }
  },
  update: async (id, payload) => {
    console.log('ExpressDocs: Updating document...', id);
    try {
      const response = await Promise.race([
        client.put(`/docs/${id}`, payload),
        timeout(15000)
      ]) as any;
      return response.data.data;
    } catch (err: any) {
      console.error('ExpressDocs: Update failed:', err);
      throw err;
    }
  },
  delete: async (id) => {
    const { data } = await client.delete(`/docs/${id}`);
    return data.data;
  },
};
