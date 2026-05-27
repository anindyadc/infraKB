import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { env } from '../../config/env.js';
import { AuthRequest } from '../../middleware/auth.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data = registerSchema.parse(req.body);
      const { user, accessToken, refreshToken } = await AuthService.register(data);
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            displayName: user.displayName,
          },
          accessToken,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: error.message },
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const data = loginSchema.parse(req.body);
      const { user, accessToken, refreshToken } = await AuthService.login(data);
      
      console.log(`User logged in: ${user.email}`);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            displayName: user.displayName,
          },
          accessToken,
        },
      });
    } catch (error: any) {
      console.error(`Login failed for ${req.body?.email}: ${error.message}`);
      const status = error.message === 'INVALID_CREDENTIALS' ? 401 : 403;
      return res.status(status).json({
        success: false,
        error: { code: error.message, message: 'Authentication failed' },
      });
    }
  }

  static async refresh(req: Request, res: Response) {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_REFRESH_TOKEN', message: 'No refresh token provided' },
      });
    }

    try {
      const { accessToken, refreshToken } = await AuthService.refresh(token);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        data: { accessToken },
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_REFRESH_TOKEN', message: error.message },
      });
    }
  }

  static async logout(req: Request, res: Response) {
    const token = req.cookies?.refreshToken;
    if (token) {
      await AuthService.logout(token).catch(() => {});
    }
    res.clearCookie('refreshToken');
    return res.status(204).send();
  }

  static async me(req: AuthRequest, res: Response) {
    return res.json({
      success: true,
      data: req.user,
    });
  }
}
