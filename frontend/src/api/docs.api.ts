import client from './client';

export const getDocs = async (params: any) => {
  const { data } = await client.get('/docs', { params });
  return data;
};

export const getDoc = async (idOrSlug: string) => {
  const { data } = await client.get(`/docs/${idOrSlug}`);
  return data.data;
};

export const createDoc = async (payload: any) => {
  const { data } = await client.post('/docs', payload);
  return data.data;
};

export const updateDoc = async (id: number, payload: any) => {
  const { data } = await client.put(`/docs/${id}`, payload);
  return data.data;
};

export const deleteDoc = async (id: number) => {
  const { data } = await client.delete(`/docs/${id}`);
  return data.data;
};
