import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { randomUUID } from 'crypto';
import { Model, UpdateQuery } from 'mongoose';
import { IAuthRepository } from '../../application/ports/auth-repository.interface';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../application/ports/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { IAppConfig } from '../../shared/interfaces/app-config.interface';
import { Session } from '../schemas/session.schema';

export class AuthRepository implements IAuthRepository {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private jwtService: JwtService,
    private configService: ConfigService<IAppConfig>,
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}

  async validateUser(email: string, password: string): Promise<boolean> {
    try {
      const hash = await this.userRepository.getUserPasswordHash(email);
      if (!hash) {
        return false;
      }
      const isPasswordValid = await argon.verify(hash, password);
      return isPasswordValid;
    } catch (error) {
      return false;
    }
  }

  async sign(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const user = await this.userRepository.getItem({ email });
    if (!user) return null;
    const isValid = await this.validateUser(email, password);
    if (!isValid) return null;
    const response = await this.generateTokens(user);
    return response;
  }

  async refresh(
    userId: string,
    refreshHash: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const user = await this.userRepository.getItem({ id: userId });
    if (!user) return null;
    const session = await this.sessionModel.findOne({ userId: userId }).exec();
    if (!session || !session.toObject()?.refreshToken) return null;
    const isRefreshTokenValid = await argon.verify(
      session.toObject().refreshToken,
      refreshHash,
    );
    if (!isRefreshTokenValid) return null;
    return await this.generateTokens(user);
  }

  private getUserJwtPayload(user: User) {
    return {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      tenantId: user.tenantId,
    };
  }

  private async generateTokens(user: User) {
    const payload = this.getUserJwtPayload(user);
    const accessTokenExpiretyInMinutes = this.configService.get<number>(
      'ACCESS_TOKEN_EXPIRTY_IN_MINUTES',
    ) as number;
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: accessTokenExpiretyInMinutes * 60,
    });
    const refreshToken = randomUUID();
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    const refreshTokenExpiretyInDays = this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRTY_IN_DAYS',
    ) as number;
    const updateQuery: UpdateQuery<Session> = {
      userId,
      refreshToken: hashedRefreshToken,
      clientId: this.configService.get<string>('TENANT_ID'),
      issuedAt: new Date(),
      expiredAt: new Date(
        Date.now() + refreshTokenExpiretyInDays * 24 * 60 * 60 * 1000,
      ),
    };
    await this.sessionModel.findOneAndUpdate({ userId }, updateQuery, {
      upsert: true,
      new: true,
    });
  }
}
