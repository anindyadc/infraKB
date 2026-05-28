import client from '../client';
import { IStatsService } from '../types';

export const statsService: IStatsService = {
  getStats: async () => {
    const { data } = await client.get('/stats');
    return data.data;
  },
};
 Broadway