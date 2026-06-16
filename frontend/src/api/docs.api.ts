import { docsService as expressDocs } from './express/docs.service';
import { docsService as supabaseDocs } from './supabase/docs.service';
import { IDocsService } from './types';

const envBackendType = (import.meta.env.VITE_BACKEND_TYPE || '').toLowerCase();
const isGitHubPages = window.location.hostname.includes('github.io');

// Default to supabase on GitHub Pages, otherwise default to express
export const backendType = envBackendType === 'supabase' || (isGitHubPages && !envBackendType) ? 'supabase' : 'express';

console.log('API: Detected Backend Type:', backendType);

export const docsService: IDocsService = backendType === 'supabase' ? supabaseDocs : expressDocs;
console.log('API: Selected Service Implementation:', backendType === 'supabase' ? 'Supabase' : 'Express');

// Export individual functions for backward compatibility with existing components
export const getDocs = docsService.getAll;
export const getDoc = docsService.getOne;
export const createDoc = docsService.create;
export const updateDoc = docsService.update;
export const deleteDoc = docsService.delete;
