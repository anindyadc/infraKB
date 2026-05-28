import { tagsService as expressTags } from './express/tags.service';
import { tagsService as supabaseTags } from './supabase/tags.service';
import { ITagsService } from './types';

const backendType = import.meta.env.VITE_BACKEND_TYPE;

export const tagsService: ITagsService = backendType === 'supabase' ? supabaseTags : expressTags;

export const getTags = tagsService.getAll;
export const deleteTag = tagsService.delete;
 Broadway