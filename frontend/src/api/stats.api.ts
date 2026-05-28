import { statsService as expressStats } from './express/stats.service';
import { statsService as supabaseStats } from './supabase/stats.service';
import { IStatsService } from './types';

const backendType = import.meta.env.VITE_BACKEND_TYPE;

export const statsService: IStatsService = backendType === 'supabase' ? supabaseStats : expressStats;

export const getStats = statsService.getStats;
 Broadway