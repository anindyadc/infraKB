import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email().max(255),
  username: z.string().min(3).max(80).regex(/^[a-zA-Z0-9.-]+$/, 'Invalid username format'),
  password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least 1 uppercase and 1 number'),
  displayName: z.string().min(2).max(120),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
