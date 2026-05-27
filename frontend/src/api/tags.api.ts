import client from './client';

export const getTags = async () => {
  const { data } = await client.get('/tags');
  return data.data;
};

export const deleteTag = async (id: number) => {
  const { data } = await client.delete(`/tags/${id}`);
  return data.data;
};
