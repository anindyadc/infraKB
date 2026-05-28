import client from '../client';
import { ISearchService } from '../types';

export const searchService: ISearchService = {
  search: async (params) => {
    const { data } = await client.get('/search', { params });
    return data;
  },
  suggest: async (query) => {
    if (!query || query.length < 2) return [];
    const { data } = await client.get('/search/suggest', { params: { q: query } });
    return data.data;
  },
};
 Broadway