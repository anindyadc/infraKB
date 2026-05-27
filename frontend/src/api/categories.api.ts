import client from './client';

export const getCategories = async () => {
  const { data } = await client.get('/categories');
  return data.data;
};

export const createCategory = async (payload: { name: string; icon?: string; description?: string; parentId?: number; sortOrder?: number }) => {
  const { data } = await client.post('/categories', payload);
  return data.data;
};

export const updateCategory = async (id: number, payload: { name?: string; icon?: string; description?: string; parentId?: number; sortOrder?: number }) => {
  const { data } = await client.put(`/categories/${id}`, payload);
  return data.data;
};

export const deleteCategory = async (id: number) => {
  const { data } = await client.delete(`/categories/${id}`);
  return data.data;
};
