import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { createHash, randomUUID } from 'crypto';
import { Model, UpdateQuery } from 'mongoose';
import { IAuthRepository } from '../../application/ports/auth-repository.interface';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../application/ports/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { IAppConfig } from '../../shared/interfaces/app-config.interface';
import { Session, SessionDocument } from '../schemas/session.schema';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<IAppConfig>,
    @InjectModel(SessionDocument.name)
    private readonly sessionModel: Model<Session>,
  ) {}

  async validateUser(email: string, password: string): Promise<boolean> {
    try {
      const hash = await this.userRepository.getUserPasswordHash(email);
      if (!hash) {
        return false;
      }
      return await argon.verify(hash, password);
    } catch (error) {
      return false;
    }
  }

  async sign(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const user = await this.userRepository.getItem({ email });
    if (!user || !user.isActive) return null;
    const isValid = await this.validateUser(email, password);
    if (!isValid) return null;
    return await this.generateTokens(user);
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const refreshTokenHash = this.createHash(refreshToken);
    const session = (
      await this.sessionModel
        .findOne({ refreshTokenHash: refreshTokenHash })
        .exec()
    )?.toObject();
    if (
      !session ||
      !session.refreshTokenHash ||
      new Date() > new Date(session.expiredAt)
    )
      return null;
    const isValidRefreshToken = await argon.verify(
      session.argonHash,
      refreshToken,
    );
    const user = await this.userRepository.getItem({
      id: session.userId,
    });
    if (!user || !isValidRefreshToken) return null;
    return await this.generateTokens(user);
  }

  async terminateSession(userId: string): Promise<boolean> {
    const session = await this.sessionModel.findOneAndDelete({
      userId: userId,
    });
    console.log(session);
    return true;
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
      expiresIn: accessTokenExpiretyInMinutes * 60, // in second
    });
    const refreshToken = randomUUID();
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const refreshTokenArgonHash = await argon.hash(refreshToken);
    const refreshHash = this.createHash(refreshToken);
    const refreshTokenExpiretyInDays = this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRTY_IN_DAYS',
    ) as number;
    const updateQuery: UpdateQuery<Session> = {
      userId,
      refreshTokenHash: refreshHash,
      argonHash: refreshTokenArgonHash,
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

  private createHash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
