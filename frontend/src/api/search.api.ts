import { searchService as expressSearch } from './express/search.service';
import { searchService as supabaseSearch } from './supabase/search.service';
import { ISearchService } from './types';

const backendType = import.meta.env.VITE_BACKEND_TYPE;

export const searchService: ISearchService = backendType === 'supabase' ? supabaseSearch : expressSearch;

export const searchDocs = searchService.search;
export const suggestDocs = searchService.suggest;
