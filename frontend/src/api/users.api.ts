import { usersService as expressUsers } from './express/users.service';
import { usersService as supabaseUsers } from './supabase/users.service';
import { IUsersService } from './types';

const backendType = import.meta.env.VITE_BACKEND_TYPE;
export const usersService: IUsersService = backendType === 'supabase' ? supabaseUsers : expressUsers;

export const getMe = usersService.getMe;
export const getUsers = usersService.getAll;
export const createUser = usersService.create;
export const updateUser = usersService.update;
export const deleteUser = usersService.delete;
