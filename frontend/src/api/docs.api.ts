import { docsService as expressDocs } from './express/docs.service';
import { docsService as supabaseDocs } from './supabase/docs.service';
import { IDocsService } from './types';

const backendType = import.meta.env.VITE_BACKEND_TYPE;

export const docsService: IDocsService = backendType === 'supabase' ? supabaseDocs : expressDocs;

// Export individual functions for backward compatibility with existing components
export const getDocs = docsService.getAll;
export const getDoc = docsService.getOne;
export const createDoc = docsService.create;
export const updateDoc = docsService.update;
export const deleteDoc = docsService.delete;
