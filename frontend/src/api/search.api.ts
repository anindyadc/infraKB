import client from './client';

export const searchDocs = async (params: { q: string; category?: string; tag?: string; status?: string; page?: number; limit?: number }) => {
  const { data } = await client.get('/search', { params });
  return data;
};

export const suggestDocs = async (query: string) => {
  if (!query || query.length < 2) return [];
  const { data } = await client.get('/search/suggest', { params: { q: query } });
  return data.data;
};
