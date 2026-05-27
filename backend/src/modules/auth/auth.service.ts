import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma.js';
import { RegisterInput, LoginInput } from './auth.schema.js';
import { generateAccessToken, generateRefreshTokenString } from '../../utils/jwt.js';

export class AuthService {
  static async register(data: RegisterInput) {
    const userCount = await prisma.user.count();
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash: hashedPassword,
        displayName: data.displayName,
        role: userCount === 0 ? 'ADMIN' : 'EDITOR',
      },
    });

    const accessToken = generateAccessToken({ 
      sub: user.id, 
      username: user.username, 
      role: user.role 
    });
    
    const refreshToken = await this.createRefreshToken(user.id);

    return { user, accessToken, refreshToken };
  }

  static async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new Error('INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new Error('ACCOUNT_DISABLED');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = generateAccessToken({ 
      sub: user.id, 
      username: user.username, 
      role: user.role 
    });
    
    const refreshToken = await this.createRefreshToken(user.id);

    return { user, accessToken, refreshToken };
  }

  static async createRefreshToken(userId: number) {
    const token = generateRefreshTokenString();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const refreshToken = await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return refreshToken.token;
  }

  static async refresh(token: string) {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!refreshToken || refreshToken.revokedAt || refreshToken.expiresAt < new Date()) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }

    // Token rotation: revoke old, issue new
    await prisma.refreshToken.update({
      where: { id: refreshToken.id },
      data: { revokedAt: new Date() },
    });

    const accessToken = generateAccessToken({ 
      sub: refreshToken.user.id, 
      username: refreshToken.user.username, 
      role: refreshToken.user.role 
    });
    
    const newRefreshToken = await this.createRefreshToken(refreshToken.user.id);

    return { accessToken, refreshToken: newRefreshToken };
  }

  static async logout(token: string) {
    await prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() },
    });
  }
}
