import client from '../client';
import { ITagsService } from '../types';

export const tagsService: ITagsService = {
  getAll: async () => {
    const { data } = await client.get('/tags');
    return data.data;
  },
  delete: async (id) => {
    const { data } = await client.delete(`/tags/${id}`);
    return data.data;
  },
};
 Broadway