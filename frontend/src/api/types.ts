// src/api/types.ts

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface User {
  id: string | number;
  username: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  displayName: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  parentId?: number | null;
  children?: Category[];
  _count?: { docs: number };
}

export interface Document {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  categoryId?: number | null;
  category?: Category;
  authorId: string | number;
  author: Partial<User>;
  osEnv?: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'PUBLIC' | 'ARCHIVED';
  isPinned: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  tags?: { tag: { name: string; slug: string } }[];
  highlightedExcerpt?: string;
}

export interface IDocsService {
  getAll(params: any): Promise<{ docs: Document[]; pagination: Pagination }>;
  getOne(idOrSlug: string): Promise<Document>;
  create(payload: any): Promise<Document>;
  update(id: number, payload: any): Promise<Document>;
  delete(id: number): Promise<{ deleted: boolean }>;
}

export interface ICategoriesService {
  getAll(): Promise<{ categories: Category[]; uncategorizedCount: number }>;
  create(payload: any): Promise<Category>;
  update(id: number, payload: any): Promise<Category>;
  delete(id: number): Promise<{ deleted: boolean }>;
}

export interface ITagsService {
  getAll(): Promise<any[]>;
  delete(id: number): Promise<{ deleted: boolean }>;
}

export interface ISearchService {
  search(params: any): Promise<{ data: Document[]; pagination: Pagination; query: string }>;
  suggest(query: string): Promise<any[]>;
}

export interface IStatsService {
  getStats(): Promise<any>;
}
export interface IUsersService {
  getMe(): Promise<User>;
  getAll(params: any): Promise<{ data: User[]; pagination: Pagination }>;

  create(payload: any): Promise<User>;
  update(id: number | string, payload: any): Promise<User>;
  delete(id: number | string): Promise<{ deleted: boolean }>;
}

export interface IAttachmentsService {
  upload(file: File, docId: number): Promise<any>;
  delete(id: number): Promise<any>;
}
